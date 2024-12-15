import { CreatePostForSpecifiedBlogDto } from '../../dto/input/create-post-for-specified-blog.dto';
import { CreatePostDto } from '../../dto/input/create-post.dto';

export const addPostDtoCreator = (
  blogId?: string
): CreatePostForSpecifiedBlogDto | CreatePostDto => ({
  title: 'title 1',
  shortDescription: 'shortDescription 1',
  content: 'content',
  blogId: blogId,
});
