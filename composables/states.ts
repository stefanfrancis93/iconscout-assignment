import type { Asset, GetAssetsResponse } from "~/shared/types/assets";
import { getAssetType } from "~/utils/assets";
import { shallowObjectComparison } from "~/utils/filters";

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
    route.params.slug.length > 0
      ? Object.keys(ASSET_FILTER_ENDPOINT_MAP).find(
          (k) => ASSET_FILTER_ENDPOINT_MAP[k] === route.params.slug?.[0]
        ) ?? "all"
      : "all";
  const {
    price: priceFilter = "free",
    view: viewFilter = "individual",
    sort: sortFilter = "relevant",
  } = route.query ?? {};
  const filters = useState("filters", () => ({
    asset: assetFilter,
    price: priceFilter,
    view: viewFilter,
    sort: sortFilter,
  }));

  watch(
    filters,
    (newFilters) => {
      const { asset, price, view, sort } = newFilters ?? {};
      const queryParams = new URLSearchParams();

      const oldAsset =
        Object.keys(ASSET_FILTER_ENDPOINT_MAP).find(
          (k) => ASSET_FILTER_ENDPOINT_MAP[k] === route.params.slug?.[0]
        ) ?? "all";
      const oldPrice = queryParams.get("price");
      const oldView = queryParams.get("view");
      const oldSort = queryParams.get("sort");
      const currentRoute = useRoute();
      const router = useRouter();

      const anyFilterChanged =
        oldAsset !== asset ||
        oldPrice !== price ||
        oldView !== view ||
        oldSort !== sort;
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

  return {
    filters,
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

export function usePaginatedAssets(props: {
  slug: string[];
  searchQuery: string;
  query: {
    price: "free" | "premium";
    view: "pack" | "individual";
    sort: "popular" | "latest" | "relevant";
  };
}) {
  const assetType: string | undefined = getAssetType(props.slug);
  const assets = useState<Asset[]>("assets", () => []);
  const { loadingStatus } = useLoadingStatus();
  const loadingMoreStatus = useState<"idle" | "pending" | "success" | "error">(
    "loadingMoreStatus",
    () => "idle"
  );
  const error = useState<Error>("error", () => null);
  const { pagination } = usePagination();
  const lastLoadedPage = useState("lastLoadedPage", () => 0);
  const currentPage = useState("currentPage", () => 1);

  async function fetchAssets(
    {
      page,
      price,
      view,
      sort,
      append = false,
    }: {
      page: number;
      price?: "free" | "premium";
      view?: "pack" | "individual";
      sort?: "popular" | "latest" | "relevant";
      append?: boolean;
    } = {
      page: 1,
    }
  ) {
    const isFirstPage = page === 1;
    (isFirstPage ? loadingStatus : loadingMoreStatus).value = "pending";
    error.value = null;
    try {
      const { data } = await useFetch<GetAssetsResponse>("/api/assets", {
        query: {
          query: props.searchQuery,
          product_type: "item",
          asset: assetType,
          page,
          per_page: assetType === "icon" ? "200" : "80",
          price,
          view,
          sort,
        },
        key: `assets-${assetType || "all"}-${
          props.searchQuery
        }-${page}-${price}-${view}-${sort}`,
      });
      if (data.value) {
        assets.value = append
          ? [...assets.value, ...(data.value.data || [])]
          : data.value.data || [];
        pagination.value = data.value.pagination;
        lastLoadedPage.value = page;
        currentPage.value = page;
        (isFirstPage ? loadingStatus : loadingMoreStatus).value = "success";
      } else {
        (isFirstPage ? loadingStatus : loadingMoreStatus).value = "error";
      }
    } catch (e) {
      error.value = e;
      (isFirstPage ? loadingStatus : loadingMoreStatus).value = "error";
    }
  }

  watch(
    [
      () => props.searchQuery,
      () => assetType,
      () => currentPage.value,
      () => props.query,
    ],
    (
      [newQuery, newAssetType, newPage, newUrlQuery],
      [oldQuery, oldAssetType, _oldPage, oldUrlQuery]
    ) => {
      const queryOrAssetChanged =
        newQuery !== oldQuery ||
        newAssetType !== oldAssetType ||
        (oldUrlQuery &&
          Object.keys(oldUrlQuery).length > 0 &&
          !shallowObjectComparison(newUrlQuery, oldUrlQuery));

      const { price, view, sort } = newUrlQuery;

      if (queryOrAssetChanged) {
        assets.value = [];
        pagination.value = null;
        lastLoadedPage.value = 0;
        currentPage.value = 1;
        fetchAssets({ page: 1, price, view, sort });
      } else if (
        newPage > 1 &&
        (pagination.value === null || newPage <= pagination.value.last_page) &&
        newPage > lastLoadedPage.value
      ) {
        fetchAssets({ page: newPage, price, view, sort, append: true });
      }
    },
    { immediate: true }
  );

  return {
    assets,
    loadingMoreStatus,
    error,
    pagination,
    lastLoadedPage,
    currentPage,
    fetchAssets,
    assetType,
  };
}
