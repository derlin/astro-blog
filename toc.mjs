#!/usr/bin/env node
// Usage: node toc.mjs <file.md>
// Prints a markdown TOC with the same slugs as rehype-slug (github-slugger).

import { readFileSync } from "fs";
import GithubSlugger from "github-slugger";
import { parseEntities } from "parse-entities";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node toc.mjs <file.md>");
  process.exit(1);
}

const content = readFileSync(file, "utf8");
const slugger = new GithubSlugger();

// Skip YAML frontmatter and fenced code blocks
const body = content
  .replace(/^---[\s\S]*?---\n/, "")
  .replace(/^```[\s\S]*?^```/gm, "")
  .replace(/^~~~[\s\S]*?^~~~/gm, "");

const headingRe = /^(#{1,6})\s+(.+)$/gm;
const entries = [];
let match;

function toPlainText(md) {
  const result = md
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images: keep alt
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links: keep text
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1") // bold/italic
    .replace(/<[^>]+>/g, "") // html tags
    .trim();
  return parseEntities(result); // decode &lt; &gt; &amp; etc.
}

while ((match = headingRe.exec(body)) !== null) {
  const depth = match[1].length;
  const text = toPlainText(match[2]);
  const slug = slugger.slug(text);
  entries.push({ depth, text, slug });
}

if (!entries.length) {
  console.log("No headings found.");
  process.exit(0);
}

const minDepth = Math.min(...entries.map((e) => e.depth));

for (const { depth, text, slug } of entries) {
  const indent = "  ".repeat(depth - minDepth);
  console.log(`${indent}- [${text}](#${slug})`);
}
