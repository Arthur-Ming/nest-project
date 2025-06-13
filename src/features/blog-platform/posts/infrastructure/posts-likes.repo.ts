import { Injectable } from '@nestjs/common';
import { IPostsLikes, PostsLikes } from '../domain/posts-likes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsLikesRepo {
  constructor(@InjectRepository(PostsLikes) private postsLikesRepository: Repository<PostsLikes>) {}

  async existsByPostIdAndAuthorId(postId: string, authorId: string) {
    return await this.postsLikesRepository.existsBy({
      postId,
      authorId,
    });
  }

  async put(dto: IPostsLikes) {
    const isExists = await this.existsByPostIdAndAuthorId(dto.postId, dto.authorId);
    if (!isExists) {
      const p = await this.postsLikesRepository.save({
        status: dto.status,
        authorId: dto.authorId,
        postId: dto.postId,
      });

      return p.id;
    }

    const updateResult = await this.postsLikesRepository.update(
      { postId: dto.postId, authorId: dto.authorId },
      {
        status: dto.status,
        createdAt: () => 'CURRENT_TIMESTAMP',
      }
    );
    return updateResult.affected === 1;
  }
}
