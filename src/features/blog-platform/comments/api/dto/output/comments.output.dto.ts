export interface CommentatorInfo {
  userId: string;
  userLogin: string | null;
}
export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}
export interface LikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}

export class CommentsOutputDto {
  id: string;
  content: string;
  createdAt: string;
  commentatorInfo: CommentatorInfo;
  likesInfo: LikesInfo;
}
