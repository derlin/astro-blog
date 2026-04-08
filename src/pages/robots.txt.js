import { IS_LIVE, CANONICAL_BASE_URL } from "../constants";

export function GET({ params, request }) {
  if (IS_LIVE) {
    const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${CANONICAL_BASE_URL}sitemap-index.xml
`;
    return new Response(robotsTxt, {
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new Response("User-agent: *\nDisallow: /", {
    headers: { "Content-Type": "text/plain" },
  });
}
