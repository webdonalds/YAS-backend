## GET - /v1/post/video/{id}

Get video post

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
    "id": 0,
    "videoId": "VIDEO_ID",
    "userId": null,
    "title": "TITLE",
    "description": "DESCRIPTION",
    "totalLikes": 0,
    "createdAt": "2021-01-18T15:28:38.000Z",
    "updatedAt": "2021-01-18T15:28:38.000Z"
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
  "message": "success"
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
  "message": "success"
}
~~~

