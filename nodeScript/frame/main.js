const fs = require("fs");
const {shell} = require('electron');

window.onload = () => {
	vue()
	setSocket();
}

var vue = () => new Vue({
	el: '#app',
	data: function() {
		return {
			frame: "frame/home.html",
			infoAlert : false
		}
	},
	methods: {
		// 菜单切换
		menuSelect(key) {
			let switchFrame = this.switchFrame;
			switch (key){
				case "1":
					switchFrame('home','el-icon-house','主页')
					break;
				case "2":
					switchFrame('configEdit','el-icon-edit-outline','组件配置')
					break;
				case "3":
					switchFrame('commController','el-icon-set-up','快捷控制')
					break;
				case "4":
					switchFrame('omgResource','el-icon-document','资源推荐')
					break;
				case "5":
					switchFrame('sideControl','el-icon-s-operation','插件管理')
					break;
				case "6":
					switchFrame('tutorial','el-icon-discover','OMG教程')
					break;
				case "7":
					switchFrame('OmgController','el-icon-cpu','文件管理')
					break;
				case "8":
					switchFrame('config','el-icon-setting','设置')
					break;
				case "9":
					this.infoAlert = true
					break;
			}
		},
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
		},
		// 外部打开url
		openExternal(url){
			shell.openExternal(url)
		}
	}
})
