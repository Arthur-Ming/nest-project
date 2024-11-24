import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from '../api/dto/input/update-post.dto';
import { CreatePostDto } from '../api/dto/input/create-post.dto';
import { PostsLikesRepo } from '../infrastructure/posts-likes.repo';
import { LikesStatusEnum } from '../../../../common/enum/likes-status.enum';
import { CommentsService } from '../../comments/application/comments.service';
import { CreateCommentDto } from '../../comments/api/dto/input/create-comment.dto';
import { PostsRepo } from '../infrastructure/posts.repo';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepoPg: PostsRepo,
    private readonly postsLikesRepo: PostsLikesRepo,
    private readonly commentsService: CommentsService
  ) {}

  async addPost(dto: CreatePostDto): Promise<{ id: string }> {
    const addedPostId = await this.postsRepoPg.add({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
    });

    return { id: addedPostId };
  }
  async updatePost(blogId: string, postId: string, updatePostDTO: UpdatePostDto) {
    await this.postsRepoPg.update(blogId, postId, updatePostDTO);
  }

  async addComment(dto: CreateCommentDto, userId: string, postId: string) {
    return await this.commentsService.createComment(dto, userId, postId);
  }

  async likePost(authorId: string, postId: string, status: LikesStatusEnum) {
    await this.postsLikesRepo.put({
      authorId,
      postId,
      status,
    });
  }
}
