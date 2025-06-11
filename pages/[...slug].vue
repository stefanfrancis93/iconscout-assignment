
<template>
  <div>
    <div class="flex flex-col pt-6 pl-10">
      <h1 class="text-black text-[35px] font-bold">
        237 Limit 3D Illustrations
      </h1>
    </div>
    <div class="flex items-end mb-3">
      <div class="w-[260px] border-r border-b border-[#EBEDF5]">
        <UButton
          color="primary"
          variant="ghost"
          class="flex justify-between gap-2 text-md text-gray-500 w-full h-12"
        >
          <span class="flex items-center gap-2">
            <span class="size-6">
              <img src="/filter.svg" alt="Filters" class="size-6" />
            </span>
            Filters
          </span>
          <span class="size-6">
            <img src="/close.svg" alt="Close" class="size-6" />
          </span>
        </UButton>
      </div>
      <SearchFilters :slug="slug" :query="query" :route-path="route.path" />
    </div>
    <div>
      <SearchResults
        :slug="slug"
        :query="query"
        :page="page"
        @load-more="handleLoadMore"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchFilters from "~/components/SearchFilters.vue";
import SearchResults from "~/components/SearchResults.vue";

const route = useRoute();
const slug: string[] = (route.params.slug as string[]) || [];
const query: string = Array.isArray(slug) && slug.length > 1 ? slug[1] : "";

const page = ref(1);
function handleLoadMore() {
  page.value += 1;
}
</script>
