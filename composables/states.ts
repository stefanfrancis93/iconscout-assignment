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

const ASSET_FILTER_ENDPOINT_MAP = {
  all: "all-assets",
  "3d": "3d-illustrations",
  lottie: "lottie-animations",
  illustration: "illustrations",
  icon: "icons",
};

export const useFilters = () => {
  const route = useRoute();
  const assetFilter =
    route.path.split("/").length > 2
      ? Object.keys(ASSET_FILTER_ENDPOINT_MAP).find(
          (k) => ASSET_FILTER_ENDPOINT_MAP[k] === route.path.split("/")?.[2]
        ) ?? "all"
      : "all";
  const {
    price: priceFilter = "all",
    view: viewFilter = "individual",
    sort: sortFilter = "relevant",
    exclusive: exclusiveFilter = false,
    category: categoryFilter = undefined,
  } = route.query ?? {};
  const filters = useState("filters", () => ({
    asset: assetFilter,
    price: priceFilter,
    view: viewFilter,
    sort: sortFilter,
    exclusive: exclusiveFilter,
    category: categoryFilter,
  }));

  watch(
    filters,
    (newFilters) => {
      const { asset, price, view, sort, exclusive, category } =
        newFilters ?? {};
      const queryParams = new URLSearchParams();
      const oldAsset = route.params.slug?.[0] ?? "all";
      const oldPrice = queryParams.get("price");
      const oldView = queryParams.get("view");
      const oldSort = queryParams.get("sort");
      const oldExclusive = queryParams.get("exclusive");
      const oldCategory = queryParams.get("category");
      const currentRoute = useRoute();
      const router = useRouter();
      const anyFilterChanged =
        oldAsset !== asset ||
        oldPrice !== price ||
        oldView !== view ||
        oldSort !== sort ||
        oldExclusive !== exclusive ||
        oldCategory !== category;
      if (!anyFilterChanged) {
        // No filters changed, no need to update the URL
        return;
      }
      if (oldPrice !== price) {
        queryParams.set("price", price as string);
      }
      if (oldView !== view) {
        queryParams.set("view", view as string);
      }
      if (oldSort !== sort) {
        queryParams.set("sort", sort as string);
      }
      if (exclusive) {
        queryParams.set("exclusive", "true");
      }
      if (category) {
        queryParams.set("category", category as string);
      }
      const routeSplit = currentRoute.path.split("/");
      let path = currentRoute.path;
      if (oldAsset !== asset && ASSET_FILTER_ENDPOINT_MAP[asset]) {
        path = routeSplit
          .map((r, i) => (i === 2 ? ASSET_FILTER_ENDPOINT_MAP[asset] : r))
          .join("/");
      }
      router.push({
        path,
        query: Object.fromEntries(queryParams.entries()),
      });
    },
    {
      immediate: true,
      deep: true,
    }
  );

  function setAssetFilter(asset: string) {
    filters.value.asset = asset;
  }

  return {
    filters,
    setAssetFilter,
  };
};
