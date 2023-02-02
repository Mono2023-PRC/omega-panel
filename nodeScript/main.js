window.onload = () => {
	vue()
}

var vue = () => new Vue({
	el: '#app',
	data: function() {
		return {
			
		}
	},
	methods: {
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		}
	}
})


	