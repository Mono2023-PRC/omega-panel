const require = parent.window.require;
const fs = require("fs");
const path = require("path");
var rootPath;
var fillArr = []; //配置列表

//编辑器配置
let options1 = {
	"mode": "code"
};
let options2 = {};
var editor1; //文编辑器
var editor2; //设置编辑器

// 读取配置
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
				let src = Path + '\\' + ele;
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
			tableData: [], //文件列表
			search: '', //搜索框
			// 弹出窗口
			jsonEdit1: {
				elframe: false, //编辑器窗口
				title: '', //编辑器标题
				src: '', //文件路径
				json: {} //Json文本
			},
			jsonEdit2: {
				elframe: false,
				title: '',
				src: '',
				json: {}
			}
		}
	},
	methods: {
		// 提示
		openErr(msg) {
			this.$message({
				message: msg,
				type: 'warning'
			})
		},
		openOk(msg) {
			this.$message({
				message: msg,
				type: 'success'
			});
		},
		openError(msg) {
		        this.$message.error(msg);
		},
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
					let b = JSON.stringify(a, "", "	");
					fs.writeFile(path.join(url), b, (err) => {})
				});
				this.tableData.forEach((index) => {
					if (index.name == name) {
						index.verboten = !index.verboten
					}
				})
			}
		},
		// 编辑器
		configEdit1(src, name) {
			this.jsonEdit1.title = name;
			this.jsonEdit1.src = src;
			let json;
			(async () => {
				await new Promise(function(ok) {
					fs.readFile(src, 'utf8', (err, data) => {
						json = data;
						ok();
					})
				})
				this.jsonEdit1.json = JSON.parse(json);
				this.jsonEdit1.elframe = true;
				setTimeout(() => {
					this.editFrame1(JSON.parse(json));
				}, 50)
			})();
		},
		configEdit2(src, name) {
			this.jsonEdit2.title = name;
			this.jsonEdit2.src = src;
			let json;
			(async () => {
				await new Promise(function(ok) {
					fs.readFile(src, 'utf8', (err, data) => {
						json = data;
						ok();
					})
				})
				this.jsonEdit2.json = JSON.parse(json);
				this.jsonEdit2.elframe = true;
				setTimeout(() => {
					this.editFrame2(JSON.parse(json));
				}, 50)
			})();
		},
		editFrame1(json) {
			let container = document.getElementById("jsoneditor1");
			editor1 = new JSONEditor(container, options1)
			editor1.set(json)
		},
		editFrame2(json) {
			let container = document.getElementById("jsoneditor2");
			editor2 = new JSONEditor(container, options2)
			editor2.set(json)
		},
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {});
		},
		configSave(val) {
			try{
				if (val == 1) {
					let src = this.jsonEdit1.src;
					let str = JSON.stringify(editor1.get(), '', '	');
					fs.writeFile(src, str, (err) => {
						this.openOk('保存成功');
					});
				} else if (val == 2) {
					let src = this.jsonEdit2.src;
					let str = JSON.stringify(editor2.get(), '', '	');
					fs.writeFile(src, str, (err) => {
						this.openOk('保存成功');
					});
				}
			}catch(e){
				this.openErr('json存在语法错误，保存被');
				setTimeout(()=>{
					this.openError(e);
				},10)
			}
			
		}
		// 编辑器END
	}
})
