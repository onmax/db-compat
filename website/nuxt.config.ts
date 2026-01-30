export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/fonts', '@nuxt/icon', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-01-01',
  fonts: {
    families: [
      { name: 'Geist', provider: 'google' },
      { name: 'Geist Mono', provider: 'google' },
    ],
  },
  app: {
    head: {
      title: 'db-compat',
      meta: [{ name: 'description', content: 'Database compatibility for db0' }],
    },
  },
})
