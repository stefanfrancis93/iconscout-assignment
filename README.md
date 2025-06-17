# IconScout Search Page – Nuxt 3 Assignment

## Project Overview
This project is a solution for the Sr. Front-End Developer assessment. The goal is to replicate the IconScout Search Page using Nuxt 3, implementing infinite loading for Lottie Animations, SSR, and best SEO practices. The solution integrates the provided [IconScout v3 API](https://app.swaggerhub.com/apis-docs/rankarpan/iconscout-rest-api/3.0) and compares two Lottie players for animation previews.

---

## Assignment Details
- **Replicate the IconScout Search Page** as per the provided Figma design and requirements.
- **API Integration:** Uses IconScout API v3 for search and asset retrieval ([API Docs](https://app.swaggerhub.com/apis-docs/rankarpan/iconscout-rest-api/3.0)).
- **Lottie Animations:**
  - Infinite loading for results.
  - Two search pages: [one using Lottie player](https://iconscout-assignment.vercel.app/lottie-animations?lottieFormat=lottie), [one using Dotlottie player](https://iconscout-assignment.vercel.app/lottie-animations?lottieFormat=original).
  - Comparison and conclusion on player performance.
- **SSR & SEO:** Implemented for performance and discoverability.
- **UI:** Header included as per Figma. Bootstrap Vue replaced with NuxtUI for Vue 3 compatibility.

---

## Tech Stack
- **Nuxt 3** (Vue 3, Vite, SSR, SEO out-of-the-box)
- **@lottiefiles/dotlottie-vue** & **@lottiefiles/lottie-player** (for animation previews)
- **Nuxt UI** (utility-first styling, fast prototyping)
- **Other:** Axios (API calls), Vercel (deployment)

### Why this stack?
- Nuxt 3 offers modern SSR, great DX, and SEO support.
- Vue 3 is performant and future-proof.
- NuxtUI is used for its Vue 3 compatibility, utility-first approach, and rapid UI development, offering more flexibility than Bootstrap or Tailwind CSS alone.
- Lottie/Dotlottie players are lightweight and easy to integrate.
---

## Setup & Running

### Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## Assumptions & Considerations
- Infinite loading is implemented using intersection observer for smooth UX.
- Asset components are loaded only inside the viewport for performance.
- Even though the instruction was to use v2 API, I have integrated the v3 API as that was the only one accessible on the API dashboard
- The v3 API did not return the lottie source files, even though the price=free query param was passed to the API as mentioned in the instructions. Hence, I have mocked the API response for lottie search results to complete and submit the assignment covering all the focus areas for assessment.
- The footer was intentionally left out due to time limitation.

---

## Objectives Completed
- [x] Replicated the search page UI as per Figma
- [x] Integrated IconScout API v3 for search and asset details
- [x] Infinite loading for Lottie Animations tab
- [x] Two search pages: Lottie player and Dotlottie player
- [x] SSR enabled for SEO and performance. The page is [listed in the first page](files/google-results.png) for the search query "iconscout illustrations avatar".
- [x] Header included
- [x] Responsive and accessible design

## Improvements
- [ ] Add more comprehensive unit tests
- [ ] Enhance error handling
- [ ] Add user authentication for personalized features
- [ ] Add more filter options and advanced search

### **Brief Comparison: `lottie-player` vs `dotlottie-wc`**

| Criteria              | `lottie-player`                         | `dotlottie-wc`                              |
| ------------------    | --------------------------------------- | -------------------------------------       |
| **Format Support**    | `.json` only                            | `.lottie` (compressed, binary) and `.json`  |
| **Bundle Size**       | \~95.6kB + large `.json` files          | \~59.5kB + small `.lottie` files            |
| **Performance**       | Slower loading, heavier network payload | Faster loading, optimized for web           |
| **Ideal Use**         | Simple pages or prototypes              | Infinite scroll, production-heavy UIs       |
| **Real life example** | [video](files/lottie-files.mov)        | [video](files/dotlottie-wc.mov)            |

---

### **Conclusion: Best Choice for Search Page with Infinite Loading**

**✅ `dotlottie-wc` is the best choice** for building a performant search page with infinite loading results.

#### **Why?**

* It loads **smaller `.lottie` files**, reducing network and memory usage. It makes a big difference for slow networks and mobile devices.
* Its smaller web component footprint makes it scalable for **hundreds of animations** on the same page.
* Built for performance-sensitive, interactive applications like **search galleries** or **asset libraries**.

---

## References
- [Nuxt 3 Documentation](https://nuxt.com/docs/getting-started/introduction)
- [IconScout API](https://iconscout.com/api)
- [Lottie Player](https://github.com/lottiefiles/lottie-player)
- [@lottiefiles/dotlottie-wc](https://www.npmjs.com/package/@lottiefiles/dotlottie-wc)
- [@lottiefiles/lottie-player](https://www.npmjs.com/package/@lottiefiles/lottie-player)

---

_This project was completed as part of the IconScout Sr. Front-End Developer assessment._
