import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { BlogOutputData, blogsMapToOutput } from '../api/models/output/blogs.output.model';
import { BlogsQueryParams } from '../api/models/input/blogs.input.model';
import { Pagination } from '../../../common/types';
const filter = ({ searchNameTerm }: BlogsQueryParams) => {
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

  getTotalCount = async (queryParams: BlogsQueryParams) => {
    return this.blogModel.countDocuments(filter(queryParams));
  };
  async findAll(queryParams: BlogsQueryParams): Promise<Pagination<BlogOutputData[]>> {
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
}
