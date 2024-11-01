import { Injectable } from '@nestjs/common';
import { blogsMapToOutput } from '../api/dto/output/blogs.output.model';
import { BlogsPaginationQueryParamsDto } from '../api/dto/input/blogs-pagination-query-params.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  getTotalCount = async (queryParams: BlogsPaginationQueryParamsDto) => {
    const [{ count: totalCount }] = await this.dataSource.query(`
    SELECT COUNT(*) FROM "Blogs"
        WHERE "Blogs".name ILIKE '%${queryParams.searchNameTerm}%'`);
    return Number(totalCount);
  };

  async findByQueryParams(queryParams: BlogsPaginationQueryParamsDto) {
    const offSet = (queryParams.pageNumber - 1) * queryParams.pageSize;
    const limit = queryParams.pageSize;
    const d =
      queryParams.sortBy === 'createdAt' ? `"createdAt"` : `"${queryParams.sortBy}" COLLATE "C"`;
    const blogs = await this.dataSource.query(`
    SELECT * FROM "Blogs"
          WHERE "Blogs".name ILIKE '%${queryParams.searchNameTerm}%'
          ORDER BY ${d} ${queryParams.sortDirection}
          OFFSET ${offSet}
          LIMIT ${limit}
          `);
    const totalCount = await this.getTotalCount(queryParams);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      items: blogs.map((blog) => blogsMapToOutput(blog)),
    };
  }
  async findById(blogId: string) {
    const [blog] = await this.dataSource.query(`
  SELECT * FROM "Blogs"
  WHERE "Blogs".id='${blogId}'`);
    if (!blog) return null;
    return blogsMapToOutput(blog);
  }
}
