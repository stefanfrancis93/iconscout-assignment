<template>
  <div>
    <template v-if="status === 'idle' || status === 'pending'">
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
import { useIntersectionObserver } from "~/composables/useIntersectionObserver";
import { usePaginatedAssets } from "~/composables/usePaginatedAssets";

const props = defineProps<{
  slug: string[];
  query: string;
}>();
const sentinel = ref<HTMLElement | null>(null);

const { assets, status, loadingMoreStatus, error, pagination, currentPage } =
  usePaginatedAssets(props);

useIntersectionObserver(
  sentinel,
  () => {
    if (
      status.value !== "pending" &&
      loadingMoreStatus.value !== "pending" &&
      pagination.value !== null &&
      pagination.value.current_page < pagination.value.last_page
    ) {
      currentPage.value += 1;
    }
  },
  { root: null, rootMargin: "400px", threshold: 0.01 },
  () =>
    status.value !== "pending" &&
    loadingMoreStatus.value !== "pending" &&
    pagination.value !== null &&
    pagination.value.current_page < pagination.value.last_page
);
</script>
