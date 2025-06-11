<template>
  <div>
    <div class="flex flex-col pt-6 pl-10">
      <h1 class="text-black text-[35px] font-bold">
        237 Limit 3D Illustrations
      </h1>
    </div>
    <div class="flex items-end mb-3">
      <div class="w-[260px] border-r border-b border-[#EBEDF5]">
        <UButton color="primary" variant="ghost" class="flex justify-between gap-2 text-md text-gray-500 w-full h-12">
          <span class="flex items-center gap-2">
            <img src="/filter.svg" alt="Filters" class="size-6">
            Filters
          </span>
          <img src="/close.svg" alt="Close" class="size-6">
        </UButton>
      </div>
        <ul
          role="tablist"
          class="flex flex-row gap-8 bg-transparent items-center ml-[43px] mb-3 min-w-0 whitespace-nowrap"
        >
          <li role="presentation">
            <NuxtLink
              :to="`/all-assets/${query}`"
              :class="tabClass('/all-assets')"
              role="tab"
              rel="follow"
            >
              All Assets
            </NuxtLink>
          </li>
          <li role="presentation">
            <NuxtLink
              :to="`/3d-illustrations/${query}`"
              :class="tabClass('/3d-illustrations')"
              role="tab"
              rel="follow"
            >
              3D Illustrations
            </NuxtLink>
          </li>
          <li role="presentation">
            <NuxtLink
              :to="`/lottie-animations/${query}`"
              :class="tabClass('/lottie-animations')"
              role="tab"
              rel="follow"
            >
              Lottie Animations
            </NuxtLink>
          </li>
          <li role="presentation">
            <NuxtLink
              :to="`/kit-illustrations/${query}`"
              :class="tabClass('/kit-illustrations')"
              role="tab"
              rel="nofollow"
            >
              Illustration Kits
            </NuxtLink>
          </li>
          <li role="presentation">
            <NuxtLink
              :to="`/illustrations/${query}`"
              :class="tabClass('/illustrations')"
              role="tab"
              rel="follow"
            >
              Illustrations
            </NuxtLink>
          </li>
          <li role="presentation">
            <NuxtLink
              :to="`/icons/${query}`"
              :class="tabClass('/icons')"
              role="tab"
              rel="follow"
            >
              Icons
            </NuxtLink>
          </li>
          <li role="presentation">
            <NuxtLink
              :to="`/ai-images/${query}`"
              :class="tabClass('/ai-images')"
              role="tab"
              rel="nofollow"
            >
              AI Images
              <span class="ml-1 px-2 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-semibold align-middle">NEW</span>
            </NuxtLink>
          </li>
        </ul>
    </div>
    <div>
      <div>
        <template v-if="pending">
          <div class="py-10 text-center text-gray-400">Loading assets...</div>
        </template>
        <template v-else-if="error">
          <div class="py-10 text-center text-red-500">Failed to load assets.</div>
        </template>
        <template v-else-if="assets && assets.data && assets.data.length">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            <div v-for="item in assets.data" :key="item.id" class="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <img
                v-if="item.urls && (item.urls.thumb || item.urls.png_256 || item.urls.png_128 || item.urls.png_64)"
                :src="item.urls.thumb || item.urls.png_256 || item.urls.png_128 || item.urls.png_64"
                :alt="item.name || 'Asset'"
                class="w-32 h-32 object-contain mb-2"
              >
              <div class="text-center text-sm font-medium text-gray-800 truncate w-full">{{ item.name }}</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="py-10 text-center text-gray-400">No assets found.</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const route = useRoute()
const slug = route.params.slug || [];
const query = (Array.isArray(slug) && slug.length > 1) ? slug[1] : '';

function getAssetType(slugArr) {
  const tab = Array.isArray(slugArr) && slugArr.length > 0 ? slugArr[0] : '';
  switch (tab) {
    case '3d-illustrations':
      return '3d';
    case 'lottie-animations':
      return 'lottie';
    case 'illustrations':
      return 'illustration';
    case 'icons':
      return 'icon';
    case 'all-assets':
    case 'kit-illustrations':
    case 'ai-images':
    default:
      return undefined; // undefined means all assets
  }
}

const assetType = getAssetType(slug);

const { data: assets, pending, error } = await useFetch('/api/assets', {
  query: {
    query: query,
    product_type: 'item',
    asset: assetType,
  },
  key: `assets-${assetType || 'all'}-${query}`,
})

function tabClass(base) {
  const re = new RegExp(`^${base}(/|$)`)

  const path = Array.isArray(slug) && slug.length > 0 ? `/${slug[0]}` : route.path;
  const isActive = re.test(path);
  const baseClass = 'text-sm px-0 py-0 bg-transparent border-none shadow-none transition-colors duration-150 font-semibold text-blue-500';
  const activeClass = 'text-black font-bold relative after:content-[\'\'] after:absolute after:left-0 after:right-0 after:bottom-[-11px] after:border-b-2 after:border-black';
  return isActive ? `${baseClass} ${activeClass}` : baseClass;
}
</script>
