import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blogs.entity';
import { UpdateBlogDto } from '../api/dto/input/update-blog.dto';
import { ICreateBlogDto } from '../api/dto/input/create-blog.dto';

@Injectable()
export class BlogsRepo {
  constructor(@InjectRepository(Blog) private blogsRepository: Repository<Blog>) {}

  async add(blog: ICreateBlogDto) {
    const b = await this.blogsRepository.save({
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: false,
    });

    return b.id;
  }

  async existsById(id: string) {
    return await this.blogsRepository.existsBy({
      id,
    });
  }

  async update(blogId: string, dto: UpdateBlogDto): Promise<boolean> {
    const updateResult = await this.blogsRepository.update(blogId, {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });
    return updateResult.affected === 1;
  }
  async remove(blogId: string) {
    const deleteResult = await this.blogsRepository.delete(blogId);

    return deleteResult.affected === 1;
  }
}
