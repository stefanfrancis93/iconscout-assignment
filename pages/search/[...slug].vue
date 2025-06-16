<template>
  <div>
    <div class="flex flex-col pt-6 pl-10 bg-white-600">
      <h1 class="text-black text-[35px] font-bold">
        {{ getSearchResultsTitle(pagination?.total, route.params.slug, query, loadingStatus) }}
      </h1>
    </div>
    <div class="flex items-end sticky top-[88px] bg-white-600 z-10">
      <div
        :class="[
          'border-r border-b border-white-100 transition-all duration-300 ease-in-out flex items-center',
          open ? 'w-[260px]' : 'w-12'
        ]"
        style="overflow:hidden;"
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
      <SearchFilters :slug="slug" :query="query" :route-path="route.path" />
    </div>
    <div class="flex flex-row w-full">
      <div
        :class="[
          'transition-all duration-300 ease-in-out',
          open ? 'w-[260px] min-w-[260px] max-w-[260px]' : 'w-0 min-w-0 max-w-0 overflow-hidden'
        ]"
      >
        <SidebarFilters v-if="open" :slug="slug" :query="query" />
      </div>
      <section
        class="px-10 py-6 transition-all duration-300 ease-in-out"
        :class="open ? 'flex-1' : 'flex-1 w-full'"
      >
        <SearchResults :slug="slug" :query="query" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const slug: string[] = (route.params.slug as string[]) || [];
const query: string = Array.isArray(slug) && slug.length > 1 ? slug[1] : "";

const { open, toggleSidebar } = useSidebar();
const { pagination } = usePagination()
const { loadingStatus } = useLoadingStatus()
</script>

<style scoped>
.fade-width-enter-active, .fade-width-leave-active {
  transition: opacity 0.2s;
}
.fade-width-enter-from, .fade-width-leave-to {
  opacity: 0;
  width: 0;
}
.fade-width-enter-to, .fade-width-leave-from {
  opacity: 1;
  width: auto;
}
.sidebar-slide-enter-active, .sidebar-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
}
.sidebar-slide-enter-from, .sidebar-slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.sidebar-slide-enter-to, .sidebar-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
