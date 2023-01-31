const { app, BrowserWindow } = require('electron');
const path = require('path');
const menu = require('./page/electron/menu.js');//配置菜单
var win = null;


app.on('ready', () => {
	
	// 创建窗口
	win = new BrowserWindow({
		width: 1100,
		height: 650,
		resizable: false,
		webPreferences: {
			devTools:true,//开启调试模式 Ctrl+Shift+i
			nodeIntegration:true ,//允许渲染引擎使用完整node.js能力
			contextIsolation :false //禁用环境隔离
		}
	})
	win.loadFile('page/index.html');
	
	// 调试模式开启时同时打开控制台
	// win.webContents.openDevTools();//打开控制台
	
	// 窗口关闭销毁页面
	win.on('close', () => {
		win = null;
	})
})
