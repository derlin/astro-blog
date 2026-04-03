// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkAttr from 'remark-attr';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.derlin.ch',
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkAttr],
		rehypePlugins: [
			rehypeSlug,
			[rehypeAutolinkHeadings, {
				behavior: 'prepend',
				properties: { class: 'anchor', ariaHidden: 'true', tabIndex: -1 },
				content: { type: 'text', value: '#' },
			}],
		],
		shikiConfig: {
			theme: 'github-dark-dimmed',
		},
	},
	vite: {
		build: {
			rollupOptions: {
				external: ['/pagefind/pagefind.js'],
			},
		},
	},
});
