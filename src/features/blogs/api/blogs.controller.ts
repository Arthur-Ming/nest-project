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
import { AddPostInputModel } from '../../posts/api/models/input/add-post.input.model';
import { PostsQueryRepo } from '../../posts/infrastructure/posts.query-repo';
import { PostsQueryParamsInputModel } from '../../posts/api/models/input/posts-query-params.input.model';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepo: BlogsQueryRepo,
    private postsQueryRepo: PostsQueryRepo
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

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBlogById(@Param('id') id: string) {
    return await this.blogsQueryRepo.findById(id);
  }
  @Get(':id/posts')
  @HttpCode(HttpStatus.OK)
  async getPostsSpecificBlog(
    @Param('id') id: string,
    @Query()
    queryParams: PostsQueryParamsInputModel
  ) {
    const {
      searchNameTerm = '',
      sortBy = 'createdAt',
      sortDirection = SortDirections.desc,
      pageNumber = 1,
      pageSize = 10,
    } = queryParams;

    return await this.postsQueryRepo.findAll(
      {
        searchNameTerm,
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
      },
      id
    );
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addBlog(@Body() addBlogModel: AddBlogInputModel) {
    const addedBlogId = await this.blogsService.addBlog(addBlogModel);
    return await this.blogsQueryRepo.findById(addedBlogId);
  }

  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async addPostSpecificBlog(@Param('id') id: string, @Body() addPostInputModel: AddPostInputModel) {
    const addedPostId = await this.blogsService.addPostSpecificBlog(id, addPostInputModel);
    return this.postsQueryRepo.findById(addedPostId);
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
