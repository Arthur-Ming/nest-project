import { Injectable } from '@nestjs/common';
import { PostsRepo } from '../infrastructure/posts.repo';
import { AddPostInputModel, WithBlogId } from '../api/models/input/add-post.input.model';
import { ObjectId } from 'mongodb';
import { UpdatePostInputModel } from '../api/models/input/update-post.input.model';
import { mapToUpdatePostDto } from './utils/map-to-update-post-dto';

@Injectable()
export class PostsService {
  constructor(private postsRepo: PostsRepo) {}

  async addPost(addPostInputModel: WithBlogId<AddPostInputModel>): Promise<{ id: string }> {
    const addedPostId = await this.postsRepo.add({
      title: addPostInputModel.title,
      shortDescription: addPostInputModel.shortDescription,
      content: addPostInputModel.content,
      blogId: new ObjectId(addPostInputModel.blogId),
      createdAt: Number(new Date()),
    });

    return { id: addedPostId };
  }
  async updatePost(id: string, updatePostModel: UpdatePostInputModel) {
    const updatePostDTO = mapToUpdatePostDto(updatePostModel);

    await this.postsRepo.update(id, updatePostDTO);
  }
  async deletePost(postId: string) {
    await this.postsRepo.remove(postId);
  }
}
