export interface AssetColorCode {
  decimal_color: number;
  color_id: number;
}

export type AssetType = "3d" | "lottie" | "illustration" | "icon";

export interface AssetBase {
  id: number;
  uuid: string;
  asset: AssetType;
  name: string;
  slug: string;
  price: number;
  color_codes: AssetColorCode[];
}

export interface Asset3D extends AssetBase {
  asset: "3d";
  urls: {
    original?: string;
    preview?: string;
    thumb?: string;
  };
}

export interface AssetLottie extends AssetBase {
  asset: "lottie";
  urls: {
    thumb?: string;
    preview?: string;
    original?: string;
    gif?: string;
    mp4?: string;
    lottie?: string;
    preview_image?: string;
  };
}

export interface AssetIllustration extends AssetBase {
  asset: "illustration";
  urls: {
    thumb?: string;
    preview?: string;
    original?: string;
    svg?: string;
  };
}

export interface AssetIcon extends AssetBase {
  asset: "icon";
  urls: {
    png_128?: string;
    png_256?: string;
    png_512?: string;
    original?: string;
  };
}

export type Asset = Asset3D | AssetLottie | AssetIllustration | AssetIcon;

export interface GetAssetsResponse {
  status: string;
  data: Asset[];
  pagination: {
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    per_page: number;
    prev_page_url: string | null;
    total: number;
  } | null;
  message: string | null;
}
