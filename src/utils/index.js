const emptyEndpointResponse = () => {
  return { status: "API is running on /api" };
};
export function validateBody(reqBody, expected) {
  const reqKeys = Object.keys(reqBody);
  const expectedKeys = Object.keys(expected);
  const result = reqKeys.some((objKey) => {
    if (
      reqKeys.length !== expectedKeys.length ||
      !expectedKeys.includes(objKey)
    ) {
      return true;
    }
    if (expected[objKey].split(" ").length > 1) {
      const keyType = expected[objKey].split(" ");
      if (keyType.includes("null") && reqBody[objKey] !== null) {
        return true;
      }
      if (!keyType.includes(typeof objKey)) {
        return true;
      }
    }
    if (
      typeof reqBody[objKey] !== expected[objKey] &&
      reqBody[objKey] !== null
    ) {
      return true;
    }
  });
  if (result) {
    return false;
  }
  return true;
}

export default emptyEndpointResponse;
