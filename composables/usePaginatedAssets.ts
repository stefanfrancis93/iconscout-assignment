import type { Asset, GetAssetsResponse } from "~/shared/types/assets";
import { getAssetType } from "~/utils/getAssetType";

export function usePaginatedAssets(props: { slug: string[]; query: string }) {
  const assetType: string | undefined = getAssetType(props.slug);
  const assets = ref<Asset[]>([]);
  const status = ref<"idle" | "pending" | "success" | "error">("idle");
  const loadingMoreStatus = ref<"idle" | "pending" | "success" | "error">(
    "idle"
  );
  const error = ref<Error>(null);
  const pagination = ref<{ current_page: number; last_page: number } | null>(
    null
  );
  const lastLoadedPage = ref(0);
  const currentPage = ref(1);

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
