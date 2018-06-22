<template>
	<div>
		login
	</div>
</template>

<style>
.about {
		margin: 5rem 10rem;
}
h1 {
		text-align: center
}
</style>

<script>
export default {
  // we use fetch() because we do not need to set data to this component
  fetch ({ store, redirect }) {
    if (!store.state.authUser) {
      return redirect('/')
    }
  }
}
</script>
