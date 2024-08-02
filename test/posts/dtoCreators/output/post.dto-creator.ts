import { AddPostInputModel } from '../../../../src/features/posts/api/models/input/add-post.input.model';
import { BlogOutputData } from '../../../../src/features/blogs/api/models/output/blogs.output.model';

export const postDtoCreator = (postInfo: AddPostInputModel, blogInfo: BlogOutputData) => ({
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
