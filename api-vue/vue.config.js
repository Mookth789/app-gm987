module.exports = {
	// 配置路径别名
	configureWebpack: {
		devServer: {
			// อนุญาตการเจาะเครือข่ายภายในระหว่างการดีบัก เพื่อให้บุคคลจากเครือข่ายภายนอกสามารถเข้าถึงหน้า H5 สำหรับการดีบักในเครื่อง
			disableHostCheck: true
		}
	}
}
