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
      if (keyType.includes("null") &&!keyType.includes(typeof reqBody[objKey]) && reqBody[objKey] !== null) {
        return true;
      }
    }
    else if (
      typeof(reqBody[objKey]) !== expected[objKey] &&
      reqBody[objKey] !== null
    ) {
      console.log("LAST",typeof reqBody[objKey])
      return true;
    }
  });
  if (result) {
    return false;
  }
  return true;
}

export function validateEmail(email){
  const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  return regex.test(email)
}
