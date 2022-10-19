# Users 

## Registration

### Endpoint: `POST` `/api/users`

### Authentication header not requred

### Request Body Type:

| Name | Type |
|:-----|:-----|
| `user` *required* | `Object` |
| `username` *required*| `String` |
| `email` *required*| `String` |
| `password` *required*| `String` |

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
| Name | Type |
|:-----|:-----|
| `user` | `Object` |
| `email` | `String` |
| `token` | `String` |
| `username` | `String` |
| `bio` | `String or null` |
| `image` | `String or null` |

### Response Body Example:
```JSON 
{
     "user": {
         "username": "example",    
         "token": "qwerty.asdf.zxcv",    
         "email": "example@example.example",
         "bio": "I love examples",
         "image": null
     }
} 
```
### Errors:
> #### `StatusCode` `400` - Invalid request body
>
> Must provide required body content listed above or invalid email type provided
> #### `StatusCode` `422` - Payload value(s) not unqiue
>
> The requested email or username creation is already taken by another user 



## Authentication (Login)

### Endpoint: `POST` `/api/users/login`

### Authentication header not requred

### Request Body Type:

| Name | Type |
|:-----|:-----|
| `user` *required*| `Object` |
| `email` *required*| `String` |
| `password` *required*| `String` |

### Request Body Example:
```JSON 
{
     "user": {
         "email": "example@example.example",
         "password": "1exampleword"
     }
} 
```
### Response Body Type:
| Name | Type |
|:-----|:-----|
| `user` | `Object` |
| `email` | `String` |
| `token` | `String` |
| `username` | `String` |
| `bio` | `String or null` |
| `image` | `String or null` |

### Response Body Example:
```JSON 
{
     "user": {
         "username": "example",    
         "token": "qwerty.asdf.zxcv",    
         "email": "example@example.example",
         "bio": "I love examples",
         "image": null
     }
} 
```
### Errors:
> #### `StatusCode` `400` - Invalid request body
>
> Must provide required body content listed above 
> #### `StatusCode` `403` - Invalid credentials
>
> `email` and/or `password` values are invalid

## Current User Data

### Endpoint: `GET` `/api/users`

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
### Response Body Type:
| Name | Type |
|:-----|:-----|
| `user` | `Object` |
| `email` | `String` |
| `token` | `String` |
| `username` | `String` |
| `bio` | `String or null` |
| `image` | `String or null` |

### Response Body Example:
```JSON 
{
     "user": {
         "username": "example",    
         "token": "qwerty.asdf.zxcv",    
         "email": "example@example.example",
         "bio": "I love examples",
         "image": null
     }
} 
```
### Errors:
> #### `StatusCode` `403` - Unauthorized
>
> This error will redirect user to homepage. 
>
> Authorization header not provided, Expired JWT token, Invalid JWT token

## Upate Current User Data

### Endpoint: `PUT` `/api/users`

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
### Request Body Type:
 *At least one property required for requested update*

| Name | Type |
|:-----|:-----|
| `user` *required* | `Object` |
| `password` | `String or null` |
| `bio` | `String or null` |
| `image` | `String or null` |

### Request Body Examples:
```JSON 
{
     "user": {
       "username": "updated",
       "bio": "I'm the updated bio",
       "image": "image.url"
     }
} 
```
### Response Body Type:
| Name | Type |
|:-----|:-----|
| `user` | `Object` |
| `email` | `String` |
| `token` | `String` |
| `username` | `String` |
| `bio` | `String or null` |
| `image` | `String or null` |

### Response Body Example:
```JSON 
{
     "user": {
         "username": "updated",    
         "token": "qwerty.asdf.zxcv",    
         "email": "example@example.example",
         "bio": "I'm the updated bio",
         "image": "imgae.url"
     }
} 
```
// TODO: add errors for non unique username and email
### Errors:
> #### `StatusCode` `400` - Invalid request body
>
> Must provide required body content listed above
> #### `StatusCode` `422` - Payload value(s) not unqiue
>
> The requested username change is already taken by another user 
> #### `StatusCode` `403` - Unauthorized
>
> This error will redirect user to homepage. 
>
> Authorization header not provided, Expired JWT token, Invalid JWT token

