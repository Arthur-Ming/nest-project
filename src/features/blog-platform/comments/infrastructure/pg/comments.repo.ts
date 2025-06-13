import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../domain/pg/comments.entity';
import { UpdateCommentDto } from '../../api/dto/input/update-comment.dto';
import { CreateCommentDto } from '../../api/dto/input/create-comment.dto';

@Injectable()
export class CommentsRepo {
  constructor(@InjectRepository(Comment) private commentsRepository: Repository<Comment>) {}

  async add(postId: string, authorId: string, dto: CreateCommentDto) {
    const c = await this.commentsRepository.save({
      content: dto.content,
      authorId,
      postId,
    });

    return c.id;
  }

  async update(commentId: string, dto: UpdateCommentDto): Promise<boolean> {
    const updateResult = await this.commentsRepository.update(
      { id: commentId },
      {
        content: dto.content,
      }
    );
    return updateResult.affected === 1;
  }

  async removeById(id: string) {
    const deleteResult = await this.commentsRepository.delete({
      id,
    });

    return deleteResult.affected === 1;
  }

  async getById(id: string) {
    return await this.commentsRepository.findOneBy({
      id,
    });
  }

  async existsById(id: string) {
    return await this.commentsRepository.existsBy({
      id,
    });
  }
}
