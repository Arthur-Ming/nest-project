import { CreatePostDto, ICreatePostDto } from './create-post.dto';

export class CreatePostForSpecifiedBlogDto extends CreatePostDto {
  blogId: string;
  constructor(
    blogId: string,
    dto: ICreatePostDto = {
      title: 'some post',
      shortDescription: 'shortDescription',
      content: 'content',
    }
  ) {
    super();
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = blogId;
  }
}
