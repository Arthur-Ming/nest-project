import { AuthTestNamesEnum } from '../auth/constans/auth-test-names.enum';
import { skipSettings } from './skip-settings';
import { BlogTestNamesEnum } from '../blogs/constants/blog-test-names.enum';
import { PostsTestNamesEnum } from '../posts/constants/posts-test-names.enum';

type TestNames = AuthTestNamesEnum | BlogTestNamesEnum | PostsTestNamesEnum;
export function aDescribe(testName: TestNames | null = null): jest.Describe {
  if (testName === null) {
    return describe;
  }
  if (skipSettings[testName]) {
    return describe.skip;
  }
  return describe;
}
