const serverUrl = import.meta.env.NUXT_SERVER_URL;
const isDev = import.meta.env.NODE_ENV === 'development';

export default defineNuxtConfig(async () => {
  return {
    routeRules: {
      '/**': { isr: !isDev },
      '/__nuxt_error': { isr: !isDev },
    },

    devtools: { enabled: isDev },

    components: [
      '@/components',
      { path: '@/components/common', prefix: 'C' },
      { path: '@/components/cards', prefix: 'Card' },
      { path: '@/components/ui', prefix: 'Ui' },
      { path: '@/components/layout', prefix: 'L' },
      { path: '@/components/animation', prefix: 'A' },
    ],

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    runtimeConfig: {
      strapi: {
        url: import.meta.env.NUXT_SERVER_URL,
      },
      sitemapGenerateHash: import.meta.env.NUXT_SITEMAP_GENERATE_HASH,
      serverUrl,
      public: {
        isDev,
        strapi: {
          url: import.meta.env.NUXT_CLIENT_URL,
        },
        clientUrl: import.meta.env.NUXT_CLIENT_URL,
        serverUrl: import.meta.env.NUXT_SERVER_URL,
        siteUrl: import.meta.env.NUXT_SITE_URL,
      },
    },

    router: {
      options: {
        scrollBehaviorType: 'smooth',
      },
    },

    build: {
      transpile: ['vee-validate', 'vue-collapsed'],
    },

    experimental: {
      inlineSSRStyles: false,
      payloadExtraction: true,
      renderJsonPayloads: true,
      splitPageChunks: false,
      asyncContext: true,
      appManifest: false,
    },

    nitro: {
      experimental: {
        tasks: true,
        asyncContext: true,
      },

      storage: {
        cache: {
          driver: 'lru-cache',
          max: 500,
          maxSize: 50 * 1024 * 1024,
          ttl: 600000,
        },
        sitemap: {
          driver: 'memory',
        },
      },
      minify: true,
      compressPublicAssets: {
        gzip: true,
        brotli: true,
        threshold: 1024,
      },
      prerender: {
        concurrency: 2,
        interval: 1000,
        crawlLinks: false,
      },
      routeRules: {
        '/uploads/**': { proxy: `${serverUrl}/uploads/**` },
        '/**': { trailingSlash: false },
        '/**/*.css': {
          headers: {
            'Content-Type': 'text/css; charset=utf-8',
            'X-Content-Type-Options': 'nosniff',
            'cache-control': `public,max-age=2592000,s-maxage=31536000`,
          },
        },
        '/**/*.png': {
          headers: {
            'Content-Type': 'image/png',
            'cache-control': `public,max-age=2592000,s-maxage=31536000`,
          },
        },
        '/**/*.jpeg': {
          headers: {
            'Content-Type': 'image/jpeg',
            'cache-control': `public,max-age=2592000,s-maxage=31536000`,
          },
        },
        '/**/*.jpg': {
          headers: {
            'Content-Type': 'image/jpeg',
            'cache-control': `public,max-age=2592000,s-maxage=31536000`,
          },
        },
        '/**/*.webp': {
          headers: {
            'Content-Type': 'image/webp',
            'cache-control': `public,max-age=2592000,s-maxage=31536000`,
          },
        },
        '/**/*.svg': {
          headers: {
            'Content-Type': 'image/svg',
            'cache-control': `public,max-age=2592000,s-maxage=31536000`,
          },
        },
        '/**/*.webmanifest': {
          headers: { 'Content-Type': 'application/manifest+json' },
        },
        '/_ipx/**': {
          headers: {
            'cache-control': `public,max-age=31536000,s-maxage=31536000`,
          },
        },
        '/images/**': {
          headers: {
            'cache-control': `public,max-age=31536000,s-maxage=31536000`,
          },
        },
        '/video/**': {
          headers: {
            'cache-control': `public,max-age=31536000,s-maxage=31536000`,
          },
        },
        '/fonts/**': {
          headers: {
            'cache-control': `public,max-age=31536000,s-maxage=31536000`,
          },
        },
        '/_nuxt/**': {
          headers: {
            'cache-control': 'public, immutable, max-age=31536000',
          },
        },
      },
    },

    app: {
      head: {
        layoutTransition: {
          name: 'layout',
          mode: 'out-in',
        },
        viewport:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
        htmlAttrs: { lang: 'uk' },
        link: [],
        script: [],
        meta: [
          {
            property: 'og:type',
            content: 'website',
          },
          {
            property: 'og:locale',
            content: 'uk_UA',
          },
          { charset: 'utf-8' },
          { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
        ],
      },
    },

    css: [
      'overlayscrollbars/overlayscrollbars.css',
      '@fontsource-variable/roboto-condensed',
      '@fontsource/montserrat/600.css',
      '@/assets/styles/base/index.scss',
    ],

    hooks: {
      'build:manifest': (manifest) => {
        const criticalPatterns = [/entry/];
        const updates = {};
        for (const [key, item] of Object.entries(manifest)) {
          const isCritical = criticalPatterns.some(
            (pattern) => pattern.test(key) || pattern.test(item.file || ''),
          );

          updates[key] = {
            ...item,
            dynamicImports: [],
            modulePreload: isCritical ? item.modulePreload : false,
            preload: isCritical ? item.preload : false,
            prefetch: false,
          };
        }
        Object.assign(manifest, updates);
      },

      // 'vite:extendConfig'(config) {
      //   config.build.rollupOptions.output.manualChunks = function (id) {
      //     if (id.includes('/layout')) {
      //       return 'layout';
      //     }
      //   };
      // },
    },

    vite: {
      build: {
        // cssCodeSplit: true,
        // sourcemap: isDev,
        // chunkSizeWarningLimit: 500,
        // assetsInlineLimit: 10240,
        // reportCompressedSize: false,
        minify: 'esbuild',
        target: 'es2020',
        cssMinify: 'esbuild',
        terserOptions: {
          compress: {
            drop_debugger: !isDev,
            hoist_funs: true,
          },
        },
      },
      css: {
        preprocessorOptions: {
          scss: {
            charset: false,
            quietDeps: true,
            silenceDeprecations: ['import', 'global-builtin', 'if-function'],
            additionalData: '@use "@/assets/styles/utils" as *;',
          },
        },
      },
      optimizeDeps: {
        include: [
          'gsap',
          'gsap/ScrollSmoother',
          'gsap/ScrollTrigger',
          'libphonenumber-js/mobile',
          'libphonenumber-js/mobile/examples',
          'maska/vue',
          'mitt',
          'overlayscrollbars',
          'typograf',
          'ultrahtml',
          'ultrahtml/transformers/sanitize',
          'vue-awesome-paginate',
          'vue-collapsed',
          'vue-final-modal',
        ],
      },
    },

    sourcemap: true,

    modules: [
      '@pinia/nuxt',
      '@nuxtjs/robots',
      '@vueuse/nuxt',
      '@vee-validate/nuxt',
      'nuxt-swiper',
      'nuxt-svgo',
      '@nuxtjs/strapi',
      // ...(!isDev ? ['nuxt-capo'] : []),
      // 'nuxt-memwatch',
    ],

    // memwatch: {
    //   graph: true,
    //   graphSetup(setup) {
    //     setup.metrics.malloc = {
    //       aggregator: 'avg',
    //       color: 'cyan',
    //     };
    //   },
    //   graphAddMetric(turtleGraph, stats) {
    //     turtleGraph.metric('my metrics', 'malloc').push(stats.malloced_memory);
    //   },
    // },

    robots: {
      injectMiddleware: true,
    },

    swiper: {
      modules: [],
    },

    strapi: {
      version: 'v5',
      cookie: {},
      cookieName: 'strapi_jwt',
    },

    svgo: {
      defaultImport: 'component',
      explicitImportsOnly: true,
    },

    veeValidate: {
      autoImports: true,
      componentNames: {
        Form: 'VeeForm',
        Field: 'VeeField',
        FieldArray: 'VeeFieldArray',
        ErrorMessage: 'VeeErrorMessage',
      },
    },

    features: { inlineStyles: false },
    compatibilityDate: '2024-07-14',
  };
});
