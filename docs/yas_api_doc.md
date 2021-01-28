# YAS-Backend API Document



## Default Settings

Same default things which are applied to all of the APIs



#### Error Response

Code: 400 (error)

Content:

~~~
{
  "error": {
    "message": "ERROR_MESSAGE",
    "specific": "SPECIFIC_ERROR" // partially
  }
}
~~~



#### Error Response related to Authorization

Code: 401 (authentication fail)

Content:

~~~
{
  "error": {
    "message": "ERROR_MESSAGE",
    "specific": "SPECIFIC_ERROR" // partially
  }
}
~~~



#### About Middleware

APIs which require **x-access-token** will go through middleware. 

And after going though middleware,

~~~
{
  "userInfo": {
    "userId": USER_ID_INT
  }
}
~~~

body will be automatically added. 

Also, when error arise during authentication, **Error Response** will be returned.





## GET - /v1/auth/login

Get login with Google OAuth2



#### Header

X



#### Body Parameters

X



#### URL Parameters

| KEY  | VALUE              | REQUIRED |
| ---- | ------------------ | -------- |
| code | GOOGLE_OAUTH2_CODE | O        |





#### Success Response

Code: 200 (success)

Content:

~~~
{
  "data": {
    "id": USER_ID_INT,
    "email": USER_EMAIL,
    "nickname": USER_NICK_NAME,
    "imagePath": USER_PROFILE_IMAGE_PATH,
    "aboutMe": ABOUT_USER
  },
  "auth": {
    "yasAccessToken": YAS_ACCESS_TOKEN,
    "yasSecretKey": YAS_SECRET_KEY
  }
}
~~~





## GET - /v1/auth/access-token

Get access token from refresh token



#### Header

| KEY            | VALUE             | REQUIRED |
| -------------- | ----------------- | -------- |
| x-access-token | YAS_REFRESH_TOKEN | O        |



#### Body Parameters

X



#### URL Parameters

X



#### Success Response

Code: 200 (success)

Content:

~~~
{
  "yasAccessToken": YAS_ACCESS_TOKEN
}
~~~


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
| videoId     | VIDEO_ID         | O        |
| title       | POST_TITLE       | O        |
| description | POST_DESCRIPTION | X        |



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





## PUT - /v1/post/video

Modify title/description of the video post



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





## PUT - /v1/user/nickname

Modify user's nickname



#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |
| x-access-token | ACCESS_TOKEN     | O        |



#### Body Parameters

| KEY         | VALUE        | REQUIRED |
| ----------- | ------------ | -------- |
| newNickname | NEW_NICKNAME | O        |



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





## PUT - /v1/user/about-me

Modify user's about-me



#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |
| x-access-token | ACCESS_TOKEN     | O        |



#### Body Parameters

| KEY        | VALUE        | REQUIRED |
| ---------- | ------------ | -------- |
| newAboutMe | NEW_ABOUT_ME | O        |



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



