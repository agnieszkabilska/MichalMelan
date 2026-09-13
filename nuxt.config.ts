// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/sanity'],

  // Dataset jest publiczny (tylko odczyt), wiec identyfikatory moga byc w kodzie.
  // Nadpisanie: NUXT_PUBLIC_SANITY_PROJECT_ID / NUXT_PUBLIC_SANITY_DATASET.
  sanity: {
    projectId: 'tbckptwx',
    dataset: 'production',
    apiVersion: '2026-09-01',
    useCdn: true
  },

  routeRules: {
    // Sanity Studio to aplikacja React renderowana wylacznie w przegladarce.
    '/studio/**': { ssr: false }
  },

  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom', 'styled-components']
    }
  }
})
