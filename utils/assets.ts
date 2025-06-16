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

function getAssetTypeLabel(assetType: string | undefined) {
  switch (assetType) {
    case "3d":
      return "3D Illustrations";
    case "lottie":
      return "Animations";
    case "illustration":
      return "Illustrations";
    case "icon":
      return "Icons";
    case "all":
    default:
      return "Design Assets";
  }
}

export function getSearchResultsTitle(
  totalAssets = 0,
  slug: string | string[],
  searchQuery = "",
  loadingStatus: string
) {
  const searchTerm = capitalize(searchQuery);
  const _assetType = getAssetType(slug);
  const label = getAssetTypeLabel(_assetType);

  if (loadingStatus === "pending" || loadingStatus === "idle") {
    return `Searching ${searchTerm} ${label}`.trim();
  }
  return `${formatNumber(totalAssets)} ${searchTerm} ${label}`.trim();
}
