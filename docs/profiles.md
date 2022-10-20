# Profile 

## Follow Profile

### Endpoint: `POST` `/api/profile/:username/follow`

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
| `username` *required*| `String` |

### Response Body Type:
| Name | Type |
|:-----|:-----|
| `profile` | `Object` |
| `username` | `String` |
| `bio` | `String or null` |
| `image` | `String or null` |
| `following` | `Boolean` |

### Response Body Example:
```JSON 
{
     "user": {
         "username": "example",    
         "bio": "I love examples",
         "image": null,
         "following": true
     }
} 
```
### Errors:
> #### `StatusCode` `400` - Invalid request body
>
> Must provide required params content listed above
> #### `StatusCode` `404` - Invalid request body
>
> Username provided in params does not exist
> #### `StatusCode` `422` - Payload value(s) not unqiue
>
> The current user already follows the requested profile 
> #### `StatusCode` `403` - Unauthorized
>
> This error will redirect user to homepage. 
>
> Authorization header not provided, Expired JWT token, Invalid JWT token

## Unfollow Profile

### Endpoint: `DELETE` `/api/profile/:username/follow`

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
| `username` *required*| `String` |

### Response Body Type:
| Name | Type |
|:-----|:-----|
| `profile` | `Object` |
| `username` | `String` |
| `bio` | `String or null` |
| `image` | `String or null` |
| `following` | `Boolean` |

### Response Body Example:
```JSON 
{
     "user": {
         "username": "example",    
         "bio": "I love examples",
         "image": null,
         "following": false
     }
} 
```
### Errors:
> #### `StatusCode` `400` - Invalid request body
>
> Must provide required params content listed above
> #### `StatusCode` `404` - Invalid request body
>
> Username provided in params does not exist
> #### `StatusCode` `422` - Payload value(s) not unqiue
>
> The current user already follows the requested profile 
> #### `StatusCode` `403` - Unauthorized
>
> This error will redirect user to homepage. 
>
> Authorization header not provided, Expired JWT token, Invalid JWT token

## Get Profile Data 

### Endpoint: `GET` `/api/profile/:username`

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
| `username` *required*| `String` |

### Response Body Type:
| Name | Type |
|:-----|:-----|
| `profile` | `Object` |
| `username` | `String` |
| `bio` | `String or null` |
| `image` | `String or null` |
| `following` | `Boolean` |

### Response Body Example:
```JSON 
{
     "user": {
         "username": "example",    
         "bio": "I love examples",
         "image": null,
         "following": false
     }
} 
```
### Errors:
> #### `StatusCode` `400` - Invalid request body
>
> Must provide required params content listed above
> #### `StatusCode` `404` - Invalid request body
>
> Username provided in params does not exist
> #### `StatusCode` `422` - Payload value(s) not unqiue
>
> The current user already follows the requested profile 
> #### `StatusCode` `403` - Unauthorized
>
> This error will redirect user to homepage. 
>
> Authorization header not provided, Expired JWT token, Invalid JWT token
