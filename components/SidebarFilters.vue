<template>
  <div
    class="w-[260px] p-4 bg-white border-r border-b border-[#EBEDF5] min-h-[80vh]"
  >
    <UForm class="flex flex-col gap-6" :state="{}">
      <UFormField>
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium text-base">Iconscout Exclusive</span>
          <USwitch v-model="filters.exclusive" color="primary" />
        </div>
      </UFormField>
      <UAccordion
        type="multiple"
        :items="accordionItems"
        :default-value="['0', '1', '2', '3']"
        class="ui-accordion-filters"
      >
        <template #item-asset="{ item }">
          <UFormField class="mb-2">
            <URadioGroup
              v-model="filters.asset"
              :items="item.options"
            />
          </UFormField>
        </template>
        <template #item-price="{ item }">
          <UFormField class="mb-2">
            <URadioGroup
              v-model="filters.price"
              :items="item.options"
            />
          </UFormField>
        </template>
        <template #item-view="{ item }">
          <UFormField class="mb-2">
            <URadioGroup
              v-model="filters.view"
              :items="item.options"
            />
          </UFormField>
        </template>
        <template #item-sort="{ item }">
          <UFormField class="mb-2">
            <URadioGroup
              v-model="filters.sort"
              :items="item.options"
            />
          </UFormField>
        </template>
      </UAccordion>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui';

defineProps<{ slug: string[]; query: string }>();

const filters = reactive({
  exclusive: false,
  asset: "3d",
  price: "premium",
  view: "individual",
  sort: "featured",
  category: "",
});

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
]satisfies AccordionItem[];
</script>

<style scoped>
.ui-accordion-filters .ui-accordion-item {
  border: none;
}
.ui-accordion-filters .ui-accordion-header {
  font-weight: 600;
  font-size: 1rem;
  color: #2e334c;
}
</style>
