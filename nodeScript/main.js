window.onload = () => {
	vue()
}

var vue = () => new Vue({
	el: '#app',
	data: function() {
		return {
			frame : "frame/config.html"
		}
	},
	methods: {
		switchFrame(name){
			this.frame ="frame/"+name+".html"
		}
	}
})


	