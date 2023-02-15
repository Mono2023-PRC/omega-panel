const fs = require('fs');
var helloOmega;
var helloConfig;
var index_main;

onload = () => {
	helloOmega = document.getElementById("hellomg");
	helloConfig = document.getElementById("form");
	index_main = document.getElementById("index_main");
	trueNewUser();
}

let trueNewUser = () => {

	fs.readFile('./data/config.json', (err, data) => {
		// 配置文件不存在
		if (err !== null) {
			console.log("无文件");
			fs.mkdir("data", (err) => {})
			
			let data = `
				{
					"config": false,
					"omega_storage": null,
					"omega_side": "127.0.0.1:24011"
				}
			`
			fs.writeFile("data/config.json", data,(err) => {
				if (err != null) {
					alert(err);
				}
			});
			
			setTimeout(()=>{
				trueNewUser();
			},200)
			
		// 文件读取成功
		// 热知识:readFile读整个文件,不需要关闭资源
		} else {
			let config = JSON.parse(data.toString());
			if (config.config) {
				setTimeout(() => {
					window.location = "./main.html"
				}, 1800)
			} else {
				helloConfig.innerText = "第一次进入，正在进入配置页面"
				helloOmega.setAttribute("style", "-webkit-animation: zoom 1.5s forwards");
				helloConfig.setAttribute("style", "-webkit-animation: show 1.5s forwards");
				setTimeout(() => {
					setTimeout(() => {
						index_main.setAttribute("style",
							"-webkit-animation: hidden 0.3s forwards");
						setTimeout(() => {
							window.location = "./frame/config.html"
						}, 300);
					}, 300)
				}, 1800)
			}
		}
	});

}
