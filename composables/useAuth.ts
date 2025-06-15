/**
 * @description This composable provides a reactive way to check if a user is logged in
 * by checking for an authentication token in local storage. It listens for changes in
 * local storage to update the login state reactively.
 * @returns {Object} An object containing a reactive property `isLoggedIn` indicating
 * whether the user is logged in, and a method `setToken` to set the authentication token.
 */

const isLoggedIn = ref(false);

function checkAuth() {
  try {
    const token = localStorage.getItem("auth_token");
    isLoggedIn.value = !!token;
  } catch (_e) {
    console.error("Failed to check auth token:", _e);
    isLoggedIn.value = false;
  }
}

function setToken(token) {
  try {
    localStorage.setItem("auth_token", token);
    isLoggedIn.value = !!token;
  } catch (e) {
    console.error("Failed to set auth token:", e);
  }
}

function logout() {
  try {
    localStorage.removeItem("auth_token");
    isLoggedIn.value = false;
  } catch (e) {
    console.error("Failed to remove auth token:", e);
  }
}

if (typeof window !== "undefined") {
  checkAuth();
  window.addEventListener("storage", checkAuth);
}

export function useAuth() {
  return { isLoggedIn, setToken, logout };
}
