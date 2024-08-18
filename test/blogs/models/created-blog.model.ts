import { createBlogMockDto } from '../mockData/create-blog.mock.dto';

export const createdBlogModel = {
  id: expect.any(String),
  name: createBlogMockDto.name,
  description: createBlogMockDto.description,
  websiteUrl: createBlogMockDto.websiteUrl,
  createdAt: expect.any(String),
  isMembership: false,
};
