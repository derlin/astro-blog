// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "DERLIN.";
export const SITE_DESCRIPTION =
  "A blog about code, dev tools, and occasionally other things.";


// This ensures you get a clean 'https://domain.com/base/' without double slashes
export const FULL_BASE_URL = new URL(import.meta.env.BASE_URL, import.meta.env.SITE).href;
