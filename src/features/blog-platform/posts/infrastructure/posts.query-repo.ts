import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostsPaginationQueryParamsDto } from '../api/dto/input/posts-pagination-query-params.dto';
import { Post } from '../domain/posts.entity';
import { PostsLikes } from '../domain/posts-likes.entity';
import { LikeStatus } from '../api/dto/output/post.output.model';
import { Pagination } from '../../../../common/types';

interface IPostLikesCount {
  postId: Post['id'];
  likesCount: string;
  dislikesCount: string;
}

type PostLikesCountMap = Record<Post['id'], { likesCount: string; dislikesCount: string }>;
type PostsLikesRawMap = Record<
  string,
  {
    postId: PostsLikes['postId'];
    createdAt: PostsLikes['createdAt'];
    author: {
      id: PostsLikes['authorId'];
      login: PostsLikes['author']['login'];
    };
  }
>;

interface IPostLikesRaw {
  postId: PostsLikes['postId'];
  status: PostsLikes['status'];
  createdAt: PostsLikes['createdAt'];
  login: PostsLikes['author']['login'];
  authorId: PostsLikes['authorId'];
}
export interface IPostOutputMap {
  id: Post['id'];
  title: Post['title'];
  shortDescription: Post['shortDescription'];
  content: Post['content'];
  blogId: Post['blogId'];
  blogName: Post['blog']['name'];
  createdAt: Post['createdAt'];
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: {
      addedAt: PostsLikes['createdAt'];
      userId: PostsLikes['author']['id'];
      login: PostsLikes['author']['login'];
    }[];
  };
}
@Injectable()
export class PostsQueryRepo {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(PostsLikes) private postsLikesRepository: Repository<PostsLikes>,
    @InjectDataSource() private dataSource: DataSource
  ) {}

  private mapToOutput = ({ post, postLikesCount, postLikes, myStatus }): IPostOutputMap => {
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blog.name,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: postLikesCount ? postLikesCount.likesCount : 0,
        dislikesCount: postLikesCount ? postLikesCount.dislikesCount : 0,
        myStatus: myStatus,
        newestLikes: postLikes
          ? postLikes.map((pl) => ({
              addedAt: pl.createdAt,
              userId: pl.author.id,
              login: pl.author.login,
            }))
          : [],
      },
    };
  };

  private mapPostLikesCount(postLikesCounts: IPostLikesCount[]): PostLikesCountMap {
    return postLikesCounts.reduce(
      (acc, item) => ({
        ...acc,
        [item.postId]: {
          likesCount: item.likesCount,
          dislikesCount: item.dislikesCount,
        },
      }),
      {}
    );
  }
  private mapMyPostLikeStatuses(myPostLikeStatuses: PostsLikes[]): Record<string, LikeStatus> {
    return myPostLikeStatuses.reduce(
      (acc, item) => ({
        ...acc,
        [item.postId]: item.status,
      }),
      {}
    );
  }

  private mapPostsLikesRaw<T extends IPostLikesRaw>(postLikes: T[]): PostsLikesRawMap {
    return postLikes
      .map((p) => ({
        postId: p.postId,
        createdAt: p.createdAt,
        author: {
          id: p.authorId,
          login: p.login,
        },
      }))
      .reduce(
        (acc, item) => ({
          ...acc,
          [item.postId]: acc[item.postId] ? [...acc[item.postId], item] : [item],
        }),
        {}
      );
  }
  private async getPostLikesCount(postIds: Post['id'][]) {
    return this.postsLikesRepository
      .createQueryBuilder('pl')
      .select([
        `"postId"`,
        `COUNT(CASE WHEN "status" = 'Like' THEN 1 END) AS "likesCount"`,
        `COUNT(CASE WHEN "status" = 'Dislike' THEN 2 END) AS "dislikesCount"`,
      ])
      .where('pl."postId" IN (:...postIds)', { postIds })
      .groupBy(`"postId"`)
      .getRawMany();
  }
  private async getMyPostLikeStatuses(userId: string | null, postIds: Post['id'][]) {
    return userId
      ? await this.postsLikesRepository
          .createQueryBuilder('pl')
          .select(['pl.status', 'pl.postId', 'pl.authorId'])
          .where('pl."postId" IN (:...postIds)', { postIds })
          .andWhere('pl."authorId" =:userId', { userId })
          .getMany()
      : [];
  }

  private async getPostLikesForOne(postId: Post['id']) {
    return this.postsLikesRepository
      .createQueryBuilder('pl')
      .select()
      .leftJoinAndSelect('pl.author', 'pl_a')
      .where('pl.postId = :id', { id: postId })
      .andWhere('pl.status = :s', { s: 'Like' })
      .orderBy('pl.createdAt', 'DESC')
      .limit(3)
      .getMany();
  }

  private async getPostLikesForMany<T extends IPostLikesRaw>(postIds: Post['id'][]): Promise<T[]> {
    return this.dataSource
      .createQueryBuilder()
      .select()
      .from((subQuery) => {
        return subQuery
          .select([
            `"postId"`,
            'status',
            `pl."createdAt"`,
            `pl_a.login`,
            `"authorId"`,
            `ROW_NUMBER() OVER (
                                      PARTITION BY
                                            "postId"
                                      ORDER BY
                                      pl."createdAt" DESC) as rn`,
          ])
          .from(PostsLikes, 'pl')
          .leftJoinAndSelect('pl.author', 'pl_a')
          .where('pl."postId" IN (:...postIds)', { postIds })
          .andWhere('pl.status = :s', { s: 'Like' });
      }, 'p')
      .andWhere('p.rn <= :l', { l: 3 })
      .getRawMany();
  }
  getTotalCount = async (blogId: string | null) => {
    if (!blogId) {
      return await this.postsRepository.createQueryBuilder('p').getCount();
    }
    return await this.postsRepository
      .createQueryBuilder('p')
      .where('p.blogId = :blogId', { blogId })
      .getCount();
  };

  async findById(postId: string, requestUserId: string | null) {
    const post = await this.postsRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.blog', 'b')
      .where('p.id = :id', { id: postId })
      .getOne();

    if (!post) return null;

    const [postLikesCount] = await this.getPostLikesCount([postId]);

    const postLikes = await this.getPostLikesForOne(postId);

    const [myPostLikeStatus = null] = await this.getMyPostLikeStatuses(requestUserId, [postId]);

    const myStatus = myPostLikeStatus ? myPostLikeStatus.status : LikeStatus.None;

    return this.mapToOutput({ post, postLikesCount, postLikes, myStatus });
  }

  async findAll(
    queryParams: PostsPaginationQueryParamsDto,
    requestUserId: string | null,
    blogId: string | null
  ): Promise<Pagination<IPostOutputMap[]>> {
    const totalCount = await this.getTotalCount(blogId);
    const offSet = (queryParams.pageNumber - 1) * queryParams.pageSize;
    const limit = queryParams.pageSize;
    let d =
      queryParams.sortBy === 'createdAt' ? `"createdAt"` : `"${queryParams.sortBy}" COLLATE "C"`;
    d = d === `"blogName" COLLATE "C"` ? 'b.name' : `p.${d}`;
    const sortDirection = queryParams.sortDirection.toUpperCase() as 'ASC' | 'DESC';

    const postsQB = await this.postsRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.blog', 'b')
      .where(`p.title ILIKE :title`, { title: `%${queryParams.searchNameTerm}%` })
      .orderBy(d, sortDirection)
      .offset(offSet)
      .limit(limit);

    const posts = blogId
      ? await postsQB.andWhere('p.blogId = :blogId', { blogId }).getMany()
      : await postsQB.getMany();

    const postIds = posts.map((p) => p.id);

    const postLikesCount = await this.getPostLikesCount(postIds);

    const myPostLikeStatuses = await this.getMyPostLikeStatuses(requestUserId, postIds);

    const myPostLikeStatusesMap = this.mapMyPostLikeStatuses(myPostLikeStatuses);

    const postLikesCountMap = this.mapPostLikesCount(postLikesCount);

    const postsLikes = await this.getPostLikesForMany(postIds);

    const postsLikesMap = this.mapPostsLikesRaw(postsLikes);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      items: posts.map((post) =>
        this.mapToOutput({
          post,
          postLikesCount: postLikesCountMap[post.id],
          postLikes: postsLikesMap[post.id],
          myStatus: myPostLikeStatusesMap[post.id] || LikeStatus.None,
        })
      ),
    };
  }
}
