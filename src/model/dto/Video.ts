type TagResponse = {
  tagName: string,
};

type VideoResponse = {
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

type VideoListResponse = {
  videoList: VideoResponse[],
  pageToken: number | null,
};
