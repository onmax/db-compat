export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/fonts', '@nuxt/icon', '@vueuse/nuxt', '@nuxt/content', '@nuxtjs/seo'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-01-01',
  icon: { serverBundle: 'remote' },
  routeRules: { '/**': { prerender: true } },
  fonts: {
    families: [
      { name: 'Geist', provider: 'google' },
      { name: 'Geist Mono', provider: 'google' },
    ],
  },
  site: {
    url: 'https://db-compat.onmax.me',
    name: 'db-compat',
    description: 'Compare SQL and API capabilities across SQLite, PostgreSQL, and MySQL',
  },
  ogImage: { enabled: true },
})
