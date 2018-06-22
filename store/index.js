import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

// Polyfill for `window.fetch()`
const store = () => new Vuex.Store({
  state: {
    user: null
  },

  mutations: {
    SET_USER: function (state, user) {
      state.user = user
    }
  },

  actions: {
    nuxtServerInit ({ commit }, { req }) {
			if (req.session && req.session.user) {
				commit('SET_USER', req.session.user)
			}
		},

		async login ({ commit }) {

			let res = await axios.get('/auth/login')

			if (res.status === 401) {
				return Promise.reject('Bad credentials')
			}
			console.log(res.body)
			commit('SET_USER', res.body)

			// return fetch('/api/login', {
			// 	// Send the client cookies to the server
			// 	credentials: 'same-origin',
			// 	method: 'POST',
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	},
			// 	body: JSON.stringify({
			// 		username,
			// 		password
			// 	})
			// })
			// 	.then((res) => {
			// 		if (res.status === 401) {
			// 			throw new Error('Bad credentials')
			// 		} else {
			// 			return res.json()
			// 		}
			// 	})
			// 	.then((authUser) => {
			// 		commit('SET_USER', authUser)
			// 	})
		}
  }

})

export default store
