import { BlogDocument } from '../../../domain/blogs.entity';

export interface BlogOutputData {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export const blogsMapToOutput = (dbBlog: BlogDocument): BlogOutputData => {
  return {
    id: dbBlog._id.toString(),
    name: dbBlog.name,
    description: dbBlog.description,
    websiteUrl: dbBlog.websiteUrl,
    createdAt: new Date(dbBlog.createdAt).toISOString(),
    isMembership: dbBlog.isMembership,
  };
};
