<template>
  <div>
    <div class="flex flex-col pt-6 pl-10 bg-white-600 gap-1 pb-6">
      <h1 class="text-black text-[35px] font-bold">
        {{
          getSearchResultsTitle(
            pagination?.total,
            route.params.slug,
            searchQuery,
            loadingStatus
          )
        }}
      </h1>
      <p class="text-sm text-[#5A607D] min-h-5">
        {{
          pagination?.total
            ? `${formatNumber(
                pagination?.total
              )} 3Ds exclusively selected by our designer community.`
            : ""
        }}
      </p>
    </div>
    <div class="flex items-end sticky top-[70px] bg-white-600 z-10">
      <div
        :class="[
          'border-r border-b border-white-100 transition-all duration-300 ease-in-out flex items-center',
          open ? 'w-[260px]' : 'w-12',
        ]"
        style="overflow: hidden"
      >
        <UButton
          color="primary"
          variant="ghost"
          class="flex justify-between gap-2 text-md text-gray-500 w-full h-12 cursor-pointer transition-all duration-300 ease-in-out hover:bg-transparent"
          @click="toggleSidebar"
        >
          <span class="flex items-center gap-2 w-full">
            <span class="size-6">
              <img src="/filter.svg" alt="Filters" class="size-6" />
            </span>
            <transition name="fade-width">
              <span v-if="open" class="ml-2">Filters</span>
            </transition>
          </span>
          <transition name="fade-width">
            <span v-if="open" class="size-6">
              <img src="/close.svg" alt="Close" class="size-6" />
            </span>
          </transition>
        </UButton>
      </div>
      <SearchFilters />
    </div>
    <div class="flex flex-row w-full">
      <div
        :class="[
          'transition-all duration-300 ease-in-out',
          open
            ? 'w-[260px] min-w-[260px] max-w-[260px]'
            : 'w-0 min-w-0 max-w-0 overflow-hidden',
        ]"
      >
        <SidebarFilters v-if="open" />
      </div>
      <section
        class="px-10 py-6 transition-all duration-300 ease-in-out"
        :class="open ? 'flex-1' : 'flex-1 w-full'"
      >
        <SearchResults
          :assets="assets"
          :asset-type="assetType"
          :error="!!error"
          :current-page="currentPage"
          :pagination="pagination"
          :loading-status="loadingStatus"
          :loading-more-status="loadingMoreStatus"
          @load-more="loadMore"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssetType } from "~/utils/assets";
import type { Asset, GetAssetsResponse } from "~/shared/types/assets";

const route = useRoute();
const slug: string[] = (route.params.slug as string[]) || [];
const searchQuery: string =
  Array.isArray(slug) && slug.length > 1 ? slug[1] : "";

const { open, toggleSidebar } = useSidebar();
const assetType = computed(() => getAssetType(slug));

const { data, pending, error } = await useLazyFetch<GetAssetsResponse>(
  () => {
    const params = new URLSearchParams({
      query: searchQuery,
      product_type: "item",
      asset: assetType.value || "",
      page: "1",
      per_page: assetType.value === "icon" ? "200" : "80",
      price: (route.query.price as string) || "",
      view: (route.query.view as string) || "",
      sort: (route.query.sort as string) || "",
    });
    return `/api/assets?${params.toString()}`;
  },
  {
    watch: [() => searchQuery, () => assetType.value, () => route.query],
    default: () => ({ data: [], pagination: null }),
    server: true,
    lazy: false,
  }
);

const assets = computed<Asset[]>(() => data.value?.data || []);
const pagination = computed(() => data.value?.pagination);
const loadingStatus = computed(() =>
  pending.value ? "pending" : error.value ? "error" : "success"
);

const loadingMoreStatus = ref<"idle" | "pending" | "success" | "error">("idle");
const currentPage = ref(1);

async function loadMore(page?: number) {
  if (
    !pagination.value ||
    (page === undefined && currentPage.value >= pagination.value.last_page)
  )
    return;
  if (page !== undefined) {
    pending.value = true;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    loadingMoreStatus.value = "pending";
  }
  try {
    const nextPage = page ?? currentPage.value + 1;
    const params = new URLSearchParams({
      query: searchQuery,
      product_type: "item",
      asset: assetType.value || "",
      page: String(nextPage),
      per_page: assetType.value === "icon" ? "200" : "80",
      price: (route.query.price as string) || "",
      view: (route.query.view as string) || "",
      sort: (route.query.sort as string) || "",
    });
    const { data: moreData, error: moreError } =
      await useFetch<GetAssetsResponse>(`/api/assets?${params.toString()}`, {
        server: false,
      });
    if (moreError.value) throw moreError.value;
    if (moreData.value?.data?.length) {
      if (page !== undefined) {
        data.value.data = moreData.value.data;
      } else {
        data.value.data.push(...moreData.value.data);
      }
      data.value.pagination = moreData.value.pagination;
      currentPage.value = data.value.pagination.current_page;
    }
    loadingMoreStatus.value = "success";
  } catch (e) {
    loadingMoreStatus.value = "error";
  } finally {
    pending.value = false;
  }
}

const assetTypeTitles: Record<string, string> = {
  "3d": "3D Illustrations - Free Download in PNG, glTF | IconScout",
  lottie: "Animations - Free Download in GIF, Lottie JSON | IconScout",
  illustration: "Illustrations - Free Download in SVG, PNG | IconScout",
  icon: "Icons, Logos, Symbols - Free Download in SVG, PNG | IconScout",
};

const pageInfo = computed(() => {
  const page = pagination.value?.current_page || 1;
  return assetType.value !== "lottie" && page > 1 ? `Page ${page} | ` : "";
});

const headTitle = computed(() => {
  const type = assetType.value;
  const title =
    assetTypeTitles[type] ||
    "Design Assets - Free Download in SVG, PNG, BLEND, GIF | IconScout";
  return `${pageInfo.value}${title}`;
});

useHead({
  title: headTitle,
});
</script>

<style scoped>
.fade-width-enter-active,
.fade-width-leave-active {
  transition: opacity 0.2s;
}
.fade-width-enter-from,
.fade-width-leave-to {
  opacity: 0;
  width: 0;
}
.fade-width-enter-to,
.fade-width-leave-from {
  opacity: 1;
  width: auto;
}
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.sidebar-slide-enter-to,
.sidebar-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
