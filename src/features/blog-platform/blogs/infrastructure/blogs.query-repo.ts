import { Injectable } from '@nestjs/common';
import { BlogsPaginationQueryParamsDto } from '../api/dto/input/blogs-pagination-query-params.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Blog } from '../domain/blogs.entity';

@Injectable()
export class BlogsQueryRepo {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>
  ) {}

  getTotalCount = async (queryParams: BlogsPaginationQueryParamsDto) => {
    return await this.blogsRepository
      .createQueryBuilder('b')
      .where('b.name ILIKE :e', { e: `%${queryParams.searchNameTerm}%` })
      .getCount();
  };

  async findByQueryParams(queryParams: BlogsPaginationQueryParamsDto) {
    const offSet = (queryParams.pageNumber - 1) * queryParams.pageSize;
    const limit = queryParams.pageSize;
    const d =
      queryParams.sortBy === 'createdAt' ? `"createdAt"` : `"${queryParams.sortBy}" COLLATE "C"`;

    const totalCount = await this.getTotalCount(queryParams);
    const sortDirection = queryParams.sortDirection.toUpperCase() as 'ASC' | 'DESC';

    const blogs = await this.blogsRepository
      .createQueryBuilder('b')
      .select(['b.id', 'b.name', 'b.description', 'b.websiteUrl', 'b.createdAt', 'b.isMembership'])
      .where('b.name ILIKE :e', { e: `%${queryParams.searchNameTerm}%` })
      .orderBy(d, sortDirection)
      .offset(offSet)
      .limit(limit)
      .getMany();

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      items: blogs, //.map((blog) => blogsMapToOutput(blog)),
    };
  }
  async findById(blogId: string) {
    const blog = await this.blogsRepository
      .createQueryBuilder('b')
      .select(['b.id', 'b.name', 'b.description', 'b.websiteUrl', 'b.createdAt', 'b.isMembership'])
      .where('b.id = :id', { id: blogId })
      .getOne();

    if (!blog) return null;
    return blog;
  }
}
