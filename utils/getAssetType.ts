/**
 * Returns the asset type string for a given Nuxt dynamic slug array.
 * @param slugArr - The slug array from route.params.slug
 * @returns Asset type string or undefined
 */
export function getAssetType(
  slugArr: string[] | string | undefined
): string | undefined {
  const tab = Array.isArray(slugArr) && slugArr.length > 0 ? slugArr[0] : "";
  switch (tab) {
    case "3d-illustrations":
      return "3d";
    case "lottie-animations":
      return "lottie";
    case "illustrations":
      return "illustration";
    case "icons":
      return "icon";
    default:
      return undefined; // undefined means all assets
  }
}
