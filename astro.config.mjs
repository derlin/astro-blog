// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
import rehypeCallouts from "rehype-callouts";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE || "http://localhost:4321",
  base: process.env.BASE || "/",
  integrations: [mdx(), sitemap()],
  trailingSlash: "always",
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      rehypeCallouts,
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "prepend",
          properties: { class: "anchor", ariaHidden: "true", tabIndex: -1 },
          content: { type: "text", value: "#" },
        },
      ],
    ],
    shikiConfig: {
      theme: "github-dark",
    },
  },
  build: {
    format: "directory", // This outputs '<slug>/index.html'
  },
  vite: {
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js"],
      },
    },
  },
});
