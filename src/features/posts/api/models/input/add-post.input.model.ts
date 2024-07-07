export interface AddPostInputModel {
  title: string;
  shortDescription: string;
  content: string;
}

export type WithBlogId<T> = T & { blogId: string };
