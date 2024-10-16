import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { LikeStatus, PostOutputModel, WithLikesInfo } from '../api/dto/output/post.output.model';
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
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}
  private mapToOutput = (
    post: any, //PostDocument & { blogName: string }
    requestUserId: string | null
  ): WithLikesInfo<PostOutputModel> => {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: new Date(post.createdAt).toISOString(),
      extendedLikesInfo: {
        likesCount: post.likes.filter((like) => like.status === LikeStatus.Like).length,
        dislikesCount: post.likes.filter((like) => like.status === LikeStatus.Dislike).length,
        myStatus: getCurrentUserLikeStatus(post.likes, requestUserId),
        newestLikes: post.likes
          .filter((like) => like.status === LikeStatus.Like)
          .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))
          .map((like) => ({
            addedAt: new Date(like.createdAt).toISOString(),
            userId: like.likeAuthor?._id ? like.likeAuthor._id.toString() : null,
            login: like.likeAuthor?.login ? like.likeAuthor.login : null,
          }))
          .slice(0, 3),
      },
    };
  };
  private joinOptions = () => {
    return [
      {
        $lookup: {
          from: 'blogs',
          localField: 'blogId',
          foreignField: '_id',
          as: 'blog',
        },
      },

      {
        $lookup: {
          from: 'postlikes',
          localField: '_id',
          foreignField: 'postId',
          as: 'likes',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'authorId',
                foreignField: '_id',
                as: 'likeAuthors',
              },
            },
            {
              $addFields: {
                likeAuthor: { $mergeObjects: [{ $arrayElemAt: ['$likeAuthors', 0] }] },
              },
            },
          ],
        },
      },

      {
        $addFields: {
          blogInfo: { $mergeObjects: [{ $arrayElemAt: ['$blog', 0] }] },
        },
      },

      {
        $project: {
          _id: 1,
          title: 1,
          shortDescription: 1,
          content: 1,
          blogName: '$blogInfo.name',
          blogId: 1,
          createdAt: 1,
          likes: 1,
          likeAuthor: 1,
        },
      },
    ];
  };
  getTotalCount = async (blogId: string | null) => {
    return this.postModel.countDocuments(filter(blogId));
  };
  findById = async (postId: string, requestUserId: string | null) => {
    const posts = await this.postModel.aggregate([
      {
        $match: { _id: new ObjectId(postId) },
      },
      ...this.joinOptions(),
    ]);

    if (!posts || !posts[0]) {
      return null;
    }

    return this.mapToOutput(posts[0], requestUserId);
  };

  async findAll(
    queryParams: PostsPaginationQueryParamsDto,
    requestUserId: string | null,
    blogId: string | null
  ): Promise<Pagination<WithLikesInfo<PostOutputModel>[]>> {
    const posts = await this.postModel.aggregate([
      {
        $match: { blogId: blogId ? new ObjectId(blogId) : { $exists: true } },
      },
      ...this.joinOptions(),
      { $sort: { [queryParams.sortBy]: queryParams.sortDirection === 'asc' ? 1 : -1 } },
      { $skip: (queryParams.pageNumber - 1) * queryParams.pageSize },
      { $limit: queryParams.pageSize },
    ]);
    const totalCount = await this.getTotalCount(blogId);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      items: posts.map((post) => this.mapToOutput(post, requestUserId)),
    };
  }
}
