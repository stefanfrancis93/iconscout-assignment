<template>
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
    <!-- <li role="presentation">
          <NuxtLink
            :to="`/kit-illustrations/${query}`"
            :class="tabClass('/kit-illustrations')"
            role="tab"
            rel="nofollow"
          >
            Illustration Kits
          </NuxtLink>
        </li> -->
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
    <!-- <li role="presentation">
          <NuxtLink
            :to="`/ai-images/${query}`"
            :class="tabClass('/ai-images')"
            role="tab"
            rel="nofollow"
          >
            AI Images
            <span
              class="ml-1 px-2 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-semibold align-middle"
              >NEW</span
            >
          </NuxtLink>
        </li> -->
  </ul>
</template>

<script setup lang="ts">
import { getTabClass } from "~/utils/getTabClass";

const props = defineProps<{
  slug: string[];
  query: string;
  routePath: string;
}>();

function tabClass(base: string): string {
  return getTabClass(base, props.slug, props.routePath);
}
</script>
