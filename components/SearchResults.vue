<template>
  <div>
    <template v-if="status === 'pending'">
      <div
        class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-10 py-6"
      >
        <AssetSkeleton v-for="n in 25" :key="n" />
      </div>
    </template>
    <template v-else-if="error">
      <div class="py-10 text-center text-red-500">Failed to load assets.</div>
    </template>
    <template v-else-if="assets && assets.length">
      <div
        class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-10 py-6"
      >
        <AssetCard v-for="item in assets" :key="item.id" :item="item" />
      </div>
      <div ref="sentinel" style="height: 1px"></div>
      <div v-if="loadingMoreStatus === 'pending'" class="text-center py-4">
        Loading more...
      </div>
    </template>
    <template v-else>
      <div class="py-10 text-center text-gray-400">No assets found.</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getAssetType } from "~/utils/getAssetType";

const props = defineProps<{
  slug: string[];
  query: string;
  page: number;
}>();

const assetType: string | undefined = getAssetType(props.slug);

const assets = ref<any[]>([]);
const status = ref<"idle" | "pending" | "success" | "error">("idle");
const loadingMoreStatus = ref<"idle" | "pending" | "success" | "error">("idle");
const error = ref<any>(null);
const pagination = ref<{ current_page: number; last_page: number } | null>(
  null
);

async function fetchAssets(page = 1) {
  if (page === 1) {
    status.value = "pending";
  } else {
    loadingMoreStatus.value = "pending";
  }
  error.value = null;
  try {
    const { data } = await useFetch("/api/assets", {
      query: {
        query: props.query,
        product_type: "item",
        asset: assetType,
        page,
      },
      key: `assets-${assetType || "all"}-${props.query}-${page}`,
    });
    if (data.value) {
      if (page === 1) {
        assets.value = data.value.data || [];
      } else {
        assets.value = [...assets.value, ...(data.value.data || [])];
      }
      pagination.value = data.value.pagination;
      if (page === 1) {
        status.value = "success";
      } else {
        loadingMoreStatus.value = "success";
      }
    } else {
      if (page === 1) {
        status.value = "error";
      } else {
        loadingMoreStatus.value = "error";
      }
    }
  } catch (e) {
    error.value = e;
    if (page === 1) {
      status.value = "error";
    } else {
      loadingMoreStatus.value = "error";
    }
  }
}

watch(
  () => [props.query, assetType],
  () => {
    fetchAssets(1);
  },
  { immediate: true }
);

watch(
  () => props.page,
  (newPage, oldPage) => {
    if (newPage > 1 && newPage !== oldPage) {
      fetchAssets(newPage);
    }
  }
);

// Infinite scroll: use Intersection Observer on sentinel
const emit = defineEmits(["load-more"]);
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

function emitLoadMore() {
  emit("load-more");
}

function setupObserver() {
  if (observer) {
    observer.disconnect();
  }
  observer = new window.IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        status.value !== "pending" &&
        loadingMoreStatus.value !== "pending" &&
        pagination.value &&
        pagination.value.current_page < pagination.value.last_page
      ) {
        emitLoadMore();
      }
    },
    {
      root: null,
      rootMargin: "400px",
      threshold: 0.01,
    }
  );
  if (sentinel.value) {
    observer.observe(sentinel.value);
  }
}

onMounted(() => {
  setupObserver();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

watch(sentinel, () => {
  setupObserver();
});
</script>
