<template>
  <article
    v-if="item && item.urls"
    ref="containerRef"
    :title="item.name"
    class="block rounded-lg bg-[#FAFAFC] relative w-full asset-card"
  >
    <div
      v-if="showAsset"
      class="flex items-center justify-center h-full w-full py-2 px-3 group cursor-pointer"
    >
      <DotLottieVue
        v-if="item.urls.lottie || item.urls.original"
        :src="getLottieSrc"
        :autoplay="true"
        :loop="true"
      />
      <video
        v-else-if="item.urls.thumb && item.urls.thumb.endsWith('.mp4')"
        :src="item.urls.thumb"
        autoplay
        loop
        muted
        :alt="item.name"
        class="w-full h-full"
      />
      <picture
        v-else-if="
          item.urls.thumb ||
          item.urls.png_256 ||
          item.urls.png_128 ||
          item.urls.png_64
        "
        class="thumb_PdMgf flex items-center justify-center h-full w-full relative overflow-hidden rounded-lg"
      >
        <source v-if="fallbackImage" type="image/webp" :srcset="webpSrcSet" />
        <img
          :alt="item.name"
          loading="lazy"
          :src="fallbackImage"
          :srcset="webpSrcSet"
          :class="`w-full h-full max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out pointer-events-none ${
            item.asset === '3d' ? 'group-hover:scale-105' : ''
          }`"
        />
      </picture>
    </div>
    <div class="asset-card__details">
      <UButton
        variant="soft"
        color="neutral"
        class="absolute top-2 right-3 size-9 p-1.5 bg-white-100 hover:bg-white border-white-200"
      >
        <img src="/folder.svg" />
      </UButton>
      <UButton
        variant="soft"
        color="neutral"
        class="absolute bottom-2 right-3 size-9 p-1.5 bg-white-100 hover:bg-white border-white-200"
      >
        <img src="/download.svg" />
      </UButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import type { Asset } from "~/shared/types/assets";

interface Props {
  item: Asset;
}

const route = useRoute();
const { lottieFormat } = route.query;
const props = defineProps<Props>();
const showAsset = ref(false);
const containerRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver;

const fallbackImage = computed(() => {
  return (
    props.item.urls.thumb ||
    props.item.urls.png_256 ||
    props.item.urls.png_128 ||
    props.item.urls.png_64 ||
    ""
  );
});

const webpSrcSet = computed(() => {
  return fallbackImage.value
    ? `${fallbackImage.value}?f=webp 1x, ${fallbackImage.value}?f=webp 2x`
    : "";
});

const getLottieSrc = computed(() =>
  lottieFormat
    ? props.item.urls[typeof lottieFormat === "string" ? lottieFormat : lottieFormat[0]]
    : props.item.urls.lottie || props.item.urls.original
);

onMounted(() => {
  if (!containerRef.value) return;

  observer = new IntersectionObserver(
    ([entry]) => {
      showAsset.value = entry.isIntersecting;
    },
    { threshold: 0.25 }
  );

  observer.observe(containerRef.value);
});

onBeforeUnmount(() => {
  if (observer && containerRef.value) {
    observer.unobserve(containerRef.value);
  }
});
</script>

<style scoped>
.asset-card .asset-card__details {
  opacity: 0;
  transition: opacity 0.15s linear;
}

.asset-card:hover .asset-card__details {
  opacity: 1;
}

.asset-card .asset-card__details::before {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  content: "";
  display: block;
  opacity: 0;
  background: rgb(46 51 76 / 10%);
  transition: opacity 0.15s linear;
  border-radius: 8px;
  pointer-events: none;
}

.asset-card:hover .asset-card__details::before {
  opacity: 1;
}
</style>
