export function userResponse(payload) {
  return {
    user: {
      email: payload.email,
      token: payload.token,
      username: payload.username,
      bio: payload.bio,
      image: payload.image,
    }
  };
}

export function getToken(header){
  const token = header.split(" ").pop()
  return token
}
