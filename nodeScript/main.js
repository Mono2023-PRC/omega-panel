window.onload = () => {
	vue()

}

var vue = () => new Vue({
	el: '#app',
	data: function() {
		return {
			frame : "frame/home.html"
		}
	},
	methods: {
		switchFrame(frame,ico,name){
			this.frame ="frame/"+frame+".html";
			document.getElementById("title_ico").className = ico;
			document.getElementById("title_name").innerText = name;
		}
	}
})


	