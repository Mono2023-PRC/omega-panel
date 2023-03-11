const require = parent.window.require;
const fs = require('fs');

onload = () => {
	let thisVue = vue();
	fs.readFile('./data/config.json', (err, data) => {
		if (err !== null) {} else {
			let config = JSON.parse(data.toString());
			thisVue.$data.inputOmegaStorage = config.omega_storage;
			thisVue.$data.inputSidePath = config.omega_side;
			
		}; 
	});
}

var vue = () => new Vue({
	el: '#app',
	data: function() {
		return {
			inputOmegaStorage: '',
			inputSidePath: ''
		}
	},
	methods: {
		// 保存路径
		saveStorage() {
			let pathEnd = this.inputOmegaStorage.substring((this.inputOmegaStorage.length - 13));
			let result;
			if (pathEnd == "omega_storage") {
				(async () => {
					await new Promise((val) => {
						fs.stat(this.inputOmegaStorage, (err, data) => {
							if (err) {
								this.openErr("路径不存在omega_storage文件夹")
							} else {
								if (data.isDirectory()) {
									result = true;
								} else {
									this.openErr("路径不存在omega_storage文件夹")
								}
							}
							val();
						});
					});
					if (result) {
						fs.readFile('./data/config.json', (err, data) => {
							if (err != null) {
								this.openErr("配置文件被删除！请重启软件");
							} else {
								let firstSave = true;
								let config = JSON.parse(data.toString());
								if (config.omega_storage != undefined) {
									firstSave = false;
								}
								config.config = true;
								config.omega_storage = this.inputOmegaStorage;
								fs.writeFile("data/config.json", JSON.stringify(config, "",
									"	"), (err, data) => {
									if (err != null) {
										this.openErr("未知错误：初始化设置失败！");
									}
								});
								if (firstSave) {
									window.location = "../main.html"
								} else {
									this.openOk("保存成功");
								}
							};
						});
					};
				})();

			} else {
				this.openErr("路径未包含omega_storage")
			}
		},
		// 保存side地址
		saveSide(){
			let path = this.inputSidePath;
			if (path == "") {
				this.openErr("地址不能为空");
			} else{
				fs.readFile('./data/config.json', (err, data) => {
					if (err != null) {
						this.openErr("配置文件被删除！请重启软件");
					} else {
						let firstSave = true;
						let config = JSON.parse(data.toString());
						if (config.omega_storage != undefined) {
							firstSave = false;
						}
						config.omega_side = path;
						fs.writeFile("data/config.json", JSON.stringify(config, "",
							"	"), (err, data) => {
							if (err != null) {
								this.openErr("未知错误：初始化设置失败！");
							}else{
								this.openOk("保存成功");
								parent.socketClose();
							}
						});
					};
				});
			};
		},
		// 提示弹窗
		openErr(msg) {
			this.$message({
				message: msg,
				type: 'warning'
			})
		},
		// 成功弹窗
		openOk(msg) {
			this.$message({
				message: msg,
				type: 'success'
			});
		}
	}
})
