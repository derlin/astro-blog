# blog.derlin.ch

This repository contains the source of my personal blog, https://blog.derlin.ch.
It is built with Astro and published via GitHub Actions (so no Astro on the server side, pure static site!).

> ![note]
> The blog was migrated from hashnode in April 2026. All the content was imported, and images remapped to be served directly (instead of through the hashnode CDN).

## Design choices

- Astro with custom template, to match loosely the style of hashnode at the time of import.
- Simple, clean UI.
- Home page listing the articles, article pages, nothing else.
- Search feature with a SpotLight style: overlay and search bar showing results as we type. Using pagefind to index at build time.
- Code syntax highlighting with shiki.
- Social preview support: `og:` and `twitter:` in the header of all pages, with the article hero image or a fallback to the default social preview if none is defined.
- Articles starting with a big cover image, then the content, centered.
- "On this page" table of content on all articles, showing on the right of the article if space allows, otherwise can be toggled at the bottom of the page using a fab.


## Pages and slugs

REQUIREMENT:
- Slugs needs to match exactly the ones used previously on hashnode
- The folder structure and the slugs needs to be independent. A post can be written in `src/content/blog/lala` and have the slug `lulu` (defined in the front matter).

Hashnode used the links: `<base-url>/<slug>`. The current Astro build is configured to generate the links `<base-url>/<slug>/` (trailing slash). Github handles the redirect from no slash to trailing slash. This behavior is VERY important to not break SEO!

The build should always output the canonical URL in the HTML as `https://blog.derlin.ch/<slug>/` whatever the configuration (`SITE`, `BASE`). Again, to ensure no issue with SEO. If the site is not served by `https://blog.derlin.ch` (the `SITE` is different), all pages should have a meta to ask robots to not index the page.

## Development

* Install the dependencies: `npm install`
* Run the dev server: `npm run dev`
* Run the preview build: `npm run build && npm run preview`. Search only works in preview!

To really test the setup, better to run a static server. To fake the production build:
```bash
SITE=https://blog.derlin.ch npm run build && python3 -m http.server -d dist
```
To fake the non-production build (e.g. github hosting without custom domain):
```bash
SITE=https://derlin.github.io BASE=/astro-blog npm run build && python3 -m http.server
```
