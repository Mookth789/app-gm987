import config from '@/config.js'
import common from '@/utils/wxApplet/common.js'

module.exports = (vm) => {
	// เริ่มต้นการกำหนดค่าคำขอ
	uni.$u.http.setConfig((defaultConfig) => {
		defaultConfig.baseURL = config.HTTP_REQUEST_URL;
		return defaultConfig
	})

	// ขอสกัดกั้น
	uni.$u.http.interceptors.request.use((configs) => {
		// เมื่อตัวสกัดกั้นคำขอถูกเตรียมใช้งาน เมธอดนี้จะถูกดำเนินการ ในขณะนี้ ข้อมูลไม่ได้ถูกกำหนด และค่าเริ่มต้นคือ {}
		configs.data = configs.data || {}
		configs.header[config.TOKEN_NAME] = vm.$store.store.state.user.token ? vm.$store.store.state.user.token : "";
		return configs
	}, config => {
		// Async wait สามารถใช้สำหรับการดำเนินการแบบอะซิงโครนัส
		return Promise.reject(config)
	})

	// การสกัดกั้นการตอบสนอง
	uni.$u.http.interceptors.response.use((response) => {
		const data = response.data
		if (data.code == 10000) {
			return data.data === undefined ? {} : data.data
		} else if (data.code == 10006 || data.code == 10007) {
			// ทเค็นหมดอายุ｜เพิ่มในบัญชีดำ｜การยืนยันโทเค็นล้มเหลว คุณต้องเข้าสู่หน้าเข้าสู่ระบบอีกครั้งเพื่อเข้าสู่ระบบ
			common.logout();
			uni.reLaunch({
				url: '/pages/login/login'
			});
			return new Promise(() => {});
		} else {
			if (data.message) {
				uni.$u.toast(data.message)
			} else {
				uni.$u.toast(data)
			}
			return new Promise(() => {});
		}
	}, (response) => {
		// ทำบางสิ่งที่มีข้อผิดพลาดในการตอบสนอง (รหัสสถานะ !== 200）
		console.log('ข้อผิดพลาดในการตอบสนอง =', response)
		return Promise.reject(response)
	})
}
