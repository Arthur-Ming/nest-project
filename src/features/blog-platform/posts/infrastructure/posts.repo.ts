import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from '../api/dto/input/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../domain/posts.entity';
import { CreatePostDto } from '../api/dto/input/create-post.dto';

@Injectable()
export class PostsRepo {
  constructor(@InjectRepository(Post) private postsRepository: Repository<Post>) {}

  async add(post: CreatePostDto) {
    const p = await this.postsRepository.save({
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
    });

    return p.id;
  }

  async update(blogId: string, postId: string, dto: UpdatePostDto): Promise<boolean> {
    const updateResult = await this.postsRepository.update(
      { id: postId, blogId },
      {
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.content,
      }
    );
    return updateResult.affected === 1;
  }
  async remove(blogId: string, postId: string) {
    const deleteResult = await this.postsRepository.delete({
      id: postId,
      blogId,
    });

    return deleteResult.affected === 1;
  }
  async existsById(id: string) {
    return await this.postsRepository.existsBy({
      id,
    });
  }

  async existsForSpecificBlog(blogId: string, postId: string) {
    return await this.postsRepository.existsBy({
      id: postId,
      blogId,
    });
  }
}
