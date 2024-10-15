import { resources } from '../../../../common/enum/resources';

export enum BlogsRoutes {
  base = resources.blogs,
  byId = ':id',
  postsForSpecificBlog = ':id/posts',
}
