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
			
			try{
				socket = new WebSocket("ws://" + path + "/omega_side ");
			}catch(e){
				
			}

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
				console.log(jsonMsg);
				omgData = jsonMsg; //保存结果
			});
			socket.addEventListener('close', function() {
				sideColor.style.backgroundColor = "red";
				sideColor.className = "side_";
				sideinfo.innerHTML = "离线"
				omegaSideConnect = false;
				setTimeout(()=>{
					sideColor.style.backgroundColor = "orange";
					sideinfo.innerHTML = "重试"
					setTimeout(()=>{
						socketClose();
					},2000);
				},800);
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
/**
 * 此处待优化！，设计一个参数接收回调函数。设计一个结束请求函数清空缓存。
 * 该函数仅为理想情况下，omega可以在6秒内返回结果。
 * 重构理由：需要考虑omega本身发生异常，或用户计算机发生异常。无法在6秒内正常返回
 * 重构风险：该函数与程序高度耦合，重构时请检查引用
 */
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
//获取玩家坐标
var getPlayerPlace = (player)=>{
	let msg = `{"client":` + (msgID += 1) + `,"function":"player.pos","args":{"player":"` + player + `","limit":"@p"}}`
	socket.send(msg);
}
// WebSocketEND
