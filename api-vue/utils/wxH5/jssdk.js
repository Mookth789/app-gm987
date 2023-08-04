import Vue from 'vue';
import jweixin from './jweixin-1.6.0.js';

export default {
	/**
	 * ตรวจสอบว่าสภาพแวดล้อมการทำงานปัจจุบันอยู่ใน [ไคลเอ็นต์ WeChat] หรือไม่
	 * @return  true|false
	 */
	isWechat() {
		let ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/micromessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * เริ่มต้นการกำหนดค่า jssdk
	 * เพจทั้งหมดที่ต้องใช้ JS-SDK ต้องใส่ข้อมูลการกำหนดค่าก่อน มิฉะนั้นจะไม่ถูกเรียก (url เดียวกันจะต้องเรียกเพียงครั้งเดียว)
	 * @param url ที่อยู่เต็มของเพจ (แต่ไม่รวมส่วนที่อยู่หลังแฮช '#')
	 */
	initJssdkConfig(url) {
		return new Promise((resolve, reject) => {
			Vue.prototype.$u.get('/H5Common/getSignPackage', {
				url: encodeURIComponent(url)
			}).then(res => {
				jweixin.config({
					debug: false, // เปิดใช้งานโหมดดีบัก
					appId: res.data.appId, // จำเป็นต้องมี ตัวระบุเฉพาะของบัญชีอย่างเป็นทางการ
					timestamp: res.data.timestamp, // จำเป็น การประทับเวลาของลายเซ็นที่สร้างขึ้น
					nonceStr: res.data.nonceStr, // บังคับ สร้างสตริงสุ่มสำหรับลายเซ็น
					signature: res.data.signature, // จำเป็นต้องมีลายเซ็น
					jsApiList: [ // จำเป็นต้องมี รายการอินเทอร์เฟซ JS ที่จะใช้
						'hideMenuItems',
						'updateTimelineShareData',
						'updateAppMessageShareData',
						'chooseWXPay'
					]
				});
				resolve();
			})
		})
	},

	/**
	 * เรียกว่าในหน้าที่ต้องการแบ่งปันที่กำหนดเอง
	 * @param {Object} data {"title":"分享标题","desc":"分享描述","imgUrl":"分享图标"}
	 */
	share(data) {
		if (!this.isWechat()) return;

		let url = window.location.href.split('#')[0];

		// คุณต้องเริ่มต้นการกำหนดค่าใหม่ทุกครั้งก่อนจึงจะแชร์ได้  
		this.initJssdkConfig(url).then(() => {
			jweixin.ready(() => {
				// jweixin.hideMenuItems({
				// 	menuList: [ // รายการเมนูที่จะซ่อนสามารถซ่อนได้เฉพาะปุ่ม "การแพร่กระจาย" และ "การป้องกัน" ดูภาคผนวก 3 สำหรับรายการเมนูทั้งหมด
				// 		'menuItem:copyUrl' // คัดลอกลิงค์
				// 	]
				// });

				if (url.indexOf('?') != -1) {
					url += '&uid=' + uni.getStorageSync('uid');
				} else {
					url += '?uid=' + uni.getStorageSync('uid');
				}

				// แบ่งปันกับเพื่อน ๆ
				jweixin.updateAppMessageShareData({
					title: data.title, // แบ่งปันชื่อ
					desc: data.desc, // แบ่งปันคำอธิบาย
					link: url, // หากต้องการแชร์ลิงก์ ชื่อโดเมนหรือเส้นทางของลิงก์จะต้องสอดคล้องกับชื่อโดเมนความปลอดภัย JS ของบัญชีทางการที่ตรงกับหน้าปัจจุบัน
					imgUrl: data.imgUrl, // ไอคอนแบ่งปัน
				});

				// แบ่งปันไปยังแวดวงเพื่อน
				jweixin.updateTimelineShareData({
					title: data.title, // 分享标题
					link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: data.imgUrl, // 分享图标
				});
			});

			jweixin.error(err => {
				console.error('Jssdk失败验证==', err)
				Vue.prototype.$u.toast('Jssdk失败验证=='.err);
			});
		});
	},

	/**
	 * 微信支付
	 * @param {Object} data 支付所需的参数
	 */
	wxPay(data) {
		return new Promise((resolve, reject) => {
			let url = window.location.href.split('#')[0];
			this.initJssdkConfig(url).then(() => {
				jweixin.ready(() => {
					jweixin.chooseWXPay({
						timestamp: data.timeStamp, // 支付签名时间戳
						nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
						package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
						signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						paySign: data.paySign, // 支付签名
						success(res) {
							resolve(res);
						},
						fail(err) {
							reject(err);
						}
					});
				});

				jweixin.error(err => {
					console.error('支付失败验证==', err)
					Vue.prototype.$u.toast('支付失败验证=='.err);
				});
			})
		});
	}
}
