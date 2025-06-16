<template>
  <div class="bg-brand-darker min-h-[620px] pt-50 flex items-center flex-col">
    <h1 class="text-white text-5xl">Over 11.4 Million+ Design Assets</h1>
    <div class="flex flex-col gap-3 mt-10">
      <UButton
        to="/search/lottie-animations?lottieFormat=lottie"
        variant="soft"
        color="neutral"
        class="text-black"
      >
        Search lottie animations rendered with .lottie assets
      </UButton>
      <UButton
        to="/search/lottie-animations?lottieFormat=original"
        variant="soft"
        color="neutral"
        class="text-black"
      >
        Search lottie animations rendered with .json assets
      </UButton>
    </div>
  </div>
</template>
