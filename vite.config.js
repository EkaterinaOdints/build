import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  root: "./src",
  base: "./",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
  css: {
    devSourcemap: true,
  },
  plugins: [
    ViteImageOptimizer({
      test: /\.(jpe?g|png)$/i,
      includePublic: false,
      logStats: true,
      ansiColors: true,
      png: {
        quality: 80,
        palette: true,
      },
      jpeg: {
        quality: 80,
        progressive: true,
      },
      jpg: {
        quality: 80,
        progressive: true,
      },
      svg: {
        multipass: true,
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                removeViewBox: false,
                cleanupIds: false,
              },
            },
          },
          "removeDimensions",
        ],
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: "fonts/**/*",
          dest: "assets/fonts",
        },
      ],
    }),
  ],
});
