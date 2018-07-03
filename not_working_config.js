module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'nuxt-example',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#bbaadd' },
  /*
  ** Build configuration
  */

  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
	
	link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: 'favicon.ico',
    },
  ],
	
	router: {
		middleware: ['ssr-cookie']
	},

	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/auth'
	],

	axios: {
		browserBaseURL: '/'
	},
	
	auth: {
		strategies: {
			local: {
				endpoints: {
					login: {url: '/auth/login', method: 'post', propertyName: false},
					logout: {url: '/auth/logout', method: 'get'},
					user: false
				}
			}
		},

		redirect: {
			login: '/login',
			logout: '/',
			home: '/secret',
			callback: false
		}
	}
}
