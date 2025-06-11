const ICONSCOUT_API =
  process.env.ICONSCOUT_API || "https://api.iconscout.com/v3/search";
const CLIENT_ID = process.env.ICONSCOUT_CLIENT_ID;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const {
    query: searchQuery,
    product_type,
    asset,
    per_page = "10",
    page = "1",
    sort = "relevant",
  } = query;

  const url = new URL(ICONSCOUT_API);
  url.searchParams.set("query", String(searchQuery));
  url.searchParams.set("product_type", String(product_type));
  url.searchParams.set("asset", String(asset));
  url.searchParams.set("per_page", String(per_page));
  url.searchParams.set("page", String(page));
  url.searchParams.set("sort", String(sort));

  const headers = new Headers();
  headers.set("accept", "application/json");
  if (CLIENT_ID) headers.set("Client-ID", CLIENT_ID);

  const res = await fetch(url.toString(), {
    headers,
  });

  if (!res.ok) {
    throw createError({
      statusMessage: "Failed to fetch from IconScout",
      statusCode: res.status,
    });
  }

  const data = await res.json();

  const items = data?.response?.items;
  return {
    status: data.status,
    data: items?.data || [],
    pagination: items
      ? {
          current_page: items.current_page,
          per_page: items.per_page,
          total: items.total,
          last_page: items.last_page,
          next_page_url: items.next_page_url,
          prev_page_url: items.prev_page_url,
        }
      : null,
    meta: data.meta || null,
    message: data.message || null,
  };
});
