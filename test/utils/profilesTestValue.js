export const profileDbPayload = {
  email: "test@test.test",
  username: "tester",
  bio: null,
  image: null,
};

export function profileResponse(isFollowing) {
  return {
    profile: {
      username: expect.toBeOneOf([null,expect.any(String)]),
      bio: expect.toBeOneOf([null, expect.any(String)]),
      image: expect.toBeOneOf([null, expect.any(String)]),
      following: isFollowing,
    },
  };
}
