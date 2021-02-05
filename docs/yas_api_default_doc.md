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

