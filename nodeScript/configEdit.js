const fs = require("fs");
const path = require("path");
var rootPath;
var fillArr = []; //配置列表


fs.readFile('./data/config.json', 'utf8', (err, data) => {
	if (err !== null) {} else {
		let config = JSON.parse(data.toString());
		rootPath = config.omega_storage + "\\配置";
	};
	readDirSync(rootPath);
});

// 遍历文件,加入数组
function readDirSync(Path) {
	let pa = fs.readdirSync(Path);
	pa.forEach(function(ele, index) {
		let info = fs.statSync(Path + "\\" + ele)
		if (info.isDirectory()) {
			readDirSync(Path + "\\" + ele);
		} else {
			let key = path.join(Path, ele)
			fs.readFile(key, 'utf8', (err, data) => {
				let a = JSON.parse(data);
				let file = path.basename(ele, '.json');
				let ban = a.是否禁用;
				let src = Path +'\\'+ ele;
				fillArr.push({
					name: file,
					pathSrc: src,
					verboten: ban
				})
			});
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
			tableData: [],
			search: ''
		}
	},
	methods: {
		openErr(msg) {
			this.$message({
				message: msg,
				type: 'warning'
			})
		},
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
										pathSrc: fillArr[i].pathSrc,
										verboten: fillArr[i].verboten
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
		},
		// 搜索筛选
		searchConfig() {
			let data = [];
			let val = this.search;
			for (var i = 0; i < fillArr.length; i++) {
				if (fillArr[i].name.indexOf(val) > -1) {
					data.push({
						name: fillArr[i].name,
						pathSrc: fillArr[i].pathSrc,
						verboten: fillArr[i].verboten
					});
				}
			}
			this.tableData = data;
		},
		// 清空搜索框
		searchClear() {
			this.search = '';
			this.searchConfig();
		},
		getSwitchVal(a) {
			return true
		},
		// 切换开关状态,修改文件
		scopeSwitch(name, url) {
			// 切换配置状态
			if (name == '主系统') {
				this.openErr('请求被取消：主系统不可以关闭哦！')
				return;
			} else {
				fs.readFile(path.join(url), 'utf8', (err, data) => {
					let a = JSON.parse(data);
					a.是否禁用 = !a.是否禁用;
					let b = JSON.stringify(a,"","	");
					fs.writeFile(path.join(url),b,(err)=>{})
				});
				this.tableData.forEach((index)=>{
					if (index.name == name) {
						index.verboten = !index.verboten
					}
				})
			}
		}
	}
})
