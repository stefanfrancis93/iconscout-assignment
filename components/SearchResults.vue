<template>
  <div>
    <template v-if="status === 'pending'">
      <div
        class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-10 py-6"
      >
        <AssetSkeleton v-for="n in 25" :key="n" />
      </div>
    </template>
    <template v-else-if="error">
      <div class="py-10 text-center text-red-500">Failed to load assets.</div>
    </template>
    <template v-else-if="assets && assets.data && assets.data.length">
      <div
        class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-10 py-6"
      >
        <AssetCard v-for="item in assets.data" :key="item.id" :item="item" />
      </div>
    </template>
    <template v-else>
      <div class="py-10 text-center text-gray-400">No assets found.</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import AssetSkeleton from "~/components/AssetSkeleton.vue";
import AssetCard from "~/components/AssetCard.vue";
import { getAssetType } from "~/utils/getAssetType";

const props = defineProps<{
  slug: string[];
  query: string;
}>();

const assetType: string | undefined = getAssetType(props.slug);

const {
  data: assets,
  status,
  error,
} = await useLazyFetch("/api/assets", {
  query: {
    query: props.query,
    product_type: "item",
    asset: assetType,
  },
  key: `assets-${assetType || "all"}-${props.query}`,
});
</script>
