import { UserInfoResponse } from './User';

export type TagResponse = {
  tagName: string,
};

export type VideoResponse = {
  id: number,
  videoId: string,
  userId: number,
  title: string,
  description: string,
  totalLikes: number,
  createdAt: Date,

  Tags: TagResponse[],
  User: UserInfoResponse,
};

export type VideoListResponse = {
  videoList: VideoResponse[],
  pageToken: number | null,
};
