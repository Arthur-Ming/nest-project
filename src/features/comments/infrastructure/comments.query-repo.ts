import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId, WithId } from 'mongodb';
import { Comment } from '../domain/comments.entity';
import { User } from '../../users/domain/users.entity';
import { CommentsOutputDto, LikeStatus } from '../api/dto/output/comments.output.dto';
import { Pagination } from '../../../common/types';
import { CommentsPaginationQueryParamsDto } from '../api/dto/input/comments-pagination-query-params.dto';
import { CommentLikes } from '../domain/comment-likes.entity';

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
@Injectable()
export class CommentsQueryRepo {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  private mapToOutput = (
    comment: WithId<Comment>,
    commentator: WithId<User>,
    likes: WithId<CommentLikes>[],
    requestUserId: string | null
  ): CommentsOutputDto => {
    return {
      id: comment._id.toString(),
      content: comment.content,
      createdAt: new Date(comment.createdAt).toISOString(),
      commentatorInfo: {
        userLogin: commentator?.login || null,
        userId: commentator._id.toString(),
      },
      likesInfo: {
        likesCount: likes.filter((like) => like.status === LikeStatus.Like).length,
        dislikesCount: likes.filter((like) => like.status === LikeStatus.Dislike).length,
        myStatus: getCurrentUserLikeStatus(likes, requestUserId),
      },
    };
  };
  private joinOptions = () => {
    return [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'commentlikes',
          localField: '_id',
          foreignField: 'commentId',
          as: 'likes',
        },
      },

      {
        $addFields: {
          commentator: { $mergeObjects: [{ $arrayElemAt: ['$user', 0] }] },
        },
      },

      {
        $project: {
          _id: 1,
          content: 1,
          createdAt: 1,
          userId: 1,
          postId: 1,
          likes: 1,
          commentator: 1,
        },
      },
    ];
  };
  findById = async (commentId: string, requestUserId: string | null) => {
    const aggregatedComments = await this.commentModel.aggregate([
      {
        $match: { _id: new ObjectId(commentId) },
      },
      ...this.joinOptions(),
    ]);

    if (!aggregatedComments || !aggregatedComments[0]) {
      return null;
    }

    return this.mapToOutput(
      {
        _id: aggregatedComments[0]._id,
        userId: aggregatedComments[0].userId,
        postId: aggregatedComments[0].postId,
        content: aggregatedComments[0].content,
        createdAt: aggregatedComments[0].createdAt,
      },
      aggregatedComments[0].commentator,
      aggregatedComments[0].likes,
      requestUserId
    );
  };
  getTotalCount = async (postId: string) => {
    return this.commentModel.countDocuments({
      postId: new ObjectId(postId),
    });
  };

  async findAll(
    queryParams: CommentsPaginationQueryParamsDto,
    postId: string,
    requestUserId: string | null
  ): Promise<Pagination<CommentsOutputDto[]>> {
    const comments = await this.commentModel.aggregate([
      {
        $match: { postId: new ObjectId(postId) },
      },
      ...this.joinOptions(),
      { $sort: { [queryParams.sortBy]: queryParams.sortDirection === 'asc' ? 1 : -1 } },
      { $skip: (queryParams.pageNumber - 1) * queryParams.pageSize },
      { $limit: queryParams.pageSize },
    ]);

    const totalCount = await this.getTotalCount(postId);

    console.log(comments);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      items: comments.map((comment) => {
        return this.mapToOutput(
          {
            _id: comment._id,
            userId: comment.userId,
            postId: comment.postId,
            content: comment.content,
            createdAt: comment.createdAt,
          },
          comment.commentator,
          comment.likes,
          requestUserId
        );
      }),
    };
  }
}
