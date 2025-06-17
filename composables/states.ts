import type { GetAssetsResponse } from "~/shared/types/assets";

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
  const authCookie = useCookie("auth_token");
  const isLoggedIn = useState<boolean>("isLoggedIn", () => !!authCookie.value);

  function logout() {
    try {
      $fetch("/api/logout", {
        method: "POST",
      });
      isLoggedIn.value = false;
    } catch (e) {
      console.error("Failed to remove auth token:", e);
    }
  }

  return {
    isLoggedIn,
    logout,
  };
};

export const usePagination = () => {
  const pagination = useState<GetAssetsResponse["pagination"] | null>(
    "pagination",
    () => null
  );

  return {
    pagination,
  };
};

export const useLoadingStatus = () => {
  const loadingStatus = useState<"idle" | "pending" | "success" | "error">(
    "loadingStatus",
    () => "idle"
  );

  return {
    loadingStatus,
  };
};
