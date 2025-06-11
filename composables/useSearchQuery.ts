/**
 * Composable for SSR-safe search query state and recent search management.
 * @returns searchQuery, showRecent, recentSearches, handlers
 */
export function useSearchQuery() {
  const route = useRoute();
  const router = useRouter();

  // SSR-safe initial value from route
  const initialSearch =
    (route.query.search as string) ||
    (Array.isArray(route.params.slug) && route.params.slug.length > 1
      ? decodeURIComponent(route.params.slug[1])
      : '');

  const searchQuery = ref<string>(initialSearch);
  const showRecent = ref<boolean>(false);
  const recentSearches = ref<string[]>([]);

  /** Loads recent searches from localStorage. */
  function loadRecent(): void {
    try {
      recentSearches.value = JSON.parse(
        localStorage.getItem('recentSearches') || '[]'
      );
    } catch {
      recentSearches.value = [];
    }
  }

  /**
   * Handles the search form submission, updates recent searches, and navigates to the search results page.
   * @param e - The submit event (optional)
   */
  function onSearchSubmit(e?: Event): void {
    if (e && typeof (e as Event).preventDefault === 'function') (e as Event).preventDefault();
    const query = searchQuery.value.trim();
    if (!query) return;
    let recent: string[] = [];
    try {
      recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    } catch {
      /* empty */
    }
    recent = [query, ...recent.filter((q) => q !== query)];
    if (recent.length > 10) recent = recent.slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(recent));
    loadRecent();
    showRecent.value = false;
    router.push(`/3d-illustrations/${encodeURIComponent(query)}`);
  }

  /** Removes a recent search entry by index. */
  function removeRecent(idx: number): void {
    recentSearches.value.splice(idx, 1);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
  }

  /** Handles blur event on the search input, delays hiding the recent search dropdown. */
  function onBlur(_e: FocusEvent): void {
    setTimeout(() => {
      showRecent.value = false;
    }, 120);
  }

  /** Triggers a search using a recent search item. */
  function triggerRecentSearch(item: string): void {
    searchQuery.value = item;
    onSearchSubmit();
  }

  onBeforeMount(() => {
    // If query exists, store it as a recent search if not already present
    if (searchQuery.value) {
      let recent: string[] = [];
      try {
        recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      } catch {
        /* empty */
      }
      if (!recent.includes(searchQuery.value)) {
        recent = [searchQuery.value, ...recent];
        if (recent.length > 10) recent = recent.slice(0, 10);
        localStorage.setItem('recentSearches', JSON.stringify(recent));
      }
    }
    loadRecent();
  });

  return {
    searchQuery,
    showRecent,
    recentSearches,
    loadRecent,
    onSearchSubmit,
    removeRecent,
    onBlur,
    triggerRecentSearch,
  };
}
