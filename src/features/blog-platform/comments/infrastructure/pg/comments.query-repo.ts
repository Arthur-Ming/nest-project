import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../../api/dto/output/comments.output.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentsPaginationQueryParamsDto } from '../../api/dto/input/comments-pagination-query-params.dto';

const getMyLikeStatus = (
  likeAuthorId: string | null,
  requestUserId: string | null,
  likeStatus: LikeStatus
): LikeStatus => {
  if (!requestUserId) {
    return LikeStatus.None;
  }

  if (likeAuthorId !== requestUserId) {
    return LikeStatus.None;
  }

  return likeStatus;
};

@Injectable()
export class CommentsQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private mapToOutput = (
    comments: any, //PostDocument & { blogName: string }
    requestUserId: string | null
  ) /*: WithLikesInfo<PostOutputModel> */ => {
    const result = {};

    comments.forEach((comment) => {
      if (!result[comment.id]) {
        result[comment.id] = {
          id: comment.id.toString(),
          content: comment.content,
          createdAt: comment.createdAt.toISOString(),
          commentatorInfo: {
            userId: comment.userId.toString(),
            userLogin: comment?.userLogin || null,
          },
          likesInfo: {
            likesCount: comment.likeStatus === LikeStatus.Like ? 1 : 0,
            dislikesCount: comment.likeStatus === LikeStatus.Dislike ? 1 : 0,
            myStatus: getMyLikeStatus(comment.likeAuthorId, requestUserId, comment.likeStatus),
          },
        };
      } else {
        result[comment.id].likesInfo.likesCount =
          result[comment.id].likesInfo.likesCount +
          (comment.likeStatus === LikeStatus.Like ? 1 : 0);

        result[comment.id].likesInfo.dislikesCount =
          result[comment.id].likesInfo.dislikesCount +
          (comment.likeStatus === LikeStatus.Dislike ? 1 : 0);

        result[comment.id].likesInfo.myStatus =
          result[comment.id].likesInfo.myStatus === LikeStatus.None
            ? getMyLikeStatus(comment.likeAuthorId, requestUserId, comment.likeStatus)
            : result[comment.id].likesInfo.myStatus;
      }
    });
    return Object.values(result);
  };

  async findAll(
    queryParams: CommentsPaginationQueryParamsDto,
    postId: string,
    requestUserId: string | null
  ) /*: Promise<Pagination<CommentsOutputDto[]>> */ {
    const totalCount = await this.getTotalCount(postId);
    const offSet = (queryParams.pageNumber - 1) * queryParams.pageSize;
    const limit = queryParams.pageSize;
    let d =
      queryParams.sortBy === 'createdAt' ? `"createdAt"` : `"${queryParams.sortBy}" COLLATE "C"`;
    d = d === `"blogName" COLLATE "C"` ? 'b.name' : d;
    const comments = await this.dataSource.query(`
  SELECT 
  c.*, 
  u.login as "userLogin", 
  u.id as "userId",
  cl.status as "likeStatus",
  cl."authorId" as "likeAuthorId"
      FROM (SELECT * FROM "Comments" as c
          WHERE c."postId"='${postId}'
          ORDER BY ${d} ${queryParams.sortDirection}
          OFFSET ${offSet}
          LIMIT ${limit}
    ) as c
  LEFT JOIN "Users" as u ON c."userId" =u.id
  LEFT JOIN "CommentLikes" as cl ON cl."commentId" =c.id
  ORDER BY ${d} ${queryParams.sortDirection}
 
  `);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      items: this.mapToOutput(comments, requestUserId),
    };
  }
  getTotalCount = async (postId: string) => {
    const [{ count: totalCount }] = await this.dataSource.query(`
    SELECT COUNT(*) FROM "Comments" as c
        WHERE c."postId" = '${postId}'`);
    return Number(totalCount);
  };

  findById = async (commentId: string, requestUserId: string | null = null) => {
    const comment = await this.dataSource.query(`
  SELECT 
  c.*, 
  u.login as "userLogin", 
  u.id as "userId", 
  cl.status as "likeStatus",
  cl."authorId" as "likeAuthorId"
  FROM "Comments" as c
  LEFT JOIN "Users" as u ON c."userId" =u.id
  LEFT JOIN "CommentLikes" as cl ON cl."commentId" =c.id
  WHERE c.id='${commentId}'`);
    if (!comment) return null;

    return this.mapToOutput(comment, requestUserId)[0];
  };
}
