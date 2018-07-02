<template>
<div>
  <form @submit.prevent="submit">
		<input name="username" v-model="username" type="text" placeholder="Username">
		<input name="password" v-model="password" type="password" placeholder="Password">
    <button type="submit">Login</button>
	</form>
</div>
</template>

<script>
export default {
	data() {
		return {
			username: '',
			password: ''
		}
	},

	methods: {
		submit() {
			this.$store.dispatch('login',{
				username: this.username,
				password: this.password
			})
				.then( () => {
					
					console.log('redirecting to secret!')
					this.$router.push('/secret')
				})
				.catch( e => {
					console.log(e)
					// add something so it reloads the form
					this.$router.push('/login')
				});
		}
	}
}
</script>

<style scoped>
.admin-auth-page {
  padding: 20px;
}

.auth-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 2px #ccc;
  width: 300px;
  margin: auto;
  padding: 10px;
  box-sizing: border-box;
}
</style>
