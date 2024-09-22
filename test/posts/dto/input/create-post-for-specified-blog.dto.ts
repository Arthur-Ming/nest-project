import { ICreatePostDto } from './create-post.dto';

export class CreatePostForSpecifiedBlogDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  constructor(
    blogId: string,
    dto: ICreatePostDto = {
      title: 'some post',
      shortDescription: 'shortDescription',
      content: 'content',
    }
  ) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = blogId;
  }
}
