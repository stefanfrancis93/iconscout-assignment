<template>
  <ul
    role="tablist"
    class="flex flex-row gap-8 bg-transparent items-center ml-[43px] mb-3 min-w-0 whitespace-nowrap"
  >
    <li role="presentation">
      <NuxtLink
        :class="tabClass('/all-assets')"
        role="tab"
        rel="follow"
        @click="onClickFilter('all')"
      >
        All Assets
      </NuxtLink>
    </li>
    <li role="presentation">
      <NuxtLink
        :class="tabClass('/3d-illustrations')"
        role="tab"
        rel="follow"
        @click="onClickFilter('3d')"
      >
        3D Illustrations
      </NuxtLink>
    </li>
    <li role="presentation">
      <NuxtLink
        :class="tabClass('/lottie-animations')"
        role="tab"
        rel="follow"
        @click="onClickFilter('lottie')"
      >
        Lottie Animations
      </NuxtLink>
    </li>
    <li role="presentation">
      <NuxtLink
        :class="tabClass('/illustrations')"
        role="tab"
        rel="follow"
        @click="onClickFilter('illustration')"
      >
        Illustrations
      </NuxtLink>
    </li>
    <li role="presentation">
      <NuxtLink
        :class="tabClass('/icons')"
        role="tab"
        rel="follow"
        @click="onClickFilter('icon')"
      >
        Icons
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { getTabClass } from "~/utils/getTabClass";

const props = defineProps<{
  slug: string[];
  query: string;
  routePath: string;
}>();
const { setAssetFilter } = useFilters()

function tabClass(base: string): string {
  return getTabClass(base, props.slug, props.routePath);
}

function onClickFilter(asset: string) {
  setAssetFilter(asset)
}
</script>
