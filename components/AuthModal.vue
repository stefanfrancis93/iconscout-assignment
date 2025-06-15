<template>
  <Teleport to="body">
    <Transition name="modal-slide-fade">
      <div v-if="show" class="fixed inset-0 z-[1040] flex items-center justify-center">
        <div class="fixed inset-0 bg-black/70" @click="close" />
        <div class="relative z-10 bg-white rounded-2xl md:rounded-4xl shadow-xl w-full max-w-[870px] mx-auto my-8">
          <UButton class="absolute top-4 right-4 p-2 cursor-pointer" @click="close">
            <img src="https://cdna.iconscout.com/img/close.86b735b.svg" height="24" alt="Close">
          </UButton>
          <div class="flex flex-col md:flex-row items-stretch p-4">
            <div
              class="hidden md:flex flex-col justify-center items-center bg-[#FEDE7E] rounded-2xl px-3 max-w-[50%] h-[720px] max-h-[100%]">
              <img
src="https://cdna.iconscout.com/img/auth-visual-1.71cea32.png" alt="Features"
                class="w-[450px] max-w-[80%]" />
            </div>
            <div class="flex flex-1 flex-col justify-center p-6 max-w-[50%]">
              <h4 class="text-4xl font-bold mb-6 text-black text-center">{{ mode === 'login' ? 'Log In' : 'Sign Up' }}
              </h4>
              <div class="flex flex-col gap-4">
                <UButton
                  class="flex items-center justify-center gap-1 bg-blue-400 hover:bg-blue-300 text-lg font-medium h-[58px] rounded-xl cursor-pointer transition-all duration-150 ease-in-out">
                  <span class="rounded-lg p-1.5 size-8 bg-white">
                    <img
src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="24"
                      height="24" />
                  </span>
                  Continue with Google
                </UButton>
                <UButton
                  class="flex items-center justify-center gap-1 bg-white text-black border-1 border-white-200 hover:bg-white-100 text-lg font-medium h-[58px] rounded-xl cursor-pointer transition-all duration-150 ease-in-out">
                  <svg width="24" height="24" fill="#1877F2" viewBox="0 0 24 24">
                    <path
                      d="M15.12,5.32H17V2.14A26.11,26.11,0,0,0,14.26,2C11.54,2,9.68,3.66,9.68,6.7V9.32H6.61v3.56H9.68V22h3.68V12.88h3.06l.46-3.56H13.36V7.05C13.36,6,13.64,5.32,15.12,5.32Z" />
                  </svg>
                  Continue with Facebook
                </UButton>
              </div>
              <div class="flex items-center my-5">
                <div class="flex-1 h-px bg-white-200"></div>
                <span class="mx-3 text-gray-75">or</span>
                <div class="flex-1 h-px bg-white-200"></div>
              </div>
              <UForm :state="formState" @submit.prevent="submit">
                <UFormField>
                  <UInput
id="auth-email" v-model="email" size="xl" type="email" placeholder="Email Address"
                    class="w-full mb-4 rounded-lg" required autocomplete="email" aria-label="Email Address"
                    aria-required="true" />
                </UFormField>
                <UFormField>
                  <UInput
id="auth-password" v-model="password" size="xl" type="password" placeholder="Password"
                    class="w-full mb-4 rounded-lg" required autocomplete="current-password" aria-label="Password"
                    aria-required="true" />
                </UFormField>
                <UButton
type="submit"
                  class="w-full justify-center bg-brand text-white border-1 border-brand hover:bg-brand-darker hover:border-brand-darker px-4 py-2 rounded-lg font-medium text-base cursor-pointer transition-all duration-150 ease-in-out">
                  {{
                    mode === 'login' ? 'Log in' : 'Sign up' }}</UButton>
              </UForm>
              <div v-if="mode === 'login'" class="text-center mt-5 pb-8">
                <a href="#" class="text-gray-250 text-sm hover:text-gray-450 hover:underline">Forgot Password?</a>
              </div>
              <div class="text-center pt-8 text-sm border-t-1 border-white-100">
                <span class="text-gray-250 text-sm">{{
                  mode === 'login'
                    ? "Don't have an account?"
                    : "Already have an account?" }}
                </span>
                <button class="ml-1 text-brand-darker font-base hover:underline cursor-pointer" @click="toggleMode">
                  {{ mode === 'login' ? 'Signup Now' : 'Log In' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ show: boolean; mode?: 'login' | 'signup' }>()
const emit = defineEmits(['close', 'update:mode'])
const email = ref('')
const password = ref('')
const formState = reactive({
  email,
  password,
  error: '',
  loading: false
})
const mode = ref(props.mode || 'login')
const { setToken } = useAuth()

watch(() => props.mode, (val) => {
  if (val) mode.value = val
})

function close() {
  emit('close')
}
function toggleMode() {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
  emit('update:mode', mode.value)
}
async function submit() {
  formState.error = ''
  formState.loading = true
  try {
    const endpoint = mode.value === 'login' ? '/api/login' : '/api/signup'
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    const { access_token } = await res.json() ?? {}
    if (access_token) {
      setToken(access_token)
      close()
    } else {
      if (mode.value === 'signup') {
        formState.error = 'Signup failed! Please try again.'
      } else {
        formState.error = 'Incorrect email or password!'
      }
    }
  } catch {
    formState.error = 'Something went wrong!'
  } finally {
    formState.loading = false
  }
}
</script>

<style scoped>
.modal-slide-fade-enter-active,
.modal-slide-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-40px);
}

.modal-slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.modal-slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.modal-slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}
</style>
