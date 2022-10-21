// POST ARTICLE
export const articleDbPayload = {
  title: "Click bait here",
  slug: "click-bait-here",
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
// GET ARTICLE
export const expectQueryArticlePayload = {
  article: {
    slug: expect.any(String),
    title: expect.any(String),
    description: expect.any(String),
    body: expect.any(String),
    tagList: expect.any(Array),
    createdAt: expect.toBeOneOf([expect.any(Date), expect.any(String)]),
    updatedAt: expect.toBeOneOf([expect.any(Date), expect.any(String)]),
    favorited: expect.any(Boolean),
    favoritesCount: expect.any(Number), // signed number positive (add in test)
    author: {
      username: expect.any(String),
      bio: expect.toBeOneOf([null, expect.any(String)]),
      image: expect.toBeOneOf([null, expect.any(String)]),
      following: expect.any(Boolean),
    },
  },
};
export const queryArticleDbPayload = {
  article: {
    slug: "slug-slug-slug",
    title: "slug Slug sLuG",
    description: "explain slug",
    body: "explaination here",
    tagList: ["slug", "tutorial"],
    createdAt: new Date(),
    updatedAt: new Date(),
    favorited: false,
    favoritesCount: 0, // signed number positive (add in test)
    author: {
      username: "user",
      bio: null,
      image: null,
      following: false,
    },
  },
};
