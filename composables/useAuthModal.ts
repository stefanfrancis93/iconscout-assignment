import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const showAuthModal = ref(false)
const authMode = ref<'login' | 'signup'>('login')

export function useAuthModal() {
  const route = useRoute()
  const router = useRouter()

  function openAuthModal(mode: 'login' | 'signup' = 'login') {
    authMode.value = mode
    showAuthModal.value = true
    // Nuxt modal route: push with modal param
    router.push({
      query: { ...route.query, modal: mode }
    })
  }

  function closeAuthModal() {
    showAuthModal.value = false
    // Remove modal param
    const { modal, ...rest } = route.query
    router.replace({ query: rest })
  }

  // Watch for modal route param
  if (import.meta.client) {
    watch(
      () => route.query.modal,
      (val) => {
        if (val === 'login' || val === 'signup') {
          showAuthModal.value = true
          authMode.value = val
        } else {
          showAuthModal.value = false
        }
      },
      { immediate: true }
    )
  }

  return { showAuthModal, authMode, openAuthModal, closeAuthModal }
}
