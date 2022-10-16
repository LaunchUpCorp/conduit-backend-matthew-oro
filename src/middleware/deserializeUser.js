import { verifyToken } from "../utils/jwtUtils";
import { getToken } from "../utils/userControllerUtils";
import { jwtErrorHandles } from "../utils/errorHandleUtils";

export async function deserializeUser(req, res, next) {
  try {
    if (!req.get("Authorization")) {
      throw new Error("Authorization header empty");
    }
    const token = getToken(req.get("Authorization"));
    const decode = verifyToken(token);
    req.user = decode;
    return next();
  } catch (e) {
    console.error(e);
    const error = jwtErrorHandles.find(({ message }) => message === e.message);
    if (!error) return res.status(500).send("Server Error");
    return res.redirect(error.statusCode, "/");
  }
}
