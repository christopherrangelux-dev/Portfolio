// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const base = '/Portfolio';

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

// https://astro.build/config
export default defineConfig({
  site: 'https://christopherrangelux-dev.github.io',
  base,
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [rewriteInternalPaths],
  },
});
