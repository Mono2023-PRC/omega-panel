// WebSocket
var msgID = 0; //请求序号
var socket; //WebSocket
var omgData; //omg返回内容
var omegaSideConnect = false; //side连接状态

// 初始化websocket
var setSocket = () => {
	// 更新连接状态显示
	let sideColor = document.getElementsByClassName("side_")[0];
	let sideinfo = document.getElementsByClassName("side_state")[0];
	sideColor.className = "el-icon-loading";
	sideinfo.innerHTML = "连接"

	// 开始连接
	let path;
	fs.readFile('data/config.json', (err, data) => {
		if (err !== null) {} else {
			let config = JSON.parse(data.toString());
			path = config.omega_side;

			socket = new WebSocket("ws://" + path + "/omega_side ");
			socket.addEventListener('open', function() {
				// 打开websocket连接
				sideColor.style.backgroundColor = "green";
				sideColor.className = "side_";
				sideinfo.innerHTML = "在线"
				omegaSideConnect = true;
			});
			//接收websocket服务的数据
			socket.addEventListener('message', function(e) {
				// 处理数据
				let jsonMsg = JSON.parse(e.data);
				omgData = jsonMsg; //保存结果
			});
			socket.addEventListener('close', function() {
				sideColor.style.backgroundColor = "red";
				sideColor.className = "side_";
				sideinfo.innerHTML = "离线"
				omegaSideConnect = false;
			});

		};
	});
}

// 重连WebSocket
var socketClose = () => {
	document.getElementsByClassName("side_")[0].style.backgroundColor = "";
	try {
		socket.close();
	} catch (e) {
		console.log("无连接")
	}
	setSocket();
}

// 获取下一条返回内容
// 超时无结果则返回0
var getNext = async () => {
	let msg = omgData;
	let str;
	await new Promise((ret) =>{
		let time = 0;
		let interval = setInterval(() => {
			if (msg != omgData) {
				str = omgData;
				ret();
				clearInterval(interval);
			} else if (time > 600) {
				str = 0;
				ret();
				clearInterval(interval);
			} else {
				time++;
			}
		}, 10);
	});
	return str;
}

// 通信
var shellMsg = (msg) => {
	socket.send(msg);
}
//以后台身份执行命令
var wsCmd = (msgObj) => {
	let msg = `{"client":` + (msgID += 1) + `,"function":"send_ws_cmd","args":{"cmd":"` + msgObj + `"}}`
	socket.send(msg)
};
//以机器人身份执行命令
var playerCmd = (msgObj) => {
	let msg = `{"client":` + (msgID += 1) + `,"function":"send_player_cmd","args":{"cmd":"` + msgObj + `"}}`
	socket.send(msg)
}
//控制台命令
var fbCmd = (msgObj) => {
	let msg = `{"client":` + (msgID += 1) + `,"function":"send_fb_cmd","args":{"cmd":"` + msgObj + `"}}`
	socket.send(msg)
}
//群服互通消息
var qqMsg = (msgObj) => {
	let msg = `{"client":` + (msgID += 1) + `,"function":"send_qq_msg","args":{"msg":"` + msgObj + `"}}`
	socket.send(msg)
}
// 无参函数
var functionMsg = (msgObj) => {
	let msg = `{"client":` + (msgID += 1) + `,"function":"` + msgObj + `","args":{}}`
	socket.send(msg)
}
// 有参函数
var functionMsg2 = (msgObj1, msgObj2, msgObj3) => {
	let msg = `{"client":` + (msgID += 1) + `,"function":"` + msgObj1 + `","args":{"` + msgObj2 + `":"` + msgObj3 +
		`"}}`
	socket.send(msg)
}
// WebSocketEND
