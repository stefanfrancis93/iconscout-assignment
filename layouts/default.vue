<template>
  <UContainer class="min-h-screen flex flex-col px-0 sm:px-0 lg:px-0">
    <AppHeader />
    <div class="flex flex-col flex-1">
      <slot />
    </div>
    <AppFooter />
  </UContainer>
</template>
