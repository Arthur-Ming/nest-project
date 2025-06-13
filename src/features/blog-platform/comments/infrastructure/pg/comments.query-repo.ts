import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../../api/dto/output/comments.output.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentsPaginationQueryParamsDto } from '../../api/dto/input/comments-pagination-query-params.dto';
import { Comment } from '../../domain/pg/comments.entity';
import { CommentLike } from '../../domain/pg/comment-likes.entity';

interface ICommentLikesCount {
  commentId: Comment['id'];
  likesCount: string;
  dislikesCount: string;
}
type CommentLikesCountMap = Record<
  CommentLike['commentId'],
  { likesCount: string; dislikesCount: string }
>;
export interface ICommentsOutput {
  id: Comment['id'];
  content: Comment['content'];
  commentatorInfo: {
    userId: Comment['authorId'];
    userLogin: Comment['author']['login'];
  };
  createdAt: Comment['createdAt'];
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };
}

@Injectable()
export class CommentsQueryRepo {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    @InjectRepository(CommentLike) private commentsLikesRepository: Repository<CommentLike>
  ) {}

  private mapToOutput({ comment, commentLikesCount, myLikeStatus }): ICommentsOutput {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      commentatorInfo: {
        userId: comment.author.id,
        userLogin: comment.author.login,
      },
      likesInfo: {
        likesCount: Number(commentLikesCount ? commentLikesCount.likesCount : 0),
        dislikesCount: Number(commentLikesCount ? commentLikesCount.dislikesCount : 0),
        myStatus: myLikeStatus,
      },
    };
  }
  private async getMyCommentsLikeStatuses(userId: string | null, commentsIds: Comment['id'][]) {
    return userId
      ? await this.commentsLikesRepository
          .createQueryBuilder('cl')
          .select(['cl.status', 'cl.commentId', 'cl.authorId'])
          .where('cl."commentId" IN (:...commentsIds)', { commentsIds })
          .andWhere('cl."authorId" =:userId', { userId })
          .getMany()
      : [];
  }
  private async getCommentsLikesCount(commentsIds: Comment['id'][]) {
    return this.commentsLikesRepository
      .createQueryBuilder('cl')
      .select([
        `"commentId"`,
        `COUNT(CASE WHEN "status" = 'Like' THEN 1 END) AS "likesCount"`,
        `COUNT(CASE WHEN "status" = 'Dislike' THEN 2 END) AS "dislikesCount"`,
      ])
      .where('cl."commentId" IN (:...commentsIds)', { commentsIds })
      .groupBy(`"commentId"`)
      .getRawMany();
  }

  private mapCommentLikesCount(postLikesCounts: ICommentLikesCount[]): CommentLikesCountMap {
    return postLikesCounts.reduce(
      (acc, item) => ({
        ...acc,
        [item.commentId]: {
          likesCount: item.likesCount,
          dislikesCount: item.dislikesCount,
        },
      }),
      {}
    );
  }
  private mapMyCommentLikeStatuses(
    myCommentLikeStatuses: CommentLike[]
  ): Record<string, LikeStatus> {
    return myCommentLikeStatuses.reduce(
      (acc, item) => ({
        ...acc,
        [item.commentId]: item.status,
      }),
      {}
    );
  }
  async findAll(
    queryParams: CommentsPaginationQueryParamsDto,
    postId: string,
    requestUserId: string | null
  ) /*: Promise<Pagination<CommentsOutputDto[]>> */ {
    const totalCount = await this.getTotalCount(postId);
    const offSet = (queryParams.pageNumber - 1) * queryParams.pageSize;
    const limit = queryParams.pageSize;
    const d =
      queryParams.sortBy === 'createdAt' ? `"createdAt"` : `"${queryParams.sortBy}" COLLATE "C"`;

    const sortDirection = queryParams.sortDirection.toUpperCase() as 'ASC' | 'DESC';
    const comments = await this.commentsRepository
      .createQueryBuilder('c')
      .select()
      .leftJoinAndSelect('c.author', 'a')
      .where('c.postId = :id', { id: postId })
      .orderBy(`c.${d}`, sortDirection)
      .offset(offSet)
      .limit(limit)
      .getMany();
    const commentIds = comments.map((comment) => comment.id);

    const commentsLikesCount = await this.getCommentsLikesCount(commentIds);
    const commentsLikesCountMap = this.mapCommentLikesCount(commentsLikesCount);

    const myCommentLikeStatuses = await this.getMyCommentsLikeStatuses(requestUserId, commentIds);
    const myCommentLikeStatusesMap = this.mapMyCommentLikeStatuses(myCommentLikeStatuses);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      items: comments.map((comment) =>
        this.mapToOutput({
          comment,
          commentLikesCount: commentsLikesCountMap[comment.id],
          myLikeStatus: myCommentLikeStatusesMap[comment.id] || LikeStatus.None,
        })
      ),
    };
  }
  getTotalCount = async (postId: string) => {
    return await this.commentsRepository
      .createQueryBuilder('c')
      .where('c.postId = :postId', { postId })
      .getCount();
  };

  findById = async (commentId: string, requestUserId: string | null = null) => {
    const comment = await this.commentsRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.author', 'ca')
      .where('c.id = :id', { id: commentId })
      .getOne();

    const [commentLikesCount = null] = await this.getCommentsLikesCount([commentId]);
    const [myCommentsLikeStatus = null] = await this.getMyCommentsLikeStatuses(requestUserId, [
      commentId,
    ]);
    const myLikeStatus = myCommentsLikeStatus ? myCommentsLikeStatus.status : LikeStatus.None;

    return this.mapToOutput({ comment, commentLikesCount, myLikeStatus });
  };
}
