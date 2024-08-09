import { CreatePostDto } from '../../../../src/features/posts/api/dto/input/create-post.dto';
import { CreatePostForSpecifiedBlogDto } from '../../../../src/features/posts/api/dto/input/create-post-for-specified-blog.dto';

export const addPostDtoCreator = (
  blogId?: string
): CreatePostForSpecifiedBlogDto | CreatePostDto => ({
  title: 'title 1',
  shortDescription: 'shortDescription 1',
  content: 'content',
  blogId: blogId,
});
