// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

/**
 * Rehype plugin implementing Hugo-like attribute syntax: {.class #id key="value"}
 *
 * Supported locations:
 * - After any inline element in a paragraph: ![](img.png){.small} or **bold**{.highlight}
 * - At the end of a heading: ## Title {.special}
 *
 * For images (bare or linked), attributes are applied to the <img> element.
 * For everything else, attributes are applied to the element itself.
 *
 * remark-attr cannot be used because Astro's image pipeline transforms image
 * nodes before remark plugins run, leaving {.class} as orphaned text.
 */
function rehypeMarkdownAttr() {
	// Parse {.class #id key=value key="value"} into properties
	function parseAttrs(str) {
		const classes = [];
		const props = {};
		for (const m of str.matchAll(/\.[-\w]+|#[-\w]+|[-\w]+=(?:"[^"]*"|'[^']*'|[-\w]+)/g)) {
			const token = m[0];
			if (token.startsWith('.')) classes.push(token.slice(1));
			else if (token.startsWith('#')) props.id = token.slice(1);
			else {
				const eq = token.indexOf('=');
				props[token.slice(0, eq)] = token.slice(eq + 1).replace(/^["']|["']$/g, '');
			}
		}
		return { classes, props };
	}

	function applyTo(el, classes, props) {
		el.properties ??= {};
		if (classes.length) el.properties.className = [...(el.properties.className ?? []), ...classes];
		Object.assign(el.properties, props);
	}

	// Find the <img> within a node (handles bare images and linked images <a><img></a>)
	function findImg(node) {
		if (node.tagName === 'img') return node;
		for (const c of node.children ?? []) { const f = findImg(c); if (f) return f; }
		return null;
	}

	// In a paragraph, find {attrs} text nodes and apply to the nearest preceding element
	function processParagraph(p) {
		for (let i = 0; i < p.children.length; i++) {
			const child = p.children[i];
			if (child.type !== 'text') continue;

			const match = child.value.match(/\{([^}]+)\}/);
			if (!match) continue;

			const { classes, props } = parseAttrs(match[1]);
			if (!classes.length && !Object.keys(props).length) continue;

			for (let j = i - 1; j >= 0; j--) {
				const el = p.children[j];
				if (el.type === 'element') {
					applyTo(findImg(el) ?? el, classes, props);
					break;
				}
			}

			child.value = child.value.replace(match[0], '').trim();
			if (!child.value) { p.children.splice(i, 1); i--; }
		}
	}

	// In a heading, find {attrs} text at the end and apply to the heading element itself
	function processHeading(h) {
		const last = h.children?.at(-1);
		if (last?.type !== 'text') return;

		const match = last.value.match(/\s*\{([^}]+)\}$/);
		if (!match) return;

		const { classes, props } = parseAttrs(match[1]);
		if (!classes.length && !Object.keys(props).length) return;

		applyTo(h, classes, props);
		last.value = last.value.slice(0, -match[0].length);
	}

	function walk(node) {
		if (node.type === 'element') {
			if (node.tagName === 'p') processParagraph(node);
			else if (/^h[1-6]$/.test(node.tagName)) processHeading(node);
		}
		for (const child of node.children ?? []) walk(child);
	}

	return (tree) => walk(tree);
}

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.derlin.ch',
	integrations: [mdx(), sitemap()],
	markdown: {
		rehypePlugins: [
			rehypeSlug,
			rehypeMarkdownAttr,
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
