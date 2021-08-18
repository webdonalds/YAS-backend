## GET - /v1/user/user-info

Get user information

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
  "id": ID,
  "email": EMAIL,
  "nickname": NICKNAME,
  "imagePath": IMAGE_PATH,
  "aboutMe": ABOUT_ME
}
~~~


## PUT - /user/user-info

Modify user information

#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |
| x-access-token | ACCESS_TOKEN     | O        |

#### Body Parameters

| KEY      | VALUE    | REQUIRED |
| -------- | -------- | -------- |
| nickname | NICKNAME | O        |
| aboutMe  | ABOUT_ME | O        |

#### URL Parameters

X

#### Success Response

Code: 200 (success)

Content:

~~~
{
  "id": ID,
  "email": EMAIL,
  "nickname": NICKNAME,
  "imagePath": IMAGE_PATH,
  "aboutMe": ABOUT_ME
}
~~~

## PUT - /user/profile-image

Modify user information

#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |
| x-access-token | ACCESS_TOKEN     | O        |

#### Body Parameters

| KEY       | VALUE      | REQUIRED |
| --------- | ---------- | -------- |
| imagePath | IMAGE_PATH | O        |

#### URL Parameters

X

#### Success Response

Code: 200 (success)

Content:

~~~
{
}
~~~
