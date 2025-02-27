// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/scss/main.scss'],

  runtimeConfig: {
    public: {
      apiBase: 'https://parkdemeer-afde952e3fef.herokuapp.com/v1'
    }
  },

  devServer: {
    port: 8000,
  },

  app: {
    head: {
      title: 'ParkingBusiness',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})