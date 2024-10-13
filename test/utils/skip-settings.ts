import { AuthTestNamesEnum } from '../auth/constans/auth-test-names.enum';
import { BlogTestNamesEnum } from '../blogs/constants/blog-test-names.enum';
import { PostsTestNamesEnum } from '../posts/constants/posts-test-names.enum';

export const skipSettings = {
  [AuthTestNamesEnum.auth]: true,
  [AuthTestNamesEnum.authRegistration]: true,
  [AuthTestNamesEnum.authRegistrationRateLimiting]: false,
  [AuthTestNamesEnum.authUserLogin]: false,

  [BlogTestNamesEnum.blogsAll]: true,
  [BlogTestNamesEnum.blogsReading]: false,
  [BlogTestNamesEnum.blogsCreating]: false,
  [BlogTestNamesEnum.blogsDeleting]: false,
  [BlogTestNamesEnum.blogsUpdating]: false,
  [BlogTestNamesEnum.blogsPagination]: false,

  [PostsTestNamesEnum.postsAll]: false,
  [PostsTestNamesEnum.postsCreating]: false,
  [PostsTestNamesEnum.postsPagination]: true,
};
