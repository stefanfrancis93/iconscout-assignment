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

export function getSearchResultsTitle(totalAssets = 0, slug: string | string[], query = "") {
  const searchTerm = capitalize(query);
  let title = "";
  const _assetType = getAssetType(slug)
  switch (_assetType) {
    case "3d":
      title = `${formatNumber(totalAssets)} ${searchTerm} 3D Illustrations`;
      break;
    case "lottie":
      title = `${formatNumber(totalAssets)} ${searchTerm} Animations`;
      break;
    case "illustration":
      title = `${formatNumber(totalAssets)} ${searchTerm} Illustrations`;
      break;
    case "icon":
      title = `${formatNumber(totalAssets)} ${searchTerm} Icons`;
      break;
    case "all":
    default:
      title = `${formatNumber(totalAssets)} ${searchTerm} Design Assets`;
  }
  return title.trim();
}
