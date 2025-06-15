/**
 * useIntersectionObserver composable for infinite loading
 * @param targetRef - ref to the DOM element to observe
 * @param callback - function to call when the element is intersecting
 * @param options - IntersectionObserver options
 * @param enabled - whether the observer should be active
 */
export function useIntersectionObserver(
  targetRef: Ref<HTMLElement | null>,
  callback: () => void,
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: "400px",
    threshold: 0.01,
  },
  enabled: () => boolean = () => true
) {
  let observer: IntersectionObserver | null = null;

  function setupObserver() {
    if (observer) {
      observer.disconnect();
    }
    observer = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && enabled()) {
        callback();
      }
    }, options);
    if (targetRef.value) {
      observer.observe(targetRef.value);
    }
  }

  onMounted(() => {
    setupObserver();
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  watch(targetRef, () => {
    setupObserver();
  });
}
