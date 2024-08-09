import { Injectable } from '@nestjs/common';
import { PostsRepo } from '../infrastructure/posts.repo';
import { ObjectId } from 'mongodb';
import { UpdatePostDto } from '../api/dto/input/update-post.dto';
import { CreatePostDto } from '../api/dto/input/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private postsRepo: PostsRepo) {}

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
  async deletePost(postId: string) {
    await this.postsRepo.remove(postId);
  }
}
