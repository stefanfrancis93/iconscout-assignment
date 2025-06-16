<template>
  <div :class="`flex flex-1 flex-col ${assetType}`">
    <div v-if="status === 'pending'" class="asset-grid">
      <AssetSkeleton v-for="n in 25" :key="n" class="asset-grid__item" />
    </div>
    <div v-else-if="error" class="py-10 text-center text-red-500">
      Failed to load assets.
    </div>
    <template v-else-if="assets && assets.length">
      <div class="asset-grid">
        <div v-for="(item, index) in assets" :key="`${item.id}-${index}`" class="flex h-full">
          <AssetCard :item="item" class="asset-grid__item" />
        </div>
        <div v-if="!isLoggedIn" class="guest-sign-up">
          <div class="relative z-10 px-8 py-8 flex flex-col items-center w-full max-w-md">
            <h3 class="text-2xl font-bold mb-5 text-black">View all Limit 3D Illustrations</h3>
            <UButton color="primary" variant="solid" class="h-[54px] w-full max-w-64 bg-brand justify-center text-lg font-semibold rounded-xl hover:bg-brand hover:brightness-110 cursor-pointer transition-all duration-200 ease-in-out active:brightness-95" @click="openAuthModal('signup')">
              Get Started - It's Free
            </UButton>
            <p class="text-lg text-gray-700 mt-1">Already have an account? <UButton color="primary" variant="ghost" class="text-lg font-semibold text-brand cursor-pointer" @click="openAuthModal('login')">Log In</UButton>
            </p>
          </div>
        </div>
      </div>
      <div v-if="isLoggedIn" ref="intersectionRef" style="height: 1px"></div>
      <div v-if="loadingMoreStatus === 'pending'" class="text-center py-4">
        Loading more...
      </div>
    </template>
    <div v-else class="py-10 text-center text-gray-400">No assets found.</div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "~/composables/useIntersectionObserver";
import { useAuthModal } from '~/composables/useAuthModal';
import { useAuth } from "~/composables/states";

const props = defineProps<{
  slug: string[];
  query: string;
}>();
const intersectionRef = ref<HTMLElement | null>(null);

const { assetType, assets, status, loadingMoreStatus, error, pagination, currentPage } =
  usePaginatedAssets(props);
const { isLoggedIn } = useAuth();
const { openAuthModal } = useAuthModal();

useIntersectionObserver(
  intersectionRef,
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
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 21.98%, rgba(255, 255, 255, 0.99) 100%);
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

.icon .asset-grid__item {
  height: 8.75rem;
}

@media (max-width: 767.98px) {
  .icon .asset-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
