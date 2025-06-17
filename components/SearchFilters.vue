<template>
  <ul
    role="tablist"
    class="hidden lg:flex flex-row gap-8 bg-transparent items-center ml-[43px] mb-3 min-w-0 whitespace-nowrap"
  >
    <li v-for="filter in filters" :key="filter.value" role="presentation">
      <NuxtLink
        :class="[baseClass, isActive(filter.value) && activeClass]"
        role="tab"
        rel="follow"
        @click="onClickFilter(filter.value)"
      >
        {{ filter.label }}
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const filters = [
  { label: 'All Assets', value: 'all-assets' },
  { label: '3D Illustrations', value: '3d-illustrations' },
  { label: 'Lottie Animations', value: 'lottie-animations' },
  { label: 'Illustrations', value: 'illustrations' },
  { label: 'Icons', value: 'icons' },
];

const baseClass =
  'text-sm px-0 py-0 bg-transparent border-none shadow-none transition-colors duration-150 font-semibold text-blue-500 cursor-pointer';
const activeClass =
  "text-black font-bold relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-15px] after:border-b-2 after:border-black";

function isActive(filterValue: string) {
  return route.params.slug && Array.isArray(route.params.slug)
    ? route.params.slug[0] === filterValue
    : filterValue === 'all-assets' && route.path === '/search/all-assets';
}

function onClickFilter(filter: string) {
  const searchQuery =
    Array.isArray(route.params.slug) && route.params.slug.length > 1
      ? decodeURIComponent(route.params.slug[1])
      : '';
  router.push({
    path: `/search/${filter}/${searchQuery}`,
    query: route.query,
  });
}
</script>
