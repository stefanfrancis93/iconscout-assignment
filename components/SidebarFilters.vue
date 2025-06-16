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
import { useFilters } from "~/composables/states";

defineProps<{ slug: string[] }>();

const { filters } = useFilters();

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
