import jwt from "jsonwebtoken";

export function signToken(payload) {
  const tokenPayload = {
    username: payload.username,
    email: payload.email
  }
  const signed = jwt.sign(tokenPayload, process.env.PRIVATE_KEY, {
    algorithm: "RS256", expiresIn: '1w'
  });
  return signed;
}
export function verifyToken(token) {
  const decode = jwt.verify(token, process.env.PUBLIC_KEY, {
    algorithms: "RS256",
  });
  return decode;
}
