<template>
  <header
    class="flex items-center justify-between px-6 py-3 bg-white shadow-[0px_6px_16px_0px_rgba(0,_0,_0,_0.08)] sticky top-0 z-10 h-[70px] gap-4 md:gap-0"
    role="banner"
  >
    <div class="flex gap-4 xl:gap-[29px] w-full">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 w-[120px] md:w-[170px]"
        aria-label="IconScout Home"
      >
        <img
          src="/logo.svg"
          alt="IconScout Logo"
          class="w-[120px] md:min-w-[170px]"
        />
      </NuxtLink>
      <UForm
        :state="{ searchQuery }"
        class="w-full max-w-none md:max-w-[360px]"
        @submit.prevent="onSearchSubmit"
      >
        <UButtonGroup
          size="sm"
          class="flex bg-white-100 items-center flex-1 w-full rounded-lg px-2.5 py-2 gap-[9px] h-[46px]"
        >
          <USelect
            v-model="assetDropdownValue"
            :items="assets"
            variant="ghost"
            class="cursor-pointer"
            :ui="{
              item: 'cursor-pointer',
              content: 'w-25',
              base: 'hover:bg-transparent',
            }"
            :content="{
              align: 'center',
              side: 'bottom',
              sideOffset: 10,
            }"
            @update:model-value="onChangeAssetFilter"
          />
          <USeparator
            orientation="vertical"
            class="h-7"
            :ui="{ border: 'border-gray-50' }"
          />
          <UInput
            v-model="searchQuery"
            class="flex-1"
            label="Search assets"
            leading-icon="i-lucide-search"
            placeholder="Search from 8 Million+ assets"
            size="md"
            name="searchQuery"
            variant="ghost"
            :ui="{
              trailing: 'p-0',
              base: 'bg-transparent hover:bg-transparent hover:cursor-text focus:bg-transparent placeholder:text-gray-500',
            }"
          >
            <template #trailing>
              <UButton
                type="button"
                class="ml-2 flex justify-center w-12 h-12 rounded-lg shadow-none focus:outline-none m-0 p-0 size-7.5 bg-transparent hover:bg-transparent"
                aria-label="Open asset search options"
              >
                <img
                  src="public/reverse-image-search.svg"
                  alt="Reverse Image Search"
                  class="size-7.5"
                />
              </UButton>
            </template>
          </UInput>
        </UButtonGroup>
      </UForm>
      <UNavigationMenu
        color="neutral"
        variant="link"
        :items="items"
        :ui="{
          root: 'hidden xl:flex',
          item: 'p-0',
          link: 'text-gray-550 hover:text-brand-darker text-xs lg:text-base font-semibold gap-0 cursor-pointer p-1 lg:p-2.5',
          linkTrailingIcon: 'size-4',
        }"
      />
    </div>

    <template v-if="isLoggedIn">
      <UDropdownMenu :items="dropdownItems" :modal="false">
        <UButton
          color="neutral"
          variant="outline"
          class="bg-white-100 rounded-full p-1 justify-center overflow-hidden cursor-pointer size-[46px] min-w-auto min-h-auto"
        >
          <div
            class="flex size-10 rounded-full p-0 justify-center items-center overflow-hidden"
          >
            <img
              src="https://cdna.iconscout.com/img/1.3a7e05a.svg"
              class="size-10 object-cover"
            />
          </div>
        </UButton>
      </UDropdownMenu>
    </template>
    <template v-else>
      <div class="flex items-center gap-2 ml-4">
        <UButton
          size="xl"
          variant="outline"
          class="px-5 py-2.5 rounded-full text-black cursor-pointer"
          aria-label="Login"
          @click="openAuthModal('login')"
          >Login</UButton
        >
        <UButton
          size="xl"
          variant="solid"
          class="px-5 py-2.5 rounded-full bg-brand text-white cursor-pointer"
          aria-label="Signup"
          @click="openAuthModal('signup')"
          >Signup</UButton
        >
      </div>
    </template>
  </header>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

const { openAuthModal } = useAuthModal();
const { isLoggedIn, logout } = useAuth();
const route = useRoute();
const router = useRouter();
const assetDropdownValue = ref<string>(
  Array.isArray(route.params.slug) && route.params.slug.length > 0
    ? decodeURIComponent(route.params.slug[0])
    : "all-assets"
);
const assets = [
  { label: "All", value: "all-assets" },
  { label: "3D", value: "3d-illustrations" },
  { label: "Lottie", value: "lottie-animations" },
  { label: "Illustrations", value: "illustrations" },
  { label: "Icons", value: "icons" },
];
const initialSearch =
  Array.isArray(route.params.slug) && route.params.slug.length > 1
    ? decodeURIComponent(route.params.slug[1])
    : "";
const searchQuery = ref<string>(initialSearch);

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: "Explore",
      trailingIcon: "i-lucide-chevron-down",
    },
    {
      label: "Tools",
      trailingIcon: "i-lucide-chevron-down",
    },
    {
      label: "All Features",
      trailingIcon: "i-lucide-chevron-down",
    },
    {
      label: "Free Asset",
      trailingIcon: "i-lucide-chevron-down",
    },
    {
      label: "Learn",
      trailingIcon: "i-lucide-chevron-down",
    },
  ],
]);

const dropdownItems = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Logout",
      icon: "i-lucide-log-out",
      class: "cursor-pointer",
      onClick: logout,
    },
  ],
]);

function onSearchSubmit() {
  const query = searchQuery.value.trim();
  if (!query) return;
  router.push(
    `/search/${assetDropdownValue.value}/${encodeURIComponent(query)}`
  );
}

watch(
  () => route.params.slug,
  (newSlug) => {
    if (Array.isArray(newSlug) && newSlug.length > 0) {
      assetDropdownValue.value = decodeURIComponent(newSlug[0]);
    }
  }
);

function onChangeAssetFilter(filter) {
  router.push({
    path: `/search/${filter}/${searchQuery.value}`,
    query: route.query,
  });
}
</script>
