<template>
  <div
    class="w-[260px] bg-white border-r border-b border-white-100 min-h-[80vh] sidebar-filters"
  >
    <UForm class="flex flex-col" :state="{}">
      <div
        class="flex items-center justify-between py-5 px-6 border-b border-white-100"
      >
        <USwitch
          v-model="filters.exclusive"
          color="primary"
          label="Iconscout Exclusive"
        />
      </div>
      <UAccordion
        type="multiple"
        :items="accordionItems"
        :default-value="['0', '1', '2', '3']"
        class="ui-accordion-filters"
      >
        <template #item-asset="{ item }">
          <URadioGroup v-model="filters.asset" :items="item.options" />
        </template>
        <template #item-price="{ item }">
          <URadioGroup v-model="filters.price" :items="item.options" />
        </template>
        <template #item-view="{ item }">
          <URadioGroup v-model="filters.view" :items="item.options" />
        </template>
        <template #item-sort="{ item }">
          <URadioGroup v-model="filters.sort" :items="item.options" />
        </template>
      </UAccordion>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";

defineProps<{ slug: string[]; query: string }>();

const filters = reactive({
  exclusive: false,
  asset: "3d",
  price: "premium",
  view: "individual",
  sort: "featured",
  category: "",
});
console.log("Filters:", filters);

const accordionItems = [
  {
    label: "Asset",
    slot: "item-asset",
    options: [
      { label: "All asset", value: "all" },
      { label: "3D Illustrations", value: "3d" },
      { label: "Lottie Animations", value: "lottie" },
      { label: "Illustrations", value: "illustration" },
      { label: "Icons", value: "icon" },
    ],
  },
  {
    label: "Price",
    slot: "item-price",
    options: [
      { label: "Free", value: "free" },
      { label: "Premium", value: "premium" },
      { label: "All", value: "all" },
    ],
  },
  {
    label: "View",
    slot: "item-view",
    options: [
      { label: "Pack", value: "pack" },
      { label: "Individual", value: "individual" },
    ],
  },
  {
    label: "Sort by",
    slot: "item-sort",
    options: [
      { label: "Popular", value: "popular" },
      { label: "Latest", value: "latest" },
      { label: "Featured", value: "featured" },
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
