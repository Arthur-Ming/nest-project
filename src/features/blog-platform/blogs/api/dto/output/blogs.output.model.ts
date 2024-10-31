export interface BlogOutputData {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date | string;
  isMembership: boolean;
}

export const blogsMapToOutput = (dbBlog: any): BlogOutputData => {
  return {
    id: dbBlog.id,
    name: dbBlog.name,
    description: dbBlog.description,
    websiteUrl: dbBlog.websiteUrl,
    createdAt: dbBlog.createdAt.toISOString(),
    isMembership: dbBlog.isMembership,
  };
};
