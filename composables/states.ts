export const useSidebar = () => {
  const open = useState<boolean>("open", () => true);

  const toggleSidebar = () => {
    open.value = !open.value;
  };

  return {
    open,
    toggleSidebar,
  };
};

export const useAuth = () => {
  const isLoggedIn = useState<boolean>("isLoggedIn", () => false);

  function checkAuth() {
    try {
      const token = localStorage.getItem("auth_token");
      isLoggedIn.value = !!token;
    } catch (_e) {
      console.error("Failed to check auth token:", _e);
      isLoggedIn.value = false;
    }
  }

  function setLoginStateWithToken(token) {
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

  return {
    isLoggedIn,
    setLoginStateWithToken,
    logout,
  };
};

