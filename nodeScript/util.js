/**
 * 工具封装库
 */



// 返回data文件夹下是否存在该文件或目录 ，需要引入node.fs
function isFillOrDire(fileName) {
	(async () => {
		let a;
		await new Promise((val) => {
			fs.stat('./data/' + fileName, (err, data) => {
				if (err) {
					a = "none"
				} else {
					if (data.isDirectory()) {
						a = "dire"
					} else if (data.isFile()) {
						a = "file"
					} else {
						a = "tureUndefined"
					}
				}
				val(a);
			});
		});
		return a;
	})(fileName).then((val) => {
		console.log(val);
		return val;
	});
}
