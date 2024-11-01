import { resources } from '../../../../common/enum/resources';

export enum BlogsRoutes {
  base = resources.blogs,
  byId = ':blogId',
  postsForSpecificBlog = ':blogId/posts',
}
