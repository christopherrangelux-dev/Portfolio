// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const base = '/';

/** Rewrites absolute "/..." markdown image and link paths so they resolve under `base`. */
function rewriteInternalPaths() {
  return (tree) => {
    function visit(node) {
      if ((node.type === 'image' || node.type === 'link') && typeof node.url === 'string' && node.url.startsWith('/')) {
        node.url = (base + '/' + node.url).replace(/\/{2,}/g, '/');
      }
      if (node.children) node.children.forEach(visit);
    }
    visit(tree);
  };
}

/** Opens external links (live demos, source recipes, etc.) in a new tab; internal "/..." links stay in the same tab. */
function externalLinksInNewTab() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'a' && /^https?:\/\//i.test(node.properties?.href ?? '')) {
        node.properties.target = '_blank';
        node.properties.rel = 'noopener noreferrer';
      }
      if (node.children) node.children.forEach(visit);
    }
    visit(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://chrisrangelux.com',
  base,
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [rewriteInternalPaths],
    rehypePlugins: [externalLinksInNewTab],
  },
});
