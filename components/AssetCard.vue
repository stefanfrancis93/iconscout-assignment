<template>
  <article :title="item.name" :class="`block rounded-xl bg-[#FAFAFC] relative w-full`">
    <a href="#" tabindex="-1" class="flex items-center justify-center h-full w-full p-2 group">
      <template v-if="item && item.urls">
        <DotLottieVue v-if="item.urls.lottie" :src="item.urls.lottie" :autoplay="true" :loop="true" />
        <video
v-else-if="item.urls.thumb && item.urls.thumb.endsWith('.mp4')" :src="item.urls.thumb" autoplay loop
          muted :alt="item.name" class="w-32 h-32 object-contain mb-2" />
        <picture
v-else-if="item.urls.thumb || item.urls.png_256 || item.urls.png_128 || item.urls.png_64"
          class="thumb_PdMgf flex items-center justify-center h-full w-full relative overflow-hidden rounded-[12px]">
          <source
v-if="item.urls.thumb" type="image/webp"
            :srcset="`${item.urls.thumb}?f=webp 1x, ${item.urls.thumb}?f=webp 2x`" />
          <img
:id="`plp-asset-card-${item.id}`" :alt="item.name" loading="lazy"
            :src="item.urls.thumb || item.urls.png_256 || item.urls.png_128 || item.urls.png_64" :srcset="item.urls.thumb
              ? `${item.urls.thumb}?f=webp 1x, ${item.urls.thumb}?f=webp 2x`
              : ''
              "
            :class="`w-full h-full max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out pointer-events-none ${item.asset === '3d' ? 'group-hover:scale-105' : ''}`" />
        </picture>
      </template>
    </a>
  </article>
</template>

<script setup lang="ts">
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import type { Asset } from "~/shared/types/assets";

interface Props {
  item: Asset;
}

defineProps<Props>();
</script>
