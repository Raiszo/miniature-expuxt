import Vue from 'vue'
import Vuex from 'vuex'
import axios from '~/plugins/axios'
import Cookie from 'js-cookie'

Vue.use(Vuex)

// Polyfill for `window.fetch()`
const store = () => new Vuex.Store({
  state: {
    user: null,
  },

  mutations: {
    set_user(state, user) {
      state.user = user
    },
  },

  actions: {
    nuxtServerInit ({ commit }, { req }) {
			if (req.session && req.session.public_user) {
				commit('set_user', req.session.public_user)
			} else {
				commit('set_user', null)
			}
		},

		async login ({commit}, {username, password}) {

			let response = await axios.post('/auth/login',{
				username,
				password
			})

			if (response.data.status == 'ne')
				return Promise.reject(response.data.msg)

			commit('set_user', response.data)
		},

		async logout({commit}) {
			// Need to tell server we're leaving :P
			let response = await axios.get('/auth/logout')
			console.log(response.data)

			commit('set_user', null)
		}
  }

})

export default store
