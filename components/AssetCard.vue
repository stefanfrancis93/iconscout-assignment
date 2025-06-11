<template>
  <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center">
    <template v-if="item && item.urls">
      <video
        v-if="item.urls.thumb && item.urls.thumb.endsWith('.mp4')"
        :src="item.urls.thumb"
        autoplay
        loop
        muted
        :alt="item.name"
        class="w-32 h-32 object-contain mb-2"
      />
      <img
        v-else-if="
          item.urls.thumb ||
          item.urls.png_256 ||
          item.urls.png_128 ||
          item.urls.png_64
        "
        :src="
          item.urls.thumb ||
          item.urls.png_256 ||
          item.urls.png_128 ||
          item.urls.png_64
        "
        :alt="item.name"
        class="w-32 h-32 object-contain mb-2"
      />
    </template>
    <div class="text-center text-sm font-medium text-gray-800 truncate w-full">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface AssetItem {
  id: string;
  name: string;
  urls: {
    thumb?: string;
    png_256?: string;
    png_128?: string;
    png_64?: string;
  };
}

interface Props {
  item: AssetItem;
}

defineProps<Props>();
</script>
