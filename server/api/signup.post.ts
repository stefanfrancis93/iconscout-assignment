export default defineEventHandler(async (event) => {
  const token = "dummy_access_token_" + Math.random().toString(36).slice(2);
  setCookie(event, "auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return {
    access_token: token,
  };
});
