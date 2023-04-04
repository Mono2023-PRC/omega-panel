const require = parent.window.require;
const fs = require("fs");
const path = require("path");
const {
	shell
} = require("electron");
var socketFun = parent;

var rootPath;
var dataPath;
var fillArr = []; //文件列表
var loadSpeed;

// 读取配置
fs.readFile('./data/config.json', 'utf8', (err, data) => {
	if (err !== null) {} else {
		let config = JSON.parse(data.toString());
		rootPath = config.omega_storage;
		dataPath = config.omega_storage + "\\data";
		fs.readFile(rootPath + "\\配置\\统一导入系统\\组件-统一导入系统-1.json", 'utf8', (err, data) => {
			loadSpeed = JSON.parse(data.toString())
				.配置.每秒导入普通方块数目;
		});
	};
	readDirSync(dataPath);
});

// 遍历文件,加入数组
function readDirSync(Path) {
	let pa = fs.readdirSync(Path);
	pa.forEach(function(ele, index) {
		let info = fs.statSync(Path + "\\" + ele)
		if (info.isDirectory()) {
			// 递归遍历
			readDirSync(Path + "\\" + ele);
		} else {
			let len = ele.length;
			let src = Path.substring(Path.indexOf("data")) + "\\" + ele;
			let size = 0;
			fs.stat(Path + "\\" + ele, (err, stats) => {
				size = ((stats.size / 1024).toFixed(2)) + " KB";
				// 判断类型,加入列表
				if (ele.substring(len - 6) == ".schem") {
					fillArr.push({
						name: path.basename(ele, '.schem'),
						src: src,
						size: size,
						type: "schem"
					})
				} else if (ele.substring(len - 10) == ".schematic") {
					fillArr.push({
						name: path.basename(ele, '.schematic'),
						src: src,
						size: size,
						type: "schematic"
					})
				} else if (ele.substring(len - 4) == ".bdx") {
					fillArr.push({
						name: path.basename(ele, '.bdx'),
						src: src,
						size: size,
						type: "bdx"
					})
				}
			});

		}
	})
}

onload = () => {
	let thisVue = vue();
	thisVue.loadConfig();

	// 等待导入速度读取结果
	let time = 0;
	let interval = setInterval(() => {
		if (loadSpeed) {
			thisVue.loadSpeed = loadSpeed;
			clearInterval(interval);
		} else if (time > 100) {
			clearInterval(interval);
		} else {
			time++;
		}
	}, 10);

}

var vue = () => new Vue({
	el: '#app',
	data: function() {
		return {
			tableData: [], //文件列表
			search: '', //搜索框
			loadSpeed: 0, //导入速度
			fileInputWindow: false,
			fileSelect: {
				// 选中导入文件
				name: "",
				src: "",
				type: "",
				x: "",
				y: "",
				z: ""
			}
		}
	},
	methods: {
		// 搜索筛选
		searchConfig() {
			let data = [];
			let val = this.search;
			for (var i = 0; i < fillArr.length; i++) {
				if (fillArr[i].name.indexOf(val) > -1) {
					data.push({
						name: fillArr[i].name,
						src: fillArr[i].src,
						size: fillArr[i].size,
						type: fillArr[i].type
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
		// 文件类型筛选
		stateHandler(value, row, column) {
			const property = column['property'];
			return row[property] === value;
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
										src: fillArr[i].src,
										size: fillArr[i].size,
										type: fillArr[i].type
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
					}
				}
			})();
		},
		// 导入文件按钮
		fileInput(name, src, type) {
			let vue = this;
			vue.fileInputWindow = true;
			vue.fileSelect.name = name;
			vue.fileSelect.src = src;
			vue.fileSelect.type = type;
		},
		// 删除文件
		deleteFile(name, src) {
			let vue = this;
			this.$confirm('此操作将永久删除该文件:【' + name + '】, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let a = src.substring(src.indexOf("\\") + 1);
				let file = dataPath + "\\" + a;
				fs.unlinkSync(file); //删除文件
				location = ""
			});
		},
		// 使用系统资源管理器打开文件夹
		openDir() {
			shell.openPath(dataPath)
		},
		// FastBuilder导入
		fbInput() {
			let vue = this;
			let socketState = parent.omegaSideConnect;
			if (socketState) {
				let src = rootPath + "\\" + vue.fileSelect.src;
				socketFun.fbCmd("set " + vue.fileSelect.x + " " + vue.fileSelect.y + " " + vue.fileSelect.z);
				setTimeout(()=>{
					let msg;
					switch (vue.fileSelect.type){
						case "schematic":
							// windows的路径符号也是golang的转义符,side传递命令不同于控制台输入需要进行一次转义
							//同时为了兼容含有空格的文件，因此出现了 \\\" 和\\\\\\\\
							msg = `schem -p \\\"` + src.replaceAll("\\","\\\\\\\\")+"\\\"";
							socketFun.fbCmd(msg);
							break;
						case "schem":
							vue.openErr("该模式暂不支持schem文件，请使用omega导入");
							break;
						case "bdx":
							msg = `bdump -p \\\"` + src.replaceAll("\\","\\\\\\\\")+"\\\"";
							socketFun.fbCmd(msg);
							break;
						default:
							break;
					}
				},500);
				vue.openOk("导入任务已提交至FastBuilder控制台");
			} else {
				vue.openErr("旁加载系统无连接");
			}
		},
		// 复制Omega导入命令
		omgInputCopyCmd() {
			let vue = this;
			let src = vue.fileSelect.src.substring(5); //截掉“data\”
			if (src.indexOf(" ") > -1) {
				vue.openErr("omega不支持文件路径含有空格，请重命名文件或使用FastBuilder导入")
			} else{
				let clipboard = navigator.clipboard;
				let commadn = `load "`+ src +` `+ vue.fileSelect.x + " " + vue.fileSelect.y + " " + vue.fileSelect.z;
				navigator.clipboard.writeText(commadn);
				vue.openOk("命令已复制到粘贴板（控制台右键粘贴）")
			}

		},
		openOk(msg) {
			this.$message({
				message: msg,
				type: 'success'
			});
		},
		openErr(msg) {
			this.$message.error(msg);
		}
	}
})