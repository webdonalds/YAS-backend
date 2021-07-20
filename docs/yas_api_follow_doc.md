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



## GET - /v1/follow/followeesByFollower/{followerId}

Get list of followees by followerId


#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |

#### Body Parameters

X


#### URL Parameters

| KEY       | VALUE      | REQUIRED |
| --------- | ---------- | -------- |
| pageToken | PAGE_TOKEN | X        |


#### Success Response

Code: 200 (success)
Content:
~~~
{
  "followees": [LIST_OF_FOLLOWEES],
  "pageToken": PAGE_TOKEN | null
}
~~~



## GET - /v1/follow/followersByFollowee/{followeeId}

Get list of followers by followeeId


#### Header

| KEY            | VALUE            | REQUIRED |
| -------------- | ---------------- | -------- |
| Content-type   | application/json | O        |

#### Body Parameters

X


#### URL Parameters

| KEY       | VALUE      | REQUIRED |
| --------- | ---------- | -------- |
| pageToken | PAGE_TOKEN | X        |


#### Success Response

Code: 200 (success)
Content:

~~~
{
  "followers": [LIST_OF_FOLLOWERS],
  "pageToken": PAGE_TOKEN | null
}
~~~



## GET - /v1/follow/isFollowing

Check 


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



