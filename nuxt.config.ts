// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/sanity', 'nuxt-og-image', '@nuxtjs/sitemap', '@nuxtjs/robots'],

  // Adres produkcyjny - uzywany do canonical, og:url, sitemapy i og:image.
  // Nadpisanie (np. na podgladach Vercel): NUXT_SITE_URL.
  site: {
    url: 'https://www.melan.pl',
    name: 'Michał Melan',
    defaultLocale: 'pl'
  },

  app: {
    head: {
      meta: [{ name: 'theme-color', content: '#ececea' }],
      link: [{ rel: 'preconnect', href: 'https://cdn.sanity.io' }]
    }
  },

  // Dataset jest publiczny (tylko odczyt), wiec identyfikatory moga byc w kodzie.
  // Nadpisanie: NUXT_PUBLIC_SANITY_PROJECT_ID / NUXT_PUBLIC_SANITY_DATASET.
  sanity: {
    projectId: 'tbckptwx',
    dataset: 'production',
    apiVersion: '2026-09-01',
    useCdn: true
  },

  // @font-face z tego pliku sa parsowane przez nuxt-og-image (Inter z polskimi znakami dla satori)
  css: ['~/assets/css/og-fonts.css'],

  ogImage: {
    defaults: { width: 1200, height: 630 },
    fontSubsets: ['latin', 'latin-ext']
  },

  sitemap: {
    exclude: ['/studio/**']
  },

  robots: {
    disallow: ['/studio', '/studio/']
  },

  routeRules: {
    // Sanity Studio to aplikacja React renderowana wylacznie w przegladarce, nieindeksowana.
    '/studio/**': { ssr: false, robots: false }
  },

  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom', 'styled-components']
    }
  }
})
