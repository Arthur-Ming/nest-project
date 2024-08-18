import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateBlogDto } from '../../../src/features/blogs/api/dto/input/create-blog.dto';
import { createdBlogModel } from '../models/created-blog.model';
import { UpdateBlogDto } from '../../../src/features/blogs/api/dto/input/update-blog.dto';
import { QueryParamsDto } from '../../../src/common/dto/query-params.dto';

export class BlogsTestManager {
  constructor(protected readonly app: INestApplication) {}
  expectCorrectModel(responseModel: any, correctModel: any = createdBlogModel) {
    expect(responseModel).toMatchObject(correctModel);
  }
  expectValidationError(resBody: any, validationFields: Array<string>) {
    expect(resBody).toEqual({
      errorsMessages: expect.any(Array),
    });

    expect(resBody.errorsMessages.sort((a, b) => a.field.localeCompare(b.field))).toMatchObject(
      validationFields
        .map((field) => ({
          message: expect.any(String),
          field,
        }))
        .sort((a, b) => a.field.localeCompare(b.field))
    );
  }
  expectPaginationParams(responseModel: any, queryParams: QueryParamsDto, totalCount: number) {
    expect(responseModel).toMatchObject({
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      items: expect.any(Array),
    });

    const skip = (queryParams.pageNumber - 1) * queryParams.pageSize;

    const expectedItemsLength = Array(totalCount).slice(
      skip,
      queryParams.pageSize * queryParams.pageNumber
    ).length;
    expect(responseModel.items).toHaveLength(expectedItemsLength);
  }

  async createBlog(dto: CreateBlogDto, statusCode: number = HttpStatus.CREATED) {
    return await request(this.app.getHttpServer()).post('/blogs').send(dto).expect(statusCode);
  }

  async updateBlog(dto: UpdateBlogDto, blogId: string, statusCode: number = HttpStatus.NO_CONTENT) {
    return await request(this.app.getHttpServer())
      .put('/blogs' + '/' + blogId)
      .send(dto)
      .expect(statusCode);
  }

  async mustBeEmpty() {
    const res = await request(this.app.getHttpServer()).get('/blogs').expect(HttpStatus.OK);
    expect(res.body.items).toEqual([]);
  }
  async getBlogById(id: string, statusCode: number = HttpStatus.OK) {
    return await request(this.app.getHttpServer())
      .get('/blogs' + '/' + id)
      .expect(statusCode);
  }

  async deleteBlogById(id: string, statusCode: number = HttpStatus.NO_CONTENT) {
    return await request(this.app.getHttpServer())
      .delete('/blogs' + '/' + id)
      .expect(statusCode);
  }
}
