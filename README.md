<!-- 
	 警告！
	 为了防止明天的我看不懂今天的我写的代码
	 请务必饱和式注释！！！！
 -->

# omega管理面板<Windows版>
> ## 与Omega通信的外部工具

## 使用方法


## 开发环境
1. 安装[Node.js](https://nodejs.org/zh-cn/)

2. 初始化环境
- 安装electron
```	powershell
	npm install electron --save-dev
```
- 安装electron-builder(建议使用yarn包管理器)
```	powershell
	npm install electron-builder --save-dev
```

4. 选择自己喜欢的代码编辑器，开始愉快的开发吧！

5. 使用npm run dist-win编译Windows版

#### tips：
- 开发前确保掌握JavaScript
- 建议了解 Node.js、Vue、element-UI、electron和Omega-side
- 非必要请勿在前端页面中运行nodejs

### 常见问答
> 问：为什么不使用Omega的node环境		
> 答：权限不够自由~~（正解：能力不足，没用明白（正解：权限不够自由））~~
>
> 问：为什么放弃了静态版		
> 答：静态版除了上面的没有环境，同时性能低 ~~（正解：都用electron了，单纯图方便)~~（
>
> 问：为什么内存占用这么高		
> 答：Chromium在自身会使用一定内存，同时软件还内置了完整的nodejs环境		
>  ~~（正：喜报 Chromium应用 +1 内存炒鸡加倍）~~		
>
> 问：会不会有Mac版		
> 答：理论上简单改动是可以直接编译的，请自行修改源码~~（正：没有mac）~~

