import type { Asset, GetAssetsResponse } from "~/shared/types/assets";
import { lottieData } from "../mockData.lottie";

const API_BASE = process.env.ICONSCOUT_API_BASE;
const CLIENT_ID = process.env.ICONSCOUT_CLIENT_ID;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const {
    query: searchQuery,
    product_type,
    asset,
    per_page = "50",
    page = "1",
    sort = "relevant",
  } = query;

  const url = new URL(`${API_BASE}/v3/search`);
  if (searchQuery != null) url.searchParams.set("query", String(searchQuery));
  if (product_type != null)
    url.searchParams.set("product_type", String(product_type));
  if (asset != null) url.searchParams.set("asset", String(asset));
  if (per_page != null) url.searchParams.set("per_page", String(per_page));
  if (page != null) url.searchParams.set("page", String(page));
  if (sort != null) url.searchParams.set("sort", String(sort));

  const headers = new Headers();
  headers.set("accept", "application/json");
  if (CLIENT_ID) headers.set("Client-ID", CLIENT_ID);

  interface IconScoutApiResponse {
    status: string;
    message?: string;
    response?: {
      items?: {
        data?: Asset[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
      };
    };
  }

  let data: IconScoutApiResponse;
  try {
    const res = await fetch(url.toString(), {
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("IconScout API error:", res.status, text);
      throw createError({
        statusMessage: `Failed to fetch from IconScout: ${res.status} ${text}`,
        statusCode: res.status,
      });
    }

    data = await res.json();
    const items = data.response?.items;

    const response: GetAssetsResponse = {
      status: data.status,
      data: (asset === "lottie" ? lottieData : items?.data || []) as Asset[],
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
      message: data.message || null,
    };
    return response;
  } catch (err) {
    console.error("API fetch error:", err);
    throw createError({
      statusMessage:
        "Failed to fetch from IconScout (network or unhandled error)",
      statusCode: 500,
    });
  }
});
