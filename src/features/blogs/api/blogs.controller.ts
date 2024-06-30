import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepo } from '../infrastructure/blogs.query-repo';
import {
  BlogInputBody,
  BlogsQueryParams,
  BlogsSortDirection,
} from './models/input/blogs.input.model';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepo: BlogsQueryRepo
  ) {}
  @Get()
  getBlogs(
    @Query()
    queryParams: BlogsQueryParams
  ) {
    const {
      searchNameTerm = '',
      sortBy = 'createdAt',
      sortDirection = BlogsSortDirection.desc,
      pageNumber = 1,
      pageSize = 10,
    } = queryParams;

    return this.blogsQueryRepo.findAll({
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    });
  }
  @Post()
  @HttpCode(200)
  addBlog(@Body() createModel: BlogInputBody) {
    return this.blogsService.addBlog(createModel);
  }
}
