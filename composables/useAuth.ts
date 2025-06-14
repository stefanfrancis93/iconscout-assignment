/**
 * @description This composable provides a reactive way to check if a user is logged in
 * by checking for an authentication token in local storage. It listens for changes in
 * local storage to update the login state reactively.
 * @returns {Object} An object containing a reactive property `isLoggedIn`
 * that indicates whether the user is logged in.
 */
export function useAuth() {
  const isLoggedIn = ref(false);

  function checkAuth() {
    const token = localStorage.getItem("auth_token");
    isLoggedIn.value = !!token;
  }

  onMounted(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
  });

  return { isLoggedIn };
}
