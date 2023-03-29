<!-- 
	 警告！
	 为了防止明天的我看不懂今天的我写的代码
	 请务必饱和式注释！！！！
 -->

# omega管理面板<Windows版>
> ## 与Omega通信的外部工具

## 使用方法
1.下载		
- A.下载经过编译的发行版本安装包，双击exe点击下一步进行快速安装	
- B.或下载解压版，双击exe启动
2.设置路径
- 填写omega_storage完整路径地址（该文件夹会在omega运行时自动生成，请勿自行创建）

## 开发环境
> 开发前确保掌握JavaScript		
> 建议了解 Node.js、Vue、element-UI、electron和Omega-side

1. 安装[Node.js](https://nodejs.org/zh-cn/)

2. 初始化环境
- 安装electron
```	powershell
	npm install electron --save-dev
```
- 安装electron-builder(推荐使用yarn包管理器)
```	powershell
	npm install electron-builder --save-dev
```

4. 选择自己喜欢的代码编辑器进行开发

5. 使用npm run dist-win编译Windows版