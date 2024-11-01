import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { LikeStatus, PostOutputModel, WithLikesInfo } from '../api/dto/output/post.output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsPaginationQueryParamsDto } from '../api/dto/input/posts-pagination-query-params.dto';
import { Pagination } from '../../../../common/types';

const getCurrentUserLikeStatus = (likes: any[], currentUserId: string | null): LikeStatus => {
  if (!currentUserId) {
    return LikeStatus.None;
  }
  const currentUserLike = likes.find((like) => like.authorId.toString() === currentUserId);
  if (!currentUserLike) {
    return LikeStatus.None;
  }

  return currentUserLike.status;
};

const filter = (blogId: string | null) => {
  return blogId
    ? {
        blogId: new ObjectId(blogId),
      }
    : {};
};
@Injectable()
export class PostsQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  private mapToOutput = (
    post: any, //PostDocument & { blogName: string }
    requestUserId: string | null
  ): WithLikesInfo<PostOutputModel> => {
    return {
      id: post.id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt.toISOString(),
      extendedLikesInfo: {
        likesCount: 0, // post.likes.filter((like) => like.status === LikeStatus.Like).length,
        dislikesCount: 0, //post.likes.filter((like) => like.status === LikeStatus.Dislike).length,
        myStatus: LikeStatus.None, // getCurrentUserLikeStatus(post.likes, requestUserId),
        newestLikes: [],
      },
    };
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
    const [post] = await this.dataSource.query(`
  SELECT p.*, b.name as "blogName" FROM "Posts" as p
  JOIN "Blogs" as b ON p."blogId" =b.id
  WHERE p.id='${postId}'`);
    if (!post) return null;
    return this.mapToOutput(post, requestUserId);
  }

  async findAll(
    queryParams: PostsPaginationQueryParamsDto,
    requestUserId: string | null,
    blogId: string | null
  ): Promise<Pagination<WithLikesInfo<PostOutputModel>[]>> {
    console.log(blogId);
    const totalCount = await this.getTotalCount(blogId);
    const offSet = (queryParams.pageNumber - 1) * queryParams.pageSize;
    const limit = queryParams.pageSize;
    let d =
      queryParams.sortBy === 'createdAt' ? `"createdAt"` : `"${queryParams.sortBy}" COLLATE "C"`;
    d = d === `"blogName" COLLATE "C"` ? 'b.name' : d;
    console.log(d);
    const posts = await this.dataSource.query(`
    SELECT p.*, b.name as "blogName" FROM "Posts" as p
          JOIN "Blogs" as b ON p."blogId" =b.id
          WHERE p.title ILIKE '%${queryParams.searchNameTerm}%'
          ORDER BY ${d} ${queryParams.sortDirection}
          OFFSET ${offSet}
          LIMIT ${limit}
          `);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      items: posts.map((post) => this.mapToOutput(post, requestUserId)),
    };
  }
}
