import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsPaginationQueryParamsDto } from '../api/dto/input/posts-pagination-query-params.dto';
import { Post } from '../domain/posts.entity';

@Injectable()
export class PostsQueryRepo {
  constructor(@InjectRepository(Post) private postsRepository: Repository<Post>) {}

  private mapToOutput = (
    post: Post
    // requestUserId: string | null
  ) /*: WithLikesInfo<PostOutputModel> */ => {
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blog.name,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  };
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
    return this.mapToOutput(post);
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
    const sortDirection = queryParams.sortDirection.toUpperCase() as 'ASC' | 'DESC';

    if (blogId) {
      const posts = await this.postsRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.blog', 'b')
        .where('p.title ILIKE :title', { title: `%${queryParams.searchNameTerm}%` })
        .andWhere('p.blogId = :blogId', { blogId })
        .orderBy(d, sortDirection)
        .offset(offSet)
        .limit(limit)
        .getMany();

      return {
        pagesCount: Math.ceil(totalCount / queryParams.pageSize),
        page: queryParams.pageNumber,
        pageSize: queryParams.pageSize,
        totalCount: totalCount,
        items: posts.map((p) => this.mapToOutput(p /*, requestUserId*/)),
      };
    }
    const posts = await this.postsRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.blog', 'b')
      .where('p.title ILIKE :title', { title: `%${queryParams.searchNameTerm}%` })
      .orderBy(d, sortDirection)
      .offset(offSet)
      .limit(limit)
      .getMany();

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      items: posts.map((p) => this.mapToOutput(p /*, requestUserId*/)),
    };
  }
}
