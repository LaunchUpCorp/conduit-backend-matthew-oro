# Articles

## Create Article

### Endpoint: `POST` `/api/articles`

### Authentication header required

Authentication header Type:
| Name | Type |
|:-----|:-----|
| `Authorization` | `String` |

### Authentication header example:

```JSON
{
  "Authorization": "Bearer jwt.token.here"
}
```

### Request Body Type:

| Name                     | Type            |
| :----------------------- | :-------------- |
| `article` _required_     | `Object`        |
| `title` _required_       | `String`        |
| `description` _required_ | `String`        |
| `body` _required_        | `String`        |
| `tagList`                | `Array or null` |

### Request Body Example:

```JSON
{
     "user": {
         "username": "example",
         "email": "example@example.example",
         "password": "1exampleword"
     }
}
```

### Response Body Type:

| Name          | Type                 |
| :------------ | :------------------- |
| `article`     | `Object`             |
| `title`       | `String`             |
| `description` | `String`             |
| `body`        | `String`             |
| `tagList`     | `Array or undefined` |

### Response Body Example:

```JSON
{
     "article": {
         "title": "example",
         "description": "This is an example",
         "body": "I love examples",
         "tagList": ["example", "new"],
     }
}
```

```JSON
{
     "article": {
         "title": "example",
         "description": "This is an example",
         "body": "I love examples",
     }
}
```

### Errors:

> #### `StatusCode` `400` - Invalid request body
>
> Must provide required body content listed above or invalid email type provided
>
> #### `StatusCode` `422` - Payload value(s) not unqiue
>
> The requested email or username creation is already taken by another user
>
> #### `StatusCode` `403` - Unauthorized
>
> This error will redirect user to homepage.
>
> Authorization header not provided, Expired JWT token, Invalid JWT token

## Query Article

### Endpoint: `GET` `/api/articles/:slug`

### Authentication header not required

### Params:

| Name              | Type     |
| :---------------- | :------- |
| `slug` _required_ | `String` |

### Response Body Type:

| Name             | Type             |
| :--------------- | :--------------- |
| `article`        | `Object`         |
| `title`          | `String`         |
| `description`    | `String`         |
| `body`           | `String`         |
| `createdAt`      | `Date or String` |
| `updatedAt`      | `Date or String` |
| `favorited`      | `Boolean`        |
| `favoritesCount` | `Number`         |
| `Author`         | `Object`         |
| `username`       | `String`         |
| `bio`            | `String`         |
| `image`          | `String`         |
| `following`      | `Boolean`        |

### Response Body Example:

```JSON
{
    "article": {
        "slug": "how-to-train-your-dragon",
        "title": "How to train your dragon",
        "description": "Ever wonder how?",
        "body": "It takes a Jacobian",
        "tagList": ["dragons", "training"],
        "createdAt": "2016-02-18T03:22:56.637Z",
        "updatedAt": "2016-02-18T03:48:35.824Z",
        "favorited": false,
        "favoritesCount": 0,
        "author": {
            "username": "jake",
            "bio": "I work at statefarm",
            "image": "https://i.stack.imgur.com/xHWG8.jpg",
            "following": false
        }
    }
}
```


### Errors:
> #### `StatusCode` `400` - Invalid request body
>
> Must provide required params content listed above
> #### `StatusCode` `404` - Invalid request body
>
> Slug provided in params does not exist


## Favorite Article

### Endpoint: `POST` `/api/articles/:slug/favorite`

### Authentication required

 Authentication header Type: 
| Name | Type |
|:-----|:-----|
| `Authorization` | `String` |

### Authentication header example: 
```JSON
{
  "Authorization": "Bearer jwt.token.here"
}
```
### Params:

| Name | Type |
|:-----|:-----|
| `slug` *required*| `String` |

### Response Body Type:

| Name             | Type             |
| :--------------- | :--------------- |
| `article`        | `Object`         |
| `title`          | `String`         |
| `description`    | `String`         |
| `body`           | `String`         |
| `createdAt`      | `Date or String` |
| `updatedAt`      | `Date or String` |
| `favorited`      | `Boolean`        |
| `favoritesCount` | `Number`         |
| `Author`         | `Object`         |
| `username`       | `String`         |
| `bio`            | `String`         |
| `image`          | `String`         |
| `following`      | `Boolean`        |

### Response Body Example:

```JSON
{
    "article": {
        "slug": "how-to-train-your-dragon",
        "title": "How to train your dragon",
        "description": "Ever wonder how?",
        "body": "It takes a Jacobian",
        "tagList": ["dragons", "training"],
        "createdAt": "2016-02-18T03:22:56.637Z",
        "updatedAt": "2016-02-18T03:48:35.824Z",
        "favorited": false,
        "favoritesCount": 0,
        "author": {
            "username": "jake",
            "bio": "I work at statefarm",
            "image": "https://i.stack.imgur.com/xHWG8.jpg",
            "following": false
        }
    }
}
```
### Errors:
> #### `StatusCode` `400` - Invalid request body
>
> Must provide required params content listed above
> #### `StatusCode` `404` - Invalid request body
>
> Slug provided in params does not exist
> #### `StatusCode` `422` - Payload value(s) not unqiue
>
> The current user already favorited the requested article 
> #### `StatusCode` `403` - Unauthorized
>
> This error will redirect user to homepage. 
>
> Authorization header not provided, Expired JWT token, Invalid JWT token
