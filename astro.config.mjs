// @ts-check
import { defineConfig } from 'astro/config';

const base = '/Portfolio';

/** Rewrites absolute "/images/..." markdown image paths so they resolve under `base`. */
function rewriteImagePaths() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'image' && typeof node.url === 'string' && node.url.startsWith('/')) {
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
  markdown: {
    remarkPlugins: [rewriteImagePaths],
  },
});
