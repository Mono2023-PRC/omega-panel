var socketFun = parent;
onload = () => {
	let thisVue = vue();
	// side连接状态
	// thisVue.$data.load = !parent.omegaSideConnect;
	thisVue.menuSelect(0, "1")
	thisVue.getAllPlayer();
	// 每秒钟检测一次连接状态
	setInterval(() => {
		// thisVue.$data.load = !parent.omegaSideConnect;
	}, 1000)
}
var vue = () => new Vue({
	el: '#app',
	data: function() {
		return {
			load: false, //禁用页面
			selectMenu: "1", //菜单值

			// 玩家控制
			player: [{
				name: "获取玩家列表失败"
			}], //玩家列表
			playerSelect: "", //选中玩家
			playerOptions: [{
				value: '1',
				label: '杀死玩家'
			}, {
				value: '2',
				label: '踢出玩家'
			}, {
				value: '3',
				label: '清空背包'
			}, {
				value: '4',
				label: '清空末影箱（风险）'
			}, {
				value: '5',
				label: '创造模式（高危）'
			}, {
				value: '6',
				label: '生存模式'
			}, {
				value: '7',
				label: '冒险模式'
			}, {
				value: '8',
				label: '设为OP（高危）'
			}, {
				value: '9',
				label: '撤销OP（风险）'
			}],
			playerOption: "",

			// 快捷操作
			worldConfig: {
				time: "",
				weather: "",
				weathers: [{
					value: 'clear',
					label: '晴天'
				}, {
					value: 'rain',
					label: '雨天'
				}, {
					value: 'thunder',
					label: '雷雨天'
				}]
			},

			// 命令执行
			input: {
				msgComd: "", // 执行命令输入框
				msgCmdMod: "1", // 执行命令模式
				msgCmdMods: [{ //执行命令模式选项
					value: '1',
					label: '以控制台身份'
				}, {
					value: '2',
					label: '以机器人身份'
				}],
				roboteComd: "",
				fbCmd: "",
				qqMsg: "",
				msgJson: "",
				msgFunction1: "",
				msgFunction2: "",
				msgFunction3: ""
			}
		}
	},
	methods: {
		// 菜单排他显示
		menuSelect(key, keyPath) {
			let dom = document.getElementsByClassName("box");
			for (var i = 0; i < dom.length; i++) {
				dom[i].style.display = "none"
			};
			dom[(parseInt(keyPath) - 1)].style.display = "block";
		},
		// 获取玩家列表
		getAllPlayer() {
			document.getElementsByClassName("time")[0].innerHTML = new Date().toLocaleString();
			let vue = this;
			socketFun.functionMsg("get_players_list");
			(async function() {
				let msg = await socketFun.getNext();
				vue.player = msg.data;
			})();
		},
		// 执行命令
		msgComd() {
			let msg = this.input.msgComd;
			let mod = this.input.msgCmdMod;
			if (msg.substring(0, 1) != "/") {
				msg = "/" + msg
			};
			if (mod == "1") {
				socketFun.wsCmd(msg);
			} else {
				socketFun.playerCmd(msg);
			};
		},
		// 执行FastBuilder控制台命令
		fbCmd() {
			let msg = this.input.fbCmd;
			socketFun.fbCmd(msg);
		},
		// 机器人群聊消息(群服互通)
		qqMsg() {
			let msg = this.input.qqMsg;
			socketFun.qqMsg(msg);
		},
		// 执行omega函数
		msgFunction() {
			let msg1 = this.input.msgFunction1;
			let msg2 = this.input.msgFunction2;
			let msg3 = this.input.msgFunction3;

			if (msg2 == "" || msg3 == "") {
				socketFun.functionMsg(msg1);
			} else {
				socketFun.functionMsg(msg1, msg2, msg3);
			}
		},
		// 修改时间
		timeSet() {
			let time = this.worldConfig.time;
			socketFun.wsCmd("/time set " + time);
		},
		// 修改天气
		weatherSet() {
			let weather = this.worldConfig.weather
			socketFun.wsCmd("/weather " + weather);
		},
		// 清理掉落物
		killItems() {
			socketFun.wsCmd("/kill @e[type=item]");
		},
		openOk(msg) {
			this.$message({
				message: msg,
				type: 'success'
			});
		},
		openWarr(msg) {
			this.$message({
				message: msg,
				type: 'warning'
			});
		},
	}
})
