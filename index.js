const { app, BrowserWindow } = require('electron');
const path = require('path')

var win = null;

app.on('ready',()=>{
	win = new BrowserWindow({
		width: 1100,
		height: 650,
		resizable: false,
		webPreferences: {
		    preload: path.join(__dirname, 'nodeServer/preload.js')
		}
	})
	win.loadFile('page/index.html');
	
	win.on('close',()=>{
		win = null;
	})
})
