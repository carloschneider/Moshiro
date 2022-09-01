export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Moshiro',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  server: {
    host: '127.0.0.1',
    port: 5500
  },
  css: [
  ],
  plugins: [
  ],
  components: true,
  buildModules: [
    '@nuxt/typescript-build',
  ],
  modules: [
    '@chakra-ui/nuxt',
    '@nuxtjs/emotion',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Nuxtjs/auth configuration
  auth: {
  },

  // Storybook configuration
  storybook: {
    port: 4000
  },
  
  build: {
  }
}
