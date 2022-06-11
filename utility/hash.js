import jsSHA from "jssha";

export const getHashString = (input) => {
  const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
  shaObj.update(input);
  return shaObj.getHash("HEX");
};

export const getHashedCookie = (input, salt) => {
  const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
  const unhashedCookieString = `${input}-${salt}`;
  shaObj.update(unhashedCookieString);
  return shaObj.getHash("HEX");
};
