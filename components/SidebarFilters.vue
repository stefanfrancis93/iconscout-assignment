<template>
  <div
    class="w-[260px] bg-white border-r border-b border-white-100 min-h-[80vh] sticky top-[120px] sidebar-filters"
  >
    <UForm class="flex flex-col" :state="{}">
      <div
        class="flex items-center justify-between py-5 px-6 border-b border-white-100"
      >
        <USwitch color="primary" label="Iconscout Exclusive" />
      </div>
      <UAccordion
        type="multiple"
        :items="accordionItems"
        :default-value="['0', '1', '2', '3']"
        class="ui-accordion-filters"
      >
        <template #item-asset="{ item }">
          <URadioGroup v-model="localFilters.asset" :items="item.options" />
        </template>
        <template #item-price="{ item }">
          <URadioGroup v-model="localFilters.price" :items="item.options" />
        </template>
        <template #item-view="{ item }">
          <URadioGroup v-model="localFilters.view" :items="item.options" />
        </template>
        <template #item-sort="{ item }">
          <URadioGroup v-model="localFilters.sort" :items="item.options" />
        </template>
      </UAccordion>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";

const route = useRoute();
const router = useRouter();

const localFilters = ref({
  asset: route.params.slug?.length > 0 ? route.params.slug?.[0] : "all-assets",
  price: (route.query.price as string) || "free",
  view: (route.query.view as string) || "individual",
  sort: (route.query.sort as string) || "relevant",
});

watch(
  [
    () => localFilters.value.asset,
    () => localFilters.value.price,
    () => localFilters.value.view,
    () => localFilters.value.sort,
  ],
  ([asset, price, view, sort], [oldAsset, oldPrice, oldView, oldSort]) => {
    if (
      asset !== oldAsset ||
      price !== oldPrice ||
      view !== oldView ||
      sort !== oldSort
    ) {
      const lottieFormat = route.query.lottieFormat;
      const routeSplit = route.path.split("/");
      const path = routeSplit.map((r, i) => (i === 1 ? asset : r)).join("/");
      const routeQuery = route.query;
      router.push({
        path,
        query: {
          ...routeQuery,
          price,
          view,
          sort,
          ...(lottieFormat ? { lottieFormat } : {}),
        },
      });
    }
  }
);

const accordionItems = [
  {
    label: "Asset",
    slot: "item-asset",
    options: [
      { label: "All asset", value: "all-assets" },
      { label: "3D Illustrations", value: "3d-illustrations" },
      { label: "Lottie Animations", value: "lottie-animations" },
      { label: "Illustrations", value: "illustrations" },
      { label: "Icons", value: "icons" },
    ],
  },
  {
    label: "Price",
    slot: "item-price",
    options: [
      { label: "Free", value: "free" },
      { label: "Premium", value: "premium" },
    ],
  },
  {
    label: "View",
    slot: "item-view",
    options: [
      { label: "Individual", value: "individual" },
      { label: "Pack", value: "pack" },
    ],
  },
  {
    label: "Sort by",
    slot: "item-sort",
    options: [
      { label: "Relevant", value: "relevant" },
      { label: "Popular", value: "popular" },
      { label: "Latest", value: "latest" },
    ],
  },
] satisfies AccordionItem[];
</script>

<style scoped>
.sidebar-filters:deep(.ui-accordion-filters > div > div:first-child > button) {
  padding: 16px 24px 15px;
  cursor: pointer;
}
</style>
