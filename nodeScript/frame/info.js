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
		openExternal(url){
			shell.openExternal(url)
		}
	}
})
