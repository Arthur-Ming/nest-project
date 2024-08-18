export interface NewestLikes {
  addedAt: string;
  userId: string | null;
  login: string | null;
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
  newestLikes: NewestLikes[];
}

export type WithLikesInfo<T> = T & { extendedLikesInfo: LikesInfo };

export interface PostOutputModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}
