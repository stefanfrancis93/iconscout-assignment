export default defineEventHandler(async (event) => {
  deleteCookie(event, "auth_token", {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
  });

  return {};
});
