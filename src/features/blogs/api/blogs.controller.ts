import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepo } from '../infrastructure/blogs.query-repo';
import { BlogsQueryParams } from './models/input/blogs-query-params.input.model';
import { AddBlogInputModel } from './models/input/add-blog.input.model';
import { UpdateBlogInputModel } from './models/input/update-blog.input.model';
import { SortDirections } from '../../../common/types/interfaces';

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
      sortDirection = SortDirections.desc,
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
  @HttpCode(HttpStatus.CREATED)
  addBlog(@Body() addBlogModel: AddBlogInputModel) {
    return this.blogsService.addBlog(addBlogModel);
  }
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param('id') id: string, @Body() updateBlogModel: UpdateBlogInputModel) {
    await this.blogsService.updateBlog(id, updateBlogModel);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string) {
    await this.blogsService.deleteBlog(id);
  }
}
