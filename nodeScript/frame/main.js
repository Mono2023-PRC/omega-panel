const fs = require("fs");

window.onload = () => {
	vue()
	setSocket();
	
}

var vue = () => new Vue({
	el: '#app',
	data: function() {
		return {
			frame: "frame/home.html"
		}
	},
	methods: {
		switchFrame(frame, ico, name) {
			switch (name) {
				// case '组件配置': 
				// 	console.log("组件配置");
				default:
					this.frame = "frame/" + frame + ".html";
					document.getElementById("title_ico").className = ico;
					document.getElementById("title_name").innerText = name;
					break;
			}
		}
	}
})
