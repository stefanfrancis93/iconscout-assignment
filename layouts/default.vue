<template>
  <UContainer class="min-h-screen flex flex-col px-0 sm:px-0 lg:px-0">
    <AppHeader />
    <div class="flex flex-col flex-1">
      <slot />
    </div>
    <AppFooter />
    <AuthModal :show="showAuthModal" :mode="authMode" @close="closeAuthModal" @update:mode="onUpdateMode" />
  </UContainer>
</template>

<script setup lang="ts">
import AuthModal from '~/components/AuthModal.vue'
import { useAuthModal } from '~/composables/useAuthModal'

const { showAuthModal, authMode, closeAuthModal } = useAuthModal()
function onUpdateMode(mode: 'login' | 'signup') {
  // This is just to trigger reactivity if needed
}
</script>
