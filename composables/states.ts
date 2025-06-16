import type { Asset, GetAssetsResponse } from "~/shared/types/assets";
import { getAssetType } from "~/utils/assets";

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

export const usePagination = () => {
  const pagination = useState<GetAssetsResponse["pagination"] | null>("pagination", () => null);

  return {
    pagination,
  }
}

export function usePaginatedAssets(props: { slug: string[]; query: string }) {
  const assetType: string | undefined = getAssetType(props.slug);
  const assets = useState<Asset[]>("assets", () => []);
  const status = useState<"idle" | "pending" | "success" | "error">("status", () => "idle");
  const loadingMoreStatus = useState<"idle" | "pending" | "success" | "error">("loadingMoreStatus", () => 
    "idle"
  );
  const error = useState<Error>("error", () => null);
  const { pagination } = usePagination();
  const lastLoadedPage = useState("lastLoadedPage", () => 0);
  const currentPage = useState("currentPage", () => 1);

  async function fetchAssets({ page = 1, append = false } = {}) {
    const isFirstPage = page === 1;
    (isFirstPage ? status : loadingMoreStatus).value = "pending";
    error.value = null;
    try {
      const { data } = await useFetch<GetAssetsResponse>("/api/assets", {
        query: {
          query: props.query,
          product_type: "item",
          asset: assetType,
          page,
          per_page: assetType === "icon" ? "200" : "80",
        },
        key: `assets-${assetType || "all"}-${props.query}-${page}`,
      });
      if (data.value) {
        assets.value = append
          ? [...assets.value, ...(data.value.data || [])]
          : data.value.data || [];
        pagination.value = data.value.pagination;
        lastLoadedPage.value = page;
        currentPage.value = page;
        (isFirstPage ? status : loadingMoreStatus).value = "success";
      } else {
        (isFirstPage ? status : loadingMoreStatus).value = "error";
      }
    } catch (e) {
      error.value = e;
      (isFirstPage ? status : loadingMoreStatus).value = "error";
    }
  }

  watch(
    [() => props.query, () => assetType, () => currentPage.value],
    ([newQuery, newAssetType, newPage], [oldQuery, oldAssetType]) => {
      const queryOrAssetChanged =
        newQuery !== oldQuery || newAssetType !== oldAssetType;
      if (queryOrAssetChanged) {
        assets.value = [];
        pagination.value = null;
        lastLoadedPage.value = 0;
        currentPage.value = 1;
        fetchAssets({ page: 1 });
      } else if (
        newPage > 1 &&
        (pagination.value === null || newPage <= pagination.value.last_page) &&
        newPage > lastLoadedPage.value
      ) {
        fetchAssets({ page: newPage, append: true });
      }
    },
    { immediate: true }
  );

  return {
    assets,
    status,
    loadingMoreStatus,
    error,
    pagination,
    lastLoadedPage,
    currentPage,
    fetchAssets,
    assetType,
  };
}
