//菜单
const menu = require('electron').Menu;
var menuTemplate = [{
		id: '1',
		label: '设置'
	},
	{
		id: '2',
		label: '帮助'
	}
]

//选项卡
// menu.setApplicationMenu(null); 
// menu.setApplicationMenu(menu.buildFromTemplate(menuTemplate));