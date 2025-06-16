/**
 * Shallowly compares two objects with string keys and string values for equality.
 * @param a - First object
 * @param b - Second object
 * @returns true if all keys and values are equal, false otherwise
 */
export function shallowObjectComparison(
  a: Record<string, string>,
  b: Record<string, string>
): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

/**
 * Normalizes a query object by converting all values to strings.
 * Arrays are joined with commas, undefined values become empty strings.
 *
 * @param query - The query object with string, string[] or undefined values
 * @returns A new object with all values as strings
 */
export function normalizeQuery(
  query: Record<string, string | string[] | undefined>
) {
  return Object.fromEntries(
    Object.entries(query).map(([k, v]) => [
      k,
      Array.isArray(v) ? v.join(",") : v ?? "",
    ])
  ) satisfies Record<string, string>;
}
