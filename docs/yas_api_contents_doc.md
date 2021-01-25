## GET - /v1/contents/playlists

Get my youtube playlists

#### Header

| KEY            | VALUE  | REQUIRED |
| -------------- | ------ | -------- |
| x-access-token | STRING | O        |

#### URL Parameters

| KEY         | VALUE  | REQUIRED |
| ----------- | ------ | -------- |
| pageToken   | STRING | X        |


#### Success Response

Code: 200 (success)

Content:

~~~
{
  "kind": "youtube#playlistListResponse",
  "etag": "ETAG",
  "nextPageToken": "NEXT_PAGE_TOKEN",
  "pageInfo: { 
    "totalResults": 5,
    "resultsPerPage": 5 
  },
  "items": [
    {
      "kind": "youtube#playlist",
      "etag": "ETAG",
      "id": "ID",
      "snippet": {
        "publishedAt": "2021-01-01T00:00:00Z",
        "channelId": "CHANNEL_ID",
        "title": "TITLE",
        "description": "DESCRIPTION",
        "thumbnails": {
          "default": {
            "url": "THUMBNAIL_URL",
            "width": 120,
            "height": 90
          },
          "medium": {
            ...
          },
          "high": {
            ...
          },
          "standard": {
            ...
          },
          "maxres": {
            ...
          }
        },
        "channelTitle": "CHANNEL_TITLE",
        "localized": {
          "title": "TITLE",
          "description": "DESCRIPTION"
        }
    },
    ...
  ]
}
~~~


## GET - /v1/contents/playlist

Get playlist

#### Header

| KEY            | VALUE  | REQUIRED |
| -------------- | ------ | -------- |
| x-access-token | STRING | O        |

#### URL Parameters

| KEY       | VALUE  | REQUIRED |
| --------- | -----  | -------- |
| id        | STRING | O        |
| pageToken | STRING | X        |

#### Success Response

Code: 200 (success)

Content:

~~~
{
  "kind": "youtube#playlistItemListResponse",
  "etag": "ETAG",
  "nextPageToken": "NEXT_PAGE_TOKEN",
  "items": [
    {
      "kind": "youtube#playlistItem",
      "etag": "ETAG",
      "id": "ID",
      "snippet": {
        "publishedAt": "2021-01-01T00:00:00Z",
        "channelId": "CHANNEL_ID",
        "title": "TITLE",
        "description": "DESCRIPTION",
        "thumbnails": {
          "default": {
            "url": "THUMBNAIL_URL",
            "width": 120,
            "height": 90
          },
          "medium": {
            ...
          },
          "high": {
            ...
          },
          "standard": {
            ...
          },
          "maxres": {
            ...
          }
        },
        "channelTitle": "CHANNEL_TITLE",
        "playlistId": "PLAYLIST_ID",
        "position": 0,
        "resourceId": {
          "kind": "youtube#video",
          "videoId": "VIDEO_ID"
        }
      }
    }
  ],
  "pageInfo": {
    "totalResults": 1,
    "resultsPerPage": 5
  }
}

~~~


## GET - /v1/contents/likelist

Get likelist

#### Header

| KEY            | VALUE  | REQUIRED |
| -------------- | ------ | -------- |
| x-access-token | STRING | O        |

#### URL Parameters

| KEY       | VALUE  | REQUIRED |
| --------- | -----  | -------- |
| pageToken | STRING | X        |

#### Success Response

Code: 200 (success)

Content:

~~~
{
  "kind": "youtube#videoListResponse",
  "etag": "ETAG",
  "nextPageToken": "NEXT_PAGE_TOKEN",
  "items": [
    {
      "kind": "youtube#video",
      "etag": "ETAG",
      "id": "ID",
      "snippet": {
        "publishedAt": "2021-01-01T00:00:00Z",
        "channelId": "CHANNEL_ID",
        "title": "TITLE",
        "description": "DESCRIPTION",
        "thumbnails": {
          "default": {
            "url": "THUMBNAIL_URL",
            "width": 120,
            "height": 90
          },
          "medium": {
            ...
          },
          "high": {
            ...
          },
          "standard": {
            ...
          },
          "maxres": {
            ...
          }
        },
        "channelTitle": "CHANNEL_TITLE",
        "tags": [
          "TAG",
          ...
        ],
        "categoryId": "1",
        "liveBroadcastContent": "none",
        "localized": {
          "title": "TITLE",
          "description": "DESCRIPTION"
        }
      }
    }
  ],
  "pageInfo": {
    "totalResults": 32,
    "resultsPerPage": 5
  }
}

~~~


## GET - /v1/contents/search

Get search result

#### Header

| KEY            | VALUE  | REQUIRED |
| -------------- | ------ | -------- |
| x-access-token | STRING | O        |

#### URL Parameters

| KEY       | VALUE  | REQUIRED |
| --------- | -----  | -------- |
| keyword   | STRING | O        |
| pageToken | STRING | X        |

#### Success Response

Code: 200 (success)

Content:

~~~
{
  "kind": "youtube#searchListResponse",
  "etag": "ETAG",
  "nextPageToken": "NEXT_PAGE_TOKEN",
  "regionCode": "KR",
  "items": [
    {
      "kind": "youtube#searchResult",
      "etag": "ETAG",
      "id": {
        "kind": "youtube#video",
        "videoId": "VIDEO_ID"
      },
      "snippet": {
        "publishedAt": "2021-01-01T00:00:00Z",
        "channelId": "CHANNEL_ID",
        "title": "TITLE",
        "description": "DESCRIPTION",
        "thumbnails": {
          "default": {
            "url": "THUMBNAIL_URL",
            "width": 120,
            "height": 90
          },
          "medium": {
            ...
          },
          "high": {
            ...
          }
        },
        "channelTitle": "CHANNEL_TITLE",
        "liveBroadcastContent": "live",
        "publishTime": "2021-01-01T00:00:00Z"
      }
    },
    ...
  ],
  "pageInfo": {
    "totalResults": 1000000,
    "resultsPerPage": 5
  },
}
~~~
