// utils/tokenTime.js
export const getTokenRemainingTime = (token) => {
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const exp = payload.exp * 1000; // seconds → ms
  const now = Date.now();

  const remainingMs = exp - now;

  return {
    seconds: Math.floor(remainingMs / 1000),
    minutes: Math.floor(remainingMs / 60000),
  };
};
