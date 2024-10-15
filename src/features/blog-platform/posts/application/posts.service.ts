import { Injectable } from '@nestjs/common';
import { PostsRepo } from '../infrastructure/posts.repo';
import { ObjectId } from 'mongodb';
import { UpdatePostDto } from '../api/dto/input/update-post.dto';
import { CreatePostDto } from '../api/dto/input/create-post.dto';
import { PostsLikesRepo } from '../infrastructure/posts-likes.repo';
import { LikesStatusEnum } from '../../../../common/enum/likes-status.enum';
import { CommentsService } from '../../comments/application/comments.service';
import { CreateCommentDto } from '../../comments/api/dto/input/create-comment.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepo: PostsRepo,
    private readonly postsLikesRepo: PostsLikesRepo,
    private readonly commentsService: CommentsService
  ) {}

  async addPost(dto: CreatePostDto): Promise<{ id: string }> {
    const addedPostId = await this.postsRepo.add({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: new ObjectId(dto.blogId),
      createdAt: Number(new Date()),
    });

    return { id: addedPostId };
  }
  async updatePost(id: string, updatePostDTO: UpdatePostDto) {
    await this.postsRepo.update(id, updatePostDTO);
  }

  async addComment(dto: CreateCommentDto, userId: string, postId: string) {
    return await this.commentsService.createComment(dto, userId, postId);
  }
  async deletePost(postId: string) {
    await this.postsRepo.remove(postId);
  }

  async likePost(authorId: string, postId: string, status: LikesStatusEnum) {
    await this.postsLikesRepo.put({
      createdAt: Date.now(),
      authorId: new ObjectId(authorId),
      postId: new ObjectId(postId),
      status,
    });
  }
}
