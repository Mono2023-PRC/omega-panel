const require = parent.window.require;
const fs = require("fs");
const path = require("path");
var rootPath;
var fillArr = []; //文件列表

// 读取配置
fs.readFile('./data/config.json', 'utf8', (err, data) => {
	if (err !== null) {} else {
		let config = JSON.parse(data.toString());
		rootPath = config.omega_storage + "\\data";
	};
	readDirSync(rootPath);
});


// 遍历文件,加入数组
function readDirSync(Path) {
	let pa = fs.readdirSync(Path);
	pa.forEach(function(ele, index) {
		let info = fs.statSync(Path + "\\" + ele)
		if (info.isDirectory()) {
			// 回调遍历
			readDirSync(Path + "\\" + ele);
		} else {
			fillArr.push({
				name: ele,
				pathSrc: Path + ele
			})
		}
	})
}

onload = () => {
	let thisVue = vue();
	thisVue.loadConfig();
}

var vue = () => new Vue({
	el: '#app',
	data: function() {
		return {
			tableData: [] //文件列表
		}
	},
	methods: {
		// 加载配置
		loadConfig() {
			let fillArrIsUndefined = true;
			(async () => {
				let timeOut = 0;
				// 循环等待数据
				while (fillArrIsUndefined) {
					await new Promise((ok) => {
						setTimeout(() => {
							// 等待到来自fillArr的数据
							if (fillArr.length > 0) {
								for (var i = 0; i < fillArr.length; i++) {
									this.tableData.push({
										name: fillArr[i].name,
										pathSrc: fillArr[i].pathSrc
									});
								}
								fillArrIsUndefined = false;
							}
							timeOut++;
							ok();
						}, 10)
					})
					// 超时
					if (timeOut > 1000) {
						fillArrIsUndefined = false;
						alert("获取文件超时！请检查omege是否正确运行");
					}
				}
			})();
		}
	}
})
