// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "DERLIN.";
export const SITE_DESCRIPTION =
  "A blog about tech, and occasionally other things.";

// Distinguish between development and production environments
export const CANONICAL_BASE_URL = "https://blog.derlin.ch/";

// This ensures you get a clean 'https://domain.com/base/' without double slashes
export const FULL_BASE_URL = new URL(
  import.meta.env.BASE_URL,
  import.meta.env.SITE,
).href;
export const IS_LIVE = FULL_BASE_URL.includes(CANONICAL_BASE_URL);
