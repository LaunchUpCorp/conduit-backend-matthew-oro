# Profile 

## Follow User

### Endpoint: `POST` `/api/profile/:username/follow`

### Authentication required
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

## Unfollow User

### Endpoint: `DELETE` `/api/profile/:username/follow`

### Authentication required
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
> Must provide required body content listed above 
> #### `StatusCode` `404` - Invalid request body
>
> Username provided in params does not exist
> #### `StatusCode` `422` - Payload value(s) not unqiue
>
> The current user already follows the requested profile 
