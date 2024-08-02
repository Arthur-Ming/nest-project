import {
  AddPostInputModel,
  WithBlogId,
} from '../../../../src/features/posts/api/models/input/add-post.input.model';

export const addPostDtoCreator = (
  blogId?: string
): WithBlogId<AddPostInputModel> | AddPostInputModel => ({
  title: 'title 1',
  shortDescription: 'shortDescription 1',
  content: 'content',
  blogId: blogId,
});
