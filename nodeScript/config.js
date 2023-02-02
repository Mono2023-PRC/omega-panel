const fs = require('fs');

onload = () => {
	vue();

}

var vue = () => new Vue({
	el: '#app',
	data: function() {
		return {
			input: ''
		}
	},
	methods: {
		// 保存路径
		save() {
			let pathEnd = this.input.substring((this.input.length - 13));
			let result;
			if (pathEnd == "omega_storage") {
				(async () => {
					await new Promise((val) => {
						fs.stat(this.input, (err, data) => {
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
							console.log(err);
							if (err !== null) {
								this.openErr("配置文件被删除！请重启软件");
							} else {
								let config = JSON.parse(data.toString());
								config.config = true;
								config.omega_storage = this.input;
								fs.writeFile("data/config.json", JSON.stringify(config, "","	"), (err, data) => {
									if (err != null) {
										this.openErr("未知错误：初始化设置失败！");
									}
								});
								window.location = "main.html"
							};
						});
					};
				})();

			} else {
				this.openErr("路径未包含omega_storage")
			}
		},
		// 提示弹窗
		openErr(msg) {
			this.$message({
				message: msg,
				type: 'warning'
			})
		}
	}
})
