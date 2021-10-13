import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s',
    title: 'Koctel',
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

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  loading: {
    color: '#2176AE',
    height: '1vh',
    rtl: false,
    continuous: true
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/sanity/module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primario: '#9C3B3B',
          secundario: '#FFFFFF',
          links: '#CEB992',
          texto: '#000501',
          background: '#C2C2C2',
          detalles: '#2176AE',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          transparent: 'rgba(0,0,0,0)',
        }
      }
    }
  },
  // Sanity module configuration: https://go.nuxtjs.dev/config-sanity
  sanity: {
    projectId: 's25qt0j9',
    dataset: 'production',
    useCdn: false,
    token: 'skGixis99l1hlaib5goQrVR7h2n61F2CJU12bZxyyBUvczzlDlHZM5gWUVyFdbQnlfTSUBuEkV6B54tPHtQL61ipQMk4694KUbaGzuulRc6sVWbhL5yRb5mV6HKD0FsiuIp8o3GSUdF0AbBVv4jL8OGZlflEbpRVnTXzQBsDWghfJwxoCukV'
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
