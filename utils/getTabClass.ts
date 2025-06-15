/**
 * Returns the tab CSS class string for navigation tabs based on the current route/slug.
 * @param base - The base path for the tab (e.g. '/all-assets')
 * @param slug - The slug array from route.params.slug
 * @param routePath - The current route path
 * @returns The computed class string for the tab
 */
export function getTabClass(
  base: string,
  slug: string[] | string | undefined,
  routePath: string
): string {
  const re = new RegExp(`^${base}(/|$)`);
  const path =
    Array.isArray(slug) && slug.length > 0 ? `/${slug[0]}` : routePath;
  const query: string = Array.isArray(slug) && slug.length > 1 ? slug[1] : "";
  const isActive = re.test(path);
  const baseClass =
    "text-sm px-0 py-0 bg-transparent border-none shadow-none transition-colors duration-150 font-semibold text-blue-500 cursor-pointer";
  const activeClass =
    "text-black font-bold relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-11px] after:border-b-2 after:border-black";

  const defaultFilterSelected = isActive && base === "/all-assets" && query === "";
  
  return (isActive || defaultFilterSelected) ? `${baseClass} ${activeClass}` : baseClass;
}
