import { AuthTestNamesEnum } from '../auth/constans/auth-test-names.enum';
import { BlogTestNamesEnum } from '../blogs/constants/blog-test-names.enum';
import { PostsTestNamesEnum } from '../posts/constants/posts-test-names.enum';

export const skipSettings = {
  [AuthTestNamesEnum.auth]: true,
  [AuthTestNamesEnum.authRegistration]: true,
  [AuthTestNamesEnum.authRegistrationRateLimiting]: false,
  [AuthTestNamesEnum.authUserLogin]: false,

  [BlogTestNamesEnum.blogsAll]: false,
  [BlogTestNamesEnum.blogsReading]: false,
  [BlogTestNamesEnum.blogsCreating]: false,
  [BlogTestNamesEnum.blogsDeleting]: false,
  [BlogTestNamesEnum.blogsUpdating]: false,
  [BlogTestNamesEnum.blogsPagination]: true,

  [PostsTestNamesEnum.postsAll]: true,
  [PostsTestNamesEnum.postsCreating]: true,
  [PostsTestNamesEnum.postsPagination]: true,
};
