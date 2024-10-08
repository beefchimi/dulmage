import {defineConfig} from 'astro/config';
import icon from 'astro-icon';
import AstroPWA from '@vite-pwa/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://dulmage.me',
  devToolbar: {
    enabled: false,
  },
  server: {
    port: 3000,
    // host: '192.168.2.27',
  },
  vite: {
    // TODO: Figure out how to get this to work.
    preview: {
      port: 8000,
      strictPort: true,
    },
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        drafts: {
          customMedia: true,
        },
      },
    },
  },
  integrations: [
    icon({
      iconDir: 'src/assets/svg',
    }),
    AstroPWA({
      workbox: {
        // Not sure how this differs from `includeAssets`...
        globPatterns: ['**/*.{css,js,html,woff2}', 'assets/*.{png,webp}'],
        // Not sure if we actually want to specify this fallback.
        navigateFallback: '/',
        // The `chicken` image is 2.2MB, so we increase the limit to 3MB.
        maximumFileSizeToCacheInBytes: 3000000,
      },

      // Specify which public assets (in addition to the default html/css/js)
      // we want to include in our pre-cache.
      // includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],

      manifest: {
        name: 'Curtis Dulmage',
        short_name: 'dulmage.me',
        description:
          'UX Developer / Creative Developer / Frontend Developer / Web Developer',
        theme_color: '#8c54c1',
        background_color: '#8c54c1',
        // Favicon entries are added automatically by `pwa-assets-generator`.
        // icons: [],

        // Do we need to customize these properties?
        // dir: 'auto',
        // orientation: 'portrait',
        // start_url: 'index.html?utm_source=homescreen',
      },

      // Eventually, we can replace `pwa-assets.config.ts` with this:
      pwaAssets: {config: true},

      // Allows local development... but its preferrable to test the
      // Service Worker against the `preview` command.
      // devOptions: {enabled: true, type: 'module'},

      // If ever we need to remove the service worker, keep all
      // previous settings as-is, and enable the following:
      // selfDestroying: true,
      // disabled: import.meta.env.DEV,
    }),
  ],
});
