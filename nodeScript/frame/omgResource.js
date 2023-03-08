const require = parent.window.require;
const {shell} = require('electron');

onload = () => {
	vue();
	
}
var vue = () => new Vue({
	el: '#app',
	data: function() {
		return {
			
		}
	},
	methods:{
		// 外部打开链接
		openExternal(url){
			shell.openExternal(url)
		}
	}
})
