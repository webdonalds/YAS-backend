## GET - /v1/like/myLike/{videoId}

get my like status

#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |
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
    "like": true | false
}
~~~


## POST - /v1/like/

set like

#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |
| x-access-token | ACCESS_TOKEN     | O        |


#### Body Parameters

| KEY         | VALUE            | REQUIRED |
| ----------- | ---------------- | -------- |
| videoId     | VIDEO_ID         | O        |


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



## DELETE - /v1/like

unset like


#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |
| x-access-token | ACCESS_TOKEN     | O        |


#### Body Parameters

| KEY     | VALUE    | REQUIRED |
| ------- | -------- | -------- |
| videoId | VIDEO_ID | O        |


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
