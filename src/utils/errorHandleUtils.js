
export const errorHandles = [
  {
    mesage: "No payload found",
    statusCode: 400
  },
  {
    mesage: "Invalid payload format",
    statusCode: 400
  },
  {
    mesage: "Invalid email format",
    statusCode: 400
  },
  {
    message: "Authorization header empty",
    statusCode: 403
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
    statusCode: 403
  }
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
]


