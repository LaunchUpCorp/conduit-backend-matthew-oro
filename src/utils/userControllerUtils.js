import jwt from 'jsonwebtoken'

export function signToken(payload) {
  const { token, createdAt, updatedAt, ...newPayload } = payload;
  return jwt.sign(newPayload, process.env.PRIVATE_KEY, { algorithm: "RS256" });
}

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
