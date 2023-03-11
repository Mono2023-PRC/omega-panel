var socketFun = parent;
onload = () => {
	let thisVue = vue();
	// side连接状态
	thisVue.$data.load = !parent.omegaSideConnect;
	// 每秒钟检测一次连接状态
	setInterval(()=>{
		thisVue.$data.load = !parent.omegaSideConnect;
	},1000)
}
var vue = () => new Vue({
	el: '#app',
	data: function() {
		return {
			load:true,//禁用页面
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
			},
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
			}
		}
	},
	methods: {
		// 执行命令
		msgComd() {
			let msg = this.input.msgComd;
			let mod = this.input.msgCmdMod;
			if (msg.substring(0,1) != "/") {
				msg = "/"+msg
			};
			if (mod == "1") {
				socketFun.wsCmd(msg);
			} else{
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
		}
	}
})
