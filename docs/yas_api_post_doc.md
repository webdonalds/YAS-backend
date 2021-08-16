## GET - /v1/post/video/{id}

Get video post

#### Body Parameters

X

#### URL Parameters

X

#### Success Response

Code: 200 (success)

Content:

~~~
{
    "id": 0,
    "videoId": VIDEO_ID,
    "userId": USER_ID,
    "title": TITLE,
    "description": DESCRIPTION,
    "totalLikes": 0,
    "createdAt": "2021-01-18T15:28:38.000Z",
    "Tags": [{
      "tagName": TAG_NAME
    }],
    User: {
      "id": ID,
      "email": EMAIL,
      "nickname": NICKNAME,
      "imagePath": IMAGE_PATH,
      "aboutMe": ABOUT_ME
    }
}
~~~


## GET - /v1/post/user-videos/{id}

Get videos of specific user

#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| x-access-token | ACCESS_TOKEN     | O        |


#### Body Parameters

X

#### URL Parameters

X

#### Success Response

Code: 200 (success)

Content:

~~~
{
  "videoList": [{
    "id": 0,
    "videoId": VIDEO_ID,
    "userId": USER_ID,
    "title": TITLE,
    "description": DESCRIPTION,
    "totalLikes": 0,
    "createdAt": "2021-01-18T15:28:38.000Z",
    "Tags": [{
      "tagName": TAG_NAME
    }],
    User: {
      "id": ID,
      "email": EMAIL,
      "nickname": NICKNAME,
      "imagePath": IMAGE_PATH,
      "aboutMe": ABOUT_ME
    }
  }],
  "pageToken": PAGE_TOKEN
}
~~~


## POST - /v1/post/video

Upload video post



#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |
| x-access-token | ACCESS_TOKEN     | O        |



#### Body Parameters

| KEY         | VALUE            | REQUIRED |
| ----------- | ---------------- | -------- |
| videoId     | VIDEO_ID         | O        |
| title       | POST_TITLE       | O        |
| description | POST_DESCRIPTION | X        |
| tags        | [TAG]            | X        |



#### URL Parameters

X



#### Success Response

Code: 200 (success)

Content:

~~~
{
  "postId": POST_ID
}
~~~





## PUT - /v1/post/video

Modify title/description of the video post



#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |
| x-access-token | ACCESS_TOKEN     | O        |



#### Body Parameters

| KEY         | VALUE            | REQUIRED |
| ----------- | ---------------- | -------- |
| videoPostId | VIDEO_POST_ID    | O        |
| title       | POST_TITLE       | O        |
| description | POST_DESCRIPTION | X        |
| tags        | [TAG]            | X        |



#### URL Parameters

X



#### Success Response

Code: 200 (success)

Content:

~~~
{
  "postId": POST_ID
}
~~~





## DELETE - /v1/post/video

Delete video post



#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |
| x-access-token | ACCESS_TOKEN     | O        |



#### Body Parameters

| KEY         | VALUE         | REQUIRED |
| ----------- | ------------- | -------- |
| videoPostId | VIDEO_POST_ID | O        |



#### URL Parameters

X



#### Success Response

Code: 200 (success)

Content:

~~~
{
  "postId": POST_ID
}
~~~

## GET - /v1/logoffed-post-list/recent-videos

Get recent videos

#### URL Parameters

| KEY       | VALUE  | REQUIRED |
| --------- | -----  | -------- |
| pageToken | STRING | X        |

#### Body Parameters

X

#### URL Parameters

X

#### Success Response

Code: 200 (success)

Content:

~~~
{
  "videoList": [{
    "id": 0,
    "videoId": VIDEO_ID,
    "userId": USER_ID,
    "title": TITLE,
    "description": DESCRIPTION,
    "totalLikes": 0,
    "createdAt": "2021-01-18T15:28:38.000Z",
    "Tags": [{
      "tagName": TAG_NAME
    }],
    User: {
      "id": ID,
      "email": EMAIL,
      "nickname": NICKNAME,
      "imagePath": IMAGE_PATH,
      "aboutMe": ABOUT_ME
    }
  }],
  "pageToken": PAGE_TOKEN
}
~~~


## GET - /v1/logoffed-post-list/hot-videos

Get hot videos

#### Body Parameters

X

#### URL Parameters

X

#### Success Response

Code: 200 (success)

Content:

~~~
{
  "videoList": [{
    "id": 0,
    "videoId": VIDEO_ID,
    "userId": USER_ID,
    "title": TITLE,
    "description": DESCRIPTION,
    "totalLikes": 0,
    "createdAt": "2021-01-18T15:28:38.000Z",
    "Tags": [{
      "tagName": TAG_NAME
    }],
    User: {
      "id": ID,
      "email": EMAIL,
      "nickname": NICKNAME,
      "imagePath": IMAGE_PATH,
      "aboutMe": ABOUT_ME
    }
  }]
}
~~~
