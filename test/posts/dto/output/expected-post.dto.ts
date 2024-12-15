import { CreatePostDto } from '../input/create-post.dto';
import { BlogOutputData } from '../../../../src/features/blog-platform/blogs/api/dto/output/blogs.output.model';

export class ExpectedPostDto {
  id = expect.any(String);
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt = expect.any(String);
  extendedLikesInfo = {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: 'None',
    newestLikes: [],
  };
  constructor(postInfo: CreatePostDto, blogInfo: BlogOutputData) {
    this.title = postInfo.title;
    this.shortDescription = postInfo.shortDescription;
    this.content = postInfo.content;
    this.blogId = blogInfo.id;
    this.blogName = blogInfo.name;
  }
}
