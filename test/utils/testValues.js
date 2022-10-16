export const createUserInput = {
  user: {
    email: "new@new.new",
    username: "newtwo",
    password: "1newword",
  },
};
export const userLoginInput = {
  user: {
    email: "new@new.new",
    password: "1newword",
  },
};
export const dbPayload = {
  email: "new@new.new",
  username: "newtwo",
  hash: "$2b$10$Mpjuia0MkOKv3zM2OV7xLe5CvlL23dMjDSb26rIoYJn3JltTdwhIq",
  bio: null,
  image: null,
};
export const userPayload = {
  user: {
    email: "new@new.new",
    token: expect.any(String),
    username: "newtwo",
    bio: null,
    image: null,
  },
};
export const invalidCreateUserInput = {
  user: {
    paper: "8x11",
    chef: null,
    id: 1,
    image: null,
  },
};
export const invalidLoginPassword = {
  user: {
    email: "new@new.new",
    password: "asdf",
  },
};
export const invalidLoginEmail = {
  user: {
    email: "old@old.old",
    password: "1newword",
  },
};
export const verifyTokenPayload = {
  email: "new@new.new",
  username: "newtwo",
  exp: expect.any(Number),
  iat: expect.any(Number),
};
