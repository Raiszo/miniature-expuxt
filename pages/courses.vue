<template>
<div class="container">
  <h1>Courses</h1>
  <ul>
    <li v-for="(course, index) in courses" :key="index">
			<p>{{ course.name }}</p>
			<p>{{ course.desc }}</p>
    </li>
    </ul>
    <p><nuxt-link to="/">Back to home page</nuxt-link></p>
  </div>
</template>

<script>
import axios from '~/plugins/axios'

export default {
	data() {
		return { courses : [] }
	},
	
  asyncData({ req, params }) {
    // We can return a Promise instead of calling the callback
		return axios.get('/api/toy')
			.then( res => {
				return {courses: res.data}
			})
  },
	
  head: {
    title: 'List of courses'
  }
}
</script>

<style scoped>
.container {
  width: 70%;
  margin: auto;
  text-align: center;
  padding-top: 100px;
}
ul {
  list-style-type: none;
  padding: 0;
}
ul li {
  border: 1px #ddd solid;
  padding: 20px;
  text-align: left;
}
ul li a {
  color: gray;
}
p {
  font-size: 20px;
}
a {
  color: #41B883;
}
</style>
