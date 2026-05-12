// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.scss'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'pt-br'
      },
      title: 'StabArts | Loja de Arte e Artesanato Online',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/assets/img/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@400;600;700&family=Aclonica&display=swap' }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Loja de Arte e Artesanato Online - Quadros, Materiais, Esculturas e mais.' }
      ]
    }
  }
})
