export function userResponse(payload, token) {
  return {
    user: {
      email: payload.email,
      token: token,
      username: payload.username,
      bio: payload.bio,
      image: payload.image,
    },
  };
}

export function getToken(header) {
  const token = header.split(" ").pop();
  return token;
}
