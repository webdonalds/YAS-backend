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

