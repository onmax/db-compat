export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/fonts', '@nuxt/icon', '@vueuse/nuxt', '@nuxt/content', '@nuxtjs/seo'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-01-01',
  app: {
    head: {
      script: [{ type: 'module', src: 'https://console.vitehub.dev/hosted-comments.js', 'data-vitehub-comments': '0673b019-0be3-47d1-857a-3ae83da3aeb6', 'data-vitehub-repo': 'onmax/db-compat' }],
    },
  },
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
