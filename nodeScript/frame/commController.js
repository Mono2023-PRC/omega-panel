var socketFun = parent;
const require = parent.window.require;
const fs = require('fs');

onload = () => {
	let thisVue = vue();
	// thisVue.$data.load = !parent.omegaSideConnect; // side连接状态
	// side无连接,检测是否因为组件未开启
	if (!parent.omegaSideConnect) {
		console.log("开始判断");
		let rootPath = null;
		fs.readFile('./data/config.json', 'utf8', (err, data) => {
			if (err !== null) {} else {
				let config = JSON.parse(data.toString());
				rootPath = config.omega_storage + "\\配置\\OmegaSide旁加载组件系统\\组件-OmegaSide旁加载组件系统-1.json";
			};
			fs.readFile(rootPath, 'utf8', (err, data) => {
				if (err !== null) {} else {
					let config = JSON.parse(data.toString());
					// 旁加载系统已被禁用
					if (config.是否禁用) {

						thisVue.openSide(rootPath, config);
					};
				};
			});
		});
	}
	thisVue.menuSelect(0, "1") // 切换至第一个选项卡
	thisVue.getAllPlayer(); // 尝试获取玩家列表
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
				label: '获取坐标'
			}, {
				value: '3',
				label: '清空背包'
			}, {
				value: '4',
				label: '清空末影箱（风险操作）'
			}, {
				value: '5',
				label: '创造模式（高危操作）'
			}, {
				value: '6',
				label: '生存模式'
			}, {
				value: '7',
				label: '冒险模式'
			}, {
				value: '8',
				label: '设为OP（高危操作）'
			}, {
				value: '9',
				label: '撤销OP（风险操作）'
			}, {
				value: '10',
				label: '踢出玩家'
			}],
			playerOption: "",
			effect: [{
					value: "clear",
					name: "清除效果"
				},
				{
					value: "speed",
					name: "速度"
				},
				{
					value: "slowness",
					name: "缓慢"
				},
				{
					value: "haste",
					name: "急迫"
				},
				{
					value: "mining_fatigue",
					name: "挖掘疲劳"
				},
				{
					value: "strength",
					name: "力量"
				},
				{
					value: "instant_health",
					name: "瞬间治疗"
				},
				{
					value: "instant_damage",
					name: "瞬间伤害"
				},
				{
					value: "nausea",
					name: "反胃"
				},
				{
					value: "regeneration",
					name: "生命恢复"
				},
				{
					value: "resistance",
					name: "抗性提升"
				},
				{
					value: "fire_resistance",
					name: "防火"
				},
				{
					value: "water_breathing",
					name: "水下呼吸"
				},
				{
					value: "invisibility",
					name: "隐身"
				},
				{
					value: "blindness",
					name: "失明"
				},
				{
					value: "night_vision",
					name: "夜视"
				},
				{
					value: "hunger",
					name: "饥饿"
				},
				{
					value: "weakness",
					name: "虚弱"
				},
				{
					value: "poison",
					name: "中毒"
				},
				{
					value: "wither",
					name: "凋零"
				},
				{
					value: "health_boost",
					name: "生命提升"
				},
				{
					value: "absorption",
					name: "伤害吸收"
				},
				{
					value: "saturation",
					name: "饱和"
				},
				{
					value: "levitation",
					name: "飘浮"
				},
				{
					value: "slow_falling",
					name: "缓降"
				},
			],
			effectOpthin: "",
			effectTime: "60",
			effectLeve: "",
			playerPlace:"",//玩家坐标
			score: "", //分数
			scoreName: "", //记分板名称
			scoreOptions: [{
					value: 'add',
					label: '增加'
				},
				{
					value: 'remove',
					label: '扣除'
				},
				{
					value: 'set',
					label: '设置'
				}
			],
			scoreOption: "add",
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
		/**
		 * 玩家控制模块
		 */
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
		// 执行快捷指令
		playerCmdExecute() {
			let vue = this;
			if (vue.playerOption == "") {
				vue.openWarr("内容不能为空");
				return;
			} else if (vue.playerSelect == "") {
				vue.openWarr("请选择执行玩家");
				return;
			};
			switch (vue.playerOption) {
				case '1':
					// '杀死玩家'
					socketFun.wsCmd("/kill " + vue.playerSelect);
					break;
				case '2':
					// '获取玩家坐标'
					socketFun.getPlayerPlace(vue.playerSelect);
					(async ()=>{
						let msg = await socketFun.getNext();
						let pos = msg.data.pos;
						vue.playerPlace = "获取到坐标：x："+pos[0]+"，y："+pos[1]+"，z："+pos[2];
					})();
					break;
				case '3':
					// '清空背包'
					socketFun.wsCmd("/clear " + vue.playerSelect);
					break;
				case '4':
					// '清空末影箱（风险操作）'
					for (var i = 0; i < 26; i++) {
						socketFun.wsCmd("/replaceitem entity " + vue.playerSelect + " slot.enderchest " + i +
							" air");
					}
					break;
				case '5':
					// '创造模式（高危操作）'
					socketFun.wsCmd("/gamemode creative " + vue.playerSelect);
					break;
				case '6':
					// '生存模式'
					socketFun.wsCmd("/gamemode survival " + vue.playerSelect);
					break;
				case '7':
					// '冒险模式'
					socketFun.wsCmd("/gamemode adventure " + vue.playerSelect);
					break;
				case '8':
					// '设为OP（高危操作）'
					socketFun.wsCmd("/op " + vue.playerSelect);
					break;
				case '9':
					// '撤销OP（风险操作）'
					socketFun.wsCmd("/deop " + vue.playerSelect);
					break;
				case '10':
					// '踢出玩家'
					socketFun.wsCmd("/kick " + vue.playerSelect);
					break;
				default:
					vue.openWarr("请求参数不合法");
					break;
			};
			vue.openOk("请求已提交至omega");
		},
		// 执行药水效果
		playerEffectExecute() {
			let vue = this;
			if (vue.effectOpthin == "") {
				vue.openWarr("选项不能包含空值");
				return;
			} else if (vue.playerSelect == "") {
				vue.openWarr("请选择执行对象");
				return;
			};
			socketFun.wsCmd("/effect " + vue.playerSelect + " " + vue.effectOpthin + " " + vue.effectTime);
			vue.openOk("请求已提交至omega");
		},
		// 分数操作
		scoreExecute() {
			let vue = this;
			if (vue.scoreName == "") {
				vue.openWarr("记分板名不能为空");
				return;
			} else if (vue.playerSelect == "") {
				vue.openWarr("请选择执行对象");
				return;
			};
			socketFun.wsCmd("/scoreboard players " + vue.scoreOption + " " + vue.playerSelect + " " + vue
				.scoreName + " " + vue.score);
			vue.openOk("请求已提交至omega");
		},
		/**
		 * 快捷操作模块
		 */
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
		/**
		 * 命令执行模块
		 */
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
		/**
		 * 页面功能
		 */
		// 菜单排他显示
		menuSelect(key, keyPath) {
			let dom = document.getElementsByClassName("box");
			for (var i = 0; i < dom.length; i++) {
				dom[i].style.display = "none"
			};
			dom[(parseInt(keyPath) - 1)].style.display = "block";
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
		// 尝试开启side
		openSide(path, obj) {
			this.$confirm('该模块依赖旁加载组件系统，检测到组件未启用。  是否尝试启用该组件？。', '旁加载未启用！', {
				confirmButtonText: '启用组件',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				obj.是否禁用 = false;
				obj.配置.只打开用于开发的Websocket端口而不启动任何插件 = true;
				fs.writeFile(path, JSON.stringify(obj, "", "	"), function(err) {
					console.log(err);
				})
				this.$alert('配置文件已变更，请重启Omega!', '成功', {
					confirmButtonText: '确定',
				});
			});
		}
	}
})