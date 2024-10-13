export interface ICreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
}
export class CreatePostDto implements ICreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  constructor(
    dto: ICreatePostDto = {
      title: 'some post',
      shortDescription: 'shortDescription',
      content: 'content',
    }
  ) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
  }
}
