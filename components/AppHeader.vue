<template>
  <header
    class="flex items-center justify-between px-6 py-3 bg-white shadow-[0px_6px_16px_0px_rgba(0,_0,_0,_0.08)]"
    role="banner"
  >
    <a href="/" class="flex items-center gap-2" aria-label="IconScout Home">
      <img src="/logo.svg" alt="IconScout Logo" class="w-[170]" >
    </a>

    <form
      class="flex items-center flex-1 max-w-xl mx-6 bg-white-400 rounded-lg px-2.5 py-2 gap-[9px] relative"
      role="search"
      aria-label="Asset search"
      @submit.prevent="onSearchSubmit"
    >
      <label for="asset-search" class="sr-only">Search assets</label>
      <UButton
        type="button"
        class="flex items-center gap-1 text-gray-700 font-semibold text-lg focus:outline-none bg-transparent border-0 px-0"
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        3D
        <svg
          class="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </UButton>
      <span class="h-8 w-px bg-[#C7CCE2] mx-2" />
      <img src="/search.svg" alt="Search" class="size-6" >

      <input
        id="asset-search"
        v-model="searchQuery"
        name="search"
        type="text"
        placeholder="Search from 8 Million+ assets"
        class="flex-1 bg-transparent border-0 outline-none text-lg text-gray-800 placeholder-gray-500 px-2"
        aria-label="Search from 8 Million+ assets"
        autocomplete="off"
        @focus="showRecent = true"
        @blur="onBlur"
        @keydown.enter="onSearchSubmit"
      >

      <div v-if="showRecent && recentSearches.length" class="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-lg z-10 p-4 min-w-[350px]">
        <div class="mb-2 font-semibold text-gray-900 text-base">Recent Search</div>
        <div class="flex flex-wrap gap-2 mb-2">
          <span
            v-for="(item, idx) in recentSearches"
            :key="item"
            class="flex items-center bg-gray-100 text-gray-800 rounded-lg px-3 py-1 text-sm cursor-pointer hover:bg-gray-200"
            @mousedown.prevent="triggerRecentSearch(item)"
          >
            {{ item }}
            <button type="button" class="ml-1 text-gray-400 hover:text-gray-600" @mousedown.stop.prevent="removeRecent(idx)">&times;</button>
          </span>
        </div>
      </div>
      <UButton
        type="button"
        class="ml-2 flex justify-center w-12 h-12 rounded-lg shadow-none focus:outline-none p-0 items-stretch"
        aria-label="Open asset search options"
      >
        <img
          src="/reverse-image-search.svg"
          alt="Reverse Image Search"
          class="w-[170]"
        >
      </UButton>
    </form>

    <nav aria-label="Main navigation">
      <ul class="flex items-center gap-4">
        <li>
          <UButton color="neutral" variant="ghost" class="text-[0] gap-0">
            Explore
            <img src="/angle-down.svg" alt="Explore" class="w-[170]" >
          </UButton>
        </li>
        <li>
          <UButton color="neutral" variant="ghost" class="text-[0] gap-0">
            Tools
            <img src="/angle-down.svg" alt="Tools" class="w-[170]" >
          </UButton>
        </li>
        <li>
          <UButton color="neutral" variant="ghost" class="text-[0] gap-0">
            All Features
          </UButton>
        </li>
        <li>
          <UButton color="neutral" variant="ghost" class="text-[0] gap-0">
            <img src="/gift.svg" alt="Free Asset" class="w-[170]" >
            Free Asset
          </UButton>
        </li>
        <li>
          <UButton color="neutral" variant="ghost" class="text-[0] gap-0">
            Learn
            <img src="/angle-down.svg" alt="Learn" class="w-[170]" >
          </UButton>
        </li>
      </ul>
    </nav>

    <div class="flex items-center gap-2 ml-4">
      <UButton
        size="xl"
        variant="outline"
        class="px-5 py-2.5 rounded-full text-black"
        aria-label="Login"
        >Login</UButton
      >
      <UButton
        size="xl"
        variant="solid"
        class="px-5 py-2.5 rounded-full bg-brand text-white"
        aria-label="Signup"
        >Signup</UButton
      >
    </div>
  </header>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const router = useRouter()
const route = useRoute()
const showRecent = ref(false)
const recentSearches = ref([])

function loadRecent() {
  try {
    recentSearches.value = JSON.parse(localStorage.getItem('recentSearches') || '[]')
  } catch {
    recentSearches.value = []
  }
}

function onSearchSubmit(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault()
  const query = searchQuery.value.trim()
  if (!query) return
  let recent = []
  try {
    recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
  } catch { /* empty */ }
  recent = [query, ...recent.filter(q => q !== query)]
  if (recent.length > 10) recent = recent.slice(0, 10)
  localStorage.setItem('recentSearches', JSON.stringify(recent))
  loadRecent()
  showRecent.value = false
  router.push(`/3d-illustrations/${encodeURIComponent(query)}`)
}

function removeRecent(idx) {
  recentSearches.value.splice(idx, 1)
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

function onBlur(_e) {
  // Delay hiding so button click can register
  setTimeout(() => { showRecent.value = false }, 120)
}

function triggerRecentSearch(item) {
  searchQuery.value = item
  onSearchSubmit()
}

onBeforeMount(() => {
  const path = route.path
  let query = ''
  const match = path.match(/^\/(all-assets|3d-illustrations|lottie-animations|illustrations|icons|ai-images)\/(.+)$/)
  if (match && match[2]) {
    query = decodeURIComponent(match[2])
    searchQuery.value = query
  }
  // If query exists, store it as a recent search if not already present
  if (query) {
    let recent = []
    try {
      recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    } catch { /* empty */ }
    if (!recent.includes(query)) {
      recent = [query, ...recent]
      if (recent.length > 10) recent = recent.slice(0, 10)
      localStorage.setItem('recentSearches', JSON.stringify(recent))
    }
  }
  loadRecent()
})
</script>
