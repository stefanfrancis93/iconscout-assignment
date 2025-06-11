<template>
  <USkeleton class="w-full max-w-[280px] h-[210px] rounded-lg asset-skeleton-gradient" />
</template>

<style scoped>
@media (max-width: 640px) {
  .max-w-\[280px\] {
    max-width: 100% !important;
  }
  .h-\[210px\] {
    height: 160px !important;
  }
}

.asset-skeleton-gradient {
  background: linear-gradient(116.58deg, #FAFAFC -1.61%, #F1F1F6 22.04%, #FAFAFC 49.72%, #F1F1F6 73.88%, #FAFAFC 95.02%);
}
</style>
