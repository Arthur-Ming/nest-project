import { CreatePostForSpecifiedBlogDto } from '../../../../src/features/posts/api/dto/input/create-post-for-specified-blog.dto';
import { BlogOutputData } from '../../../../src/features/blogs/api/dto/output/blogs.output.model';

export const postDtoCreator = (
  postInfo: CreatePostForSpecifiedBlogDto,
  blogInfo: BlogOutputData
) => ({
  id: expect.any(String),
  title: postInfo.title,
  shortDescription: postInfo.shortDescription,
  content: postInfo.content,
  blogId: blogInfo.id,
  blogName: blogInfo.name,
  createdAt: expect.any(String),
  extendedLikesInfo: {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: 'None',
    newestLikes: [],
  },
});
