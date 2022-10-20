export const articleDbPayload = {
  title: "Click bait here",
  description: "real and true",
  body: "Life hacks",
  tagList: ["new", "hacks"],
};
export const articlePayload = {
  article: {
    ...articleDbPayload,
  },
};
export const invalidArticlePayloadFormat = {
  article: {
    bio: "wrong",
    name: "wrong still",
  },
};
export const invalidTaglistPayload = {
  article: {
    ...articleDbPayload,
    tagList: {},
  },
};

export const expectArticlePayload = {
  article: {
    title: expect.any(String),
    description: expect.any(String),
    body: expect.any(String),
    tagList: expect.toBeOneOf([undefined, null, expect.any(Array)]),
  },
};
