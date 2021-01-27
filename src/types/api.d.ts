type ApiError = {
    error: {
        message: string,
        specific: string | null
    }
};



/*
  post API parameters
*/
type PostVideoParameters = {
    userId: number | null,
    videoId: string | null,
    title: string | null,
    description: string | null,
    tags: Array<string> | null
}

type PutVideoParameters = {
    userId: number | null,
    videoPostId: number | null,
    title: string | null,
    description: string | null,
    tags: Array<string> | null
};

type DeleteVideoParameters = {
    userId: number | null,
    videoPostId: number | null
}


/*
  user API parameters
*/
type userInfoParameters = {
    userId: number | null,
    nickname: string | null,
    aboutMe: string | null
};
