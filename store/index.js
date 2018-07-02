import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Cookie from 'js-cookie'

Vue.use(Vuex)

// Polyfill for `window.fetch()`
const store = () => new Vuex.Store({
  state: {
		isAuth: false,
    user: null,
		sid: null,
  },

  mutations: {
		set_cookie(state, sid) {
			state.sid = sid
		},
		
    set_user(state, user) {
      state.user = user
    },

		set_auth(state, isAuth) {
			state.isAuth = isAuth
		}
  },

  actions: {
    nuxtServerInit ({ commit }, { req }) {
			// This runs in the server, so can't use Cookie.get
			// coz that asks the client cookie in the browser
			if (req.headers.cookie) {
				let sid = req.headers.cookie.split(';')
						.find(a => a.trim().startsWith('connect.sid'))

				// console.log('found this:', sid)
				// Actually, I think there is no need to store the cookie :P
				if (sid)
					commit('set_cookie', sid.split('=')[1])

				if (req.session && req.session.isAuth === true)
					commit('set_auth', req.session.isAuth)
			}
		},

		async login ({commit}, {username, password}) {

			let response = await axios.post('/auth/login',{
				username,
				password
			})

			if (response.data.status == 'ne')
				return Promise.reject(response.data.msg)

			// aca hay un error, el axios no chapa la cookie que le retorna, pero
			// uno no se da cuenta por el nuxtserverinit
			console.log('response', response.headers)
			
			commit('set_cookie', Cookie.get('connect.sid'))
			commit('set_auth', true)
		}
  }

})

export default store
