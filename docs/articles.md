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

| Name | Type |
|:-----|:-----|
| `article` *required* | `Object` |
| `title` *required*| `String` |
| `description` *required*| `String` |
| `body` *required*| `String` |
| `tagList` | `Array or null` |

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
| `article` | `Object` |
| `title` | `String` |
| `description` | `String` |
| `body` | `String` |
| `tagList` | `Array or undefined` |

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
> #### `StatusCode` `422` - Payload value(s) not unqiue
>
> The requested email or username creation is already taken by another user 
> #### `StatusCode` `403` - Unauthorized
>
> This error will redirect user to homepage. 
>
> Authorization header not provided, Expired JWT token, Invalid JWT token
