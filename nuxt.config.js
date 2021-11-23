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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: "AIzaSyDsaYcUuUoIC4QWYZKr-g8xWzDwZ5lHGgM",
          authDomain: "koctel-2021.firebaseapp.com",
          projectId: "koctel-2021",
          storageBucket: "koctel-2021.appspot.com",
          messagingSenderId: "627115628793",
          appId: "1:627115628793:web:a3fa09cf6b467000876a28"
        },
        services: {
          auth: true,
          firestore: true
        }
      }
    ]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    },
    icon: 'assets/logo.png'
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primario: '#FD3737', // Rojo
          secundario: '#16B396', // Azul Marino
          alt: '#0B1828', // Azul Oscuro
          texto: '#EBFFFF', // Blanco

          background: '#FFFFFF',
          detalles: '#FFFFFF',
          links: '#FFFFFF',

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
