
export const errorHandles = [
  {
    message: "No payload found",
    statusCode: 400
  },
  {
    message: "Invalid payload format",
    statusCode: 400
  },
  {
    message: "Invalid email format",
    statusCode: 400
  },
  {
    message: "jwt malformed",
    statusCode: 403
  },
  {
    message: "jwt expired",
    statusCode: 403
  },
  {
    message: "Invalid credentials",
    statusCode: 401
  },
  {
    message: "Payload value(s) not unique",
    statusCode: 422
  },
  {
    message: "query and current user cannot be the same",
    statusCode: 400
  },
  {
    message: "query does not exist",
    statusCode: 404
  },
]
export const jwtErrorHandles = [
  {
    message: "jwt malformed",
    statusCode: 403
  },
  {
    message: "jwt expired",
    statusCode: 403
  },
  {
    message: "Authorization header empty",
    statusCode: 403
  },
]


