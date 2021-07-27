## POST - /v1/follow/{followeeId}

Follow user

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
    "followerId": FOLLOWER_ID,
    "followeeId": FOLLOWEE_ID
}
~~~



## DELETE - /v1/follow/{followeeId}

Unfollow user

#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |
| x-access-token | ACCESS_TOKEN     | O        |


#### Body Parameters

| KEY         | VALUE            | REQUIRED |
| ----------- | ---------------- | -------- |
|             |                  |          |


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



## GET - /v1/follow

Get list of follows by followerId or followeeId


#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |

#### Body Parameters

X


#### URL Parameters

| KEY        | VALUE       | REQUIRED |
| ---------- | ----------- | -------- |
| pageToken  | PAGE_TOKEN  | X        |
| followerId | FOLLOWER_ID | O/X      |
| followeeId | FOLLOWEE_ID | X/O      |


#### Success Response

Code: 200 (success)
Content:
~~~
{
  "follows": [LIST_OF_FOLLOWS],
  "pageToken": PAGE_TOKEN | null
}
~~~



## GET - /v1/follow/isFollowing

Check whether follow exists


#### Header

| KEY          | VALUE            | REQUIRED |
| ------------ | ---------------- | -------- |
| Content-type | application/json | O        |

#### Body Parameters

X


#### URL Parameters

| KEY        | VALUE       | REQUIRED |
| ---------- | ----------- | -------- |
| followeeId | FOLLOWEE_ID | O        |
| followerId | FOLLOWER_ID | O        |


#### Success Response

Code: 200 (success)
Content:

~~~
{
  "isFollowing": true | false
}
~~~



