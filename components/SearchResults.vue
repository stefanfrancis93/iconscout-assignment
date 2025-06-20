<template>
  <div :class="`flex flex-1 flex-col ${assetType}`">
    <div v-if="loadingStatus === 'pending'" class="asset-grid">
      <AssetSkeleton
        v-for="n in assetType === 'icon' ? 200 : 80"
        :key="n"
        class="asset-grid__item"
      />
    </div>
    <div v-else-if="error" class="py-10 text-center text-red-500">
      Failed to load assets.
    </div>
    <template v-else-if="assets && assets.length">
      <div class="asset-grid">
        <div
          v-for="(item, index) in assets"
          :key="`${item.id}-${index}`"
          class="flex h-full"
        >
          <AssetCard :item="item" class="asset-grid__item" />
        </div>
        <div
          v-if="!isLoggedIn && loadingStatus === 'success'"
          class="guest-sign-up"
        >
          <div
            class="relative z-10 px-8 py-8 flex flex-col items-center w-full max-w-md"
          >
            <h3 class="text-2xl font-bold mb-5 text-black">
              View all Limit 3D Illustrations
            </h3>
            <UButton
              color="primary"
              variant="solid"
              class="h-[54px] w-full max-w-64 bg-brand justify-center text-lg font-semibold rounded-xl hover:bg-brand hover:brightness-110 cursor-pointer transition-all duration-200 ease-in-out active:brightness-95"
              @click="openAuthModal('signup')"
            >
              Get Started - It's Free
            </UButton>
            <p class="text-lg text-gray-700 mt-1">
              Already have an account?
              <UButton
                color="primary"
                variant="ghost"
                class="text-lg font-semibold text-brand cursor-pointer"
                @click="openAuthModal('login')"
                >Log In</UButton
              >
            </p>
          </div>
        </div>
      </div>
      <template v-if="assetType === 'lottie'">
        <div v-if="isLoggedIn" ref="intersectionRef" style="height: 1px"></div>
        <div v-if="loadingMoreStatus === 'pending'" class="text-center py-4">
          Loading more...
        </div>
      </template>
    </template>
    <div v-else class="py-10 text-center text-gray-400">No assets found.</div>
    <UPagination
      v-if="
        isLoggedIn &&
        assetType !== 'lottie' &&
        ((loadingStatus === 'pending' && page > 1) || assets.length)
      "
      class="self-center mt-10 mb-5"
      :page="page"
      :items-per-page="assetType === 'icon' ? 200 : 80"
      :total="pagination.total"
      @update:page="onPaginationChange"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/states";
import type { Asset, GetAssetsResponse } from "~/shared/types/assets";

const props = defineProps<{
  assets: Asset[];
  assetType: string | undefined;
  error: boolean;
  currentPage: number;
  loadingStatus: "idle" | "pending" | "success" | "error";
  loadingMoreStatus: "idle" | "pending" | "success" | "error";
  pagination: GetAssetsResponse["pagination"];
}>();
const emit = defineEmits<{
  "load-more": [page?: number];
}>();

const { isLoggedIn } = useAuth();
const { openAuthModal } = useAuthModal();
const intersectionRef = ref<HTMLElement | null>(null);
const page = computed(() => props.currentPage);

function onPaginationChange(_page: number) {
  emit("load-more", _page);
}

useIntersectionObserver(
  intersectionRef,
  () => {
    emit("load-more");
  },
  { root: null, rootMargin: "400px", threshold: 0.01 },
  () =>
    props.loadingStatus !== "pending" &&
    props.loadingMoreStatus !== "pending" &&
    props.pagination !== null &&
    props.pagination.current_page < props.pagination.last_page
);
</script>

<style scoped>
.asset-grid {
  position: relative;
  display: grid;
  gap: 0.75rem;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.asset-grid__item {
  height: 13.125rem;
}

.guest-sign-up {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-height: 25rem;
  padding: 2rem;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.9) 21.98%,
    rgba(255, 255, 255, 0.99) 100%
  );
}

@media (max-width: 1023.98px) {
  .asset-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

.icon .asset-grid {
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.3125rem;
}

.icon .asset-grid__item {
  height: 8.75rem;
}

@media (max-width: 767.98px) {
  .icon .asset-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
