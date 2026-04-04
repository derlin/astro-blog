// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeCallouts from 'rehype-callouts';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.derlin.ch',
	integrations: [mdx(), sitemap()],
	trailingSlash: "never",
	markdown: {
		rehypePlugins: [
			rehypeSlug,
			rehypeCallouts,
			[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
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
	build: {
		format: 'file' // This outputs 'about.html' instead of 'about/index.html'
	},
	vite: {
		build: {
			rollupOptions: {
				external: ['/pagefind/pagefind.js'],
			},
		},
	},
});
