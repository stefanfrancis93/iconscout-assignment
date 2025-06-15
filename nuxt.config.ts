// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
  ],
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "light",
  },
  typescript: {
    strict: false,
  },
  sitemap: {
    urls: [
      { loc: "/search/all-assets", lastmod: new Date() },
      { loc: "/search/3d-illustrations", lastmod: new Date() },
      { loc: "/search/lottie-animations", lastmod: new Date() },
      { loc: "/search/illustrations", lastmod: new Date() },
      { loc: "/search/icons", lastmod: new Date() },
    ],
  },
  app: {
    head: {
      title:
        "IconScout: 11.4 Million+ Design Assets - SVGs, Icons, Illustrations, 3D, Lottie",
      meta: [
        {
          name: "google-site-verification",
          content: "Jd_4SOtiHifYSlrocqD8-eycsGanGBfikbryFLTdkN0",
        },
        {
          name: "title",
          content:
            "IconScout: 11.4 Million+ Design Assets - SVGs, Icons, Illustrations, 3D, Lottie",
        },
        {
          name: "description",
          content:
            "Curated SVGs, Vector Icons, Illustrations, 3D Graphics, and Lottie Animations. Over 10,000+ new assets added every day. Integrated plugins, tools, editors, and more.",
        },
        {
          name: "keywords",
          content:
            "icons, illustrations, 3d, lottie, svg, vector, design assets, free icons, free illustrations, plugins, editor, color editor, gltf, lottie animations, design, marketplace",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#23a675" },
        { property: "og:type", content: "website" },
        {
          property: "og:title",
          content:
            "IconScout: 11.4 Million+ Design Assets - SVGs, Icons, Illustrations, 3D, Lottie",
        },
        {
          property: "og:description",
          content:
            "Curated SVGs, Vector Icons, Illustrations, 3D Graphics, and Lottie Animations. Over 10,000+ new assets added every day. Integrated plugins, tools, editors, and more.",
        },
        {
          property: "og:url",
          content: "https://iconscout-assignment.vercel.app/",
        },
        {
          property: "og:image",
          content: "https://iconscout.com/img/iconscout-logo.color.23a6754.svg",
        },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content:
            "IconScout: 11.4 Million+ Design Assets - SVGs, Icons, Illustrations, 3D, Lottie",
        },
        {
          name: "twitter:description",
          content:
            "Curated SVGs, Vector Icons, Illustrations, 3D Graphics, and Lottie Animations. Over 10,000+ new assets added every day. Integrated plugins, tools, editors, and more.",
        },
        {
          name: "twitter:image",
          content: "https://iconscout.com/img/iconscout-logo.color.23a6754.svg",
        },
        { name: "robots", content: "index, follow" },
        { rel: "canonical", href: "https://iconscout-assignment.vercel.app/" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon.ico" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    },
  },
  site: {
    url: "https://iconscout-assignment.vercel.app/",
    name: "IconScout",
    description:
      "Curated SVGs, Vector Icons, Illustrations, 3D Graphics, and Lottie Animations. Over 10,000+ new assets added every day. Integrated plugins, tools, editors, and more.",
  },
});
