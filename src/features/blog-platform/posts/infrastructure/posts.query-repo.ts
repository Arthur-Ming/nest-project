import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../api/dto/output/post.output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsPaginationQueryParamsDto } from '../api/dto/input/posts-pagination-query-params.dto';

const getMyLikeStatus = (
  likeAuthorId: string | null,
  requestUserId: string | null,
  likeStatus: LikeStatus
): LikeStatus => {
  if (!requestUserId) {
    return LikeStatus.None;
  }
  console.log('likeAuthorId');
  console.log(likeAuthorId);
  console.log('requestUserId');
  console.log(requestUserId);
  if (likeAuthorId === requestUserId) {
    return likeStatus;
  }

  return LikeStatus.None;
};

@Injectable()
export class PostsQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private mapToOutput = (
    posts: any, //PostDocument & { blogName: string }
    requestUserId: string | null
  ) /*: WithLikesInfo<PostOutputModel> */ => {
    const result = {};

    posts.forEach((post) => {
      if (!result[post.id]) {
        result[post.id] = {
          id: post.id.toString(),
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId.toString(),
          blogName: post.blogName,
          createdAt: post.createdAt.toISOString(),
          extendedLikesInfo: {
            likesCount: post.likeStatus === LikeStatus.Like ? 1 : 0,
            dislikesCount: post.likeStatus === LikeStatus.Dislike ? 1 : 0,
            myStatus: getMyLikeStatus(post.likeAuthorId, requestUserId, post.likeStatus),
            newestLikes:
              post.likeId && post.likeStatus === LikeStatus.Like
                ? [
                    {
                      addedAt: post.likeCreatedAt,
                      userId: post.likeAuthorId,
                      login: post.likeAuthorLogin,
                    },
                  ]
                : [],
          },
        };
      } else {
        result[post.id].extendedLikesInfo.likesCount =
          result[post.id].extendedLikesInfo.likesCount +
          (post.likeStatus === LikeStatus.Like ? 1 : 0);

        result[post.id].extendedLikesInfo.dislikesCount =
          result[post.id].extendedLikesInfo.dislikesCount +
          (post.likeStatus === LikeStatus.Dislike ? 1 : 0);

        result[post.id].extendedLikesInfo.myStatus =
          result[post.id].extendedLikesInfo.myStatus === LikeStatus.None
            ? getMyLikeStatus(post.likeAuthorId, requestUserId, post.likeStatus)
            : result[post.id].extendedLikesInfo.myStatus;

        post.likeId &&
          post.likeStatus === LikeStatus.Like &&
          result[post.id].extendedLikesInfo.newestLikes.push({
            addedAt: post.likeCreatedAt,
            userId: post.likeAuthorId,
            login: post.likeAuthorLogin,
          });
      }
    });
    return Object.values(result).map((item: any) => ({
      ...item,
      extendedLikesInfo: {
        ...item.extendedLikesInfo,
        newestLikes: item.extendedLikesInfo.newestLikes
          .sort((a, b) => b.addedAt - a.addedAt)
          .slice(0, 3),
      },
    }));
  };
  getTotalCount = async (blogId: string | null) => {
    if (!blogId) {
      const [{ count: totalCount }] = await this.dataSource.query(`
    SELECT COUNT(*) FROM "Posts" as p
      `);
      return Number(totalCount);
    }

    const [{ count: totalCount }] = await this.dataSource.query(`
    SELECT COUNT(*) FROM "Posts" as p
        WHERE p."blogId" = '${blogId}'`);
    return Number(totalCount);
  };

  async findById(postId: string, requestUserId: string | null) {
    const post = await this.dataSource.query(`
  SELECT 
  p.*, 
  b.name as "blogName",
  pl.id as "likeId",
  pl.status as "likeStatus", 
  pl."authorId" as "likeAuthorId", 
  pl."createdAt" as "likeCreatedAt",
  u.login as "likeAuthorLogin"
  FROM "Posts" as p
  JOIN "Blogs" as b ON p."blogId" =b.id
  LEFT JOIN "PostLikes" as pl ON pl."postId" = p.id
  LEFT JOIN "Users" as u ON pl."authorId" = u.id
  WHERE p.id='${postId}'`);
    if (!post) return null;

    return this.mapToOutput(post, requestUserId)[0];
  }

  async findAll(
    queryParams: PostsPaginationQueryParamsDto,
    requestUserId: string | null,
    blogId: string | null
  ) /*: Promise<Pagination<WithLikesInfo<PostOutputModel>[]>>*/ {
    const totalCount = await this.getTotalCount(blogId);
    const offSet = (queryParams.pageNumber - 1) * queryParams.pageSize;
    const limit = queryParams.pageSize;
    let d =
      queryParams.sortBy === 'createdAt' ? `"createdAt"` : `"${queryParams.sortBy}" COLLATE "C"`;
    d = d === `"blogName" COLLATE "C"` ? 'b.name' : `p.${d}`;
    const byBlogId = `AND p."blogId"='${blogId}'`;
    const posts = await this.dataSource.query(`
    SELECT p.*, 
    b.name as "blogName", 
    pl.id as "likeId",
    pl.status as "likeStatus", 
    pl."authorId" as "likeAuthorId", 
    pl."createdAt" as "likeCreatedAt",
    u.login as "likeAuthorLogin"
    FROM (SELECT p.* FROM "Posts" as p
          JOIN "Blogs" as b ON p."blogId" =b.id
          WHERE 
             p.title ILIKE '%${queryParams.searchNameTerm}%'
             ${blogId ? byBlogId : ''}
          ORDER BY ${d} ${queryParams.sortDirection}
          OFFSET ${offSet}
          LIMIT ${limit}
    ) as p
          JOIN "Blogs" as b ON p."blogId" =b.id
          LEFT JOIN "PostLikes" as pl ON pl."postId" = p.id
          LEFT JOIN "Users" as u ON pl."authorId" = u.id
          ORDER BY ${d} ${queryParams.sortDirection}
          
          
    `);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      items: this.mapToOutput(posts, requestUserId),
    };
  }
}
