import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { BlogOutputData, blogsMapToOutput } from '../api/dto/output/blogs.output.model';
import { Pagination } from '../../../common/types';
import { BlogsQueryParamsDto } from '../api/dto/input/blogs-query-params.dto';

const filter = ({ searchNameTerm }: BlogsQueryParamsDto) => {
  return searchNameTerm
    ? {
        name: {
          $regex: searchNameTerm,
          $options: 'i',
        },
      }
    : {};
};
@Injectable()
export class BlogsQueryRepo {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  getTotalCount = async (queryParams: BlogsQueryParamsDto) => {
    return this.blogModel.countDocuments(filter(queryParams));
  };
  async findByQueryParams(queryParams: BlogsQueryParamsDto): Promise<Pagination<BlogOutputData[]>> {
    const blogs = await this.blogModel.find(
      filter(queryParams),
      {},
      {
        sort: { [queryParams.sortBy]: queryParams.sortDirection === 'asc' ? 1 : -1 },
        skip: (queryParams.pageNumber - 1) * queryParams.pageSize,
        limit: queryParams.pageSize,
      }
    );
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
    const blog = await this.blogModel.findById(blogId);

    return blog ? blogsMapToOutput(blog) : null;
  }
}
