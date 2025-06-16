<template>
  <ul
    role="tablist"
    class="hidden lg:flex flex-row gap-8 bg-transparent items-center ml-[43px] mb-3 min-w-0 whitespace-nowrap"
  >
    <li role="presentation">
      <NuxtLink
        :class="getTabClass('/all-assets', slug, routePath)"
        role="tab"
        rel="follow"
        @click="onClickFilter('all')"
      >
        All Assets
      </NuxtLink>
    </li>
    <li role="presentation">
      <NuxtLink
        :class="getTabClass('/3d-illustrations', slug, routePath)"
        role="tab"
        rel="follow"
        @click="onClickFilter('3d')"
      >
        3D Illustrations
      </NuxtLink>
    </li>
    <li role="presentation">
      <NuxtLink
        :class="getTabClass('/lottie-animations', slug, routePath)"
        role="tab"
        rel="follow"
        @click="onClickFilter('lottie')"
      >
        Lottie Animations
      </NuxtLink>
    </li>
    <li role="presentation">
      <NuxtLink
        :class="getTabClass('/illustrations', slug, routePath)"
        role="tab"
        rel="follow"
        @click="onClickFilter('illustration')"
      >
        Illustrations
      </NuxtLink>
    </li>
    <li role="presentation">
      <NuxtLink
        :class="getTabClass('/icons', slug, routePath)"
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
defineProps<{
  slug: string[];
  routePath: string;
}>();
const { filters } = useFilters()

function getTabClass(
  base: string,
  slug: string[] | string | undefined,
  routePath: string
): string {
  const re = new RegExp(`^${base}(/|$)`);
  const path =
    Array.isArray(slug) && slug.length > 0 ? `/${slug[0]}` : routePath;
  const query: string = Array.isArray(slug) && slug.length > 1 ? slug[1] : "";
  const isActive = re.test(path);
  const baseClass =
    "text-sm px-0 py-0 bg-transparent border-none shadow-none transition-colors duration-150 font-semibold text-blue-500 cursor-pointer";
  const activeClass =
    "text-black font-bold relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-15px] after:border-b-2 after:border-black";

  const defaultFilterSelected = isActive && base === "/all-assets" && query === "";
  
  return (isActive || defaultFilterSelected) ? `${baseClass} ${activeClass}` : baseClass;
}

function onClickFilter(asset: string) {
  filters.value.asset = asset
}
</script>
