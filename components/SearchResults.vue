<template>
  <div :class="`flex flex-1 flex-col ${assetType}`">
    <div
      v-if="status === 'pending'"
      class="asset-grid"
    >
      <AssetSkeleton v-for="n in 25" :key="n" />
    </div>
    <div v-else-if="error" class="py-10 text-center text-red-500">
      Failed to load assets.
    </div>
    <template v-else-if="assets && assets.length">
      <div
        class="asset-grid"
      >
        <div
          v-for="(item, index) in assets"
          :key="`${item.id}-${index}`"
          class="flex h-full"
        >
          <AssetCard :item="item" />
        </div>
      </div>
      <div ref="sentinel" style="height: 1px"></div>
      <div v-if="loadingMoreStatus === 'pending'" class="text-center py-4">
        Loading more...
      </div>
    </template>
    <div v-else class="py-10 text-center text-gray-400">No assets found.</div>
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

const { assetType, assets, status, loadingMoreStatus, error, pagination, currentPage } =
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

<style scoped>
.asset-grid {
  display: grid;
  gap: 0.75rem;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
@media (max-width: 1023.98px) {
  .asset-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}
.icon .asset-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: .25rem;
}
@media (max-width: 767.98px) {
.icon .asset-grid {
grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
