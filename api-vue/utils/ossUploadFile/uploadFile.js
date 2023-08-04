// base64,Hmac,Sha1,Crypto 相关算法
import config from './config.js';
import base64 from './base64.js';
import Hmac from './hmac.js';
import Sha1 from './sha1.js';
import Crypto from './crypto.js';

/**
 * 上传文件到阿里云oss
 * @param {string} filePath 图片的本地资源路径
 * @param {string} dir 表示要传到哪个目录下
 * @return 完整的图片地址
 */
const uploadFile = function(filePath, dir) {
	return new Promise((resolve, reject) => {
		if (!filePath || filePath.length < 9) {
			uni.showModal({
				title: '图片错误',
				content: '请重试',
				showCancel: false,
			})
			reject('图片错误');
		}

		console.log('上传图片中...');

		// #ifdef H5
		// 图片名字 可以自行定义
		let aliyunFileKey = dir + '.png';
		// #endif

		// #ifndef H5
		// 获取上传的文件类型
		let fileTypeIndex = filePath.lastIndexOf('.');
		let fileType = filePath.substring(fileTypeIndex);
		let aliyunFileKey = dir + fileType;
		// #endif

		const aliyunServerURL = config.uploadImageUrl; // OSS地址，需要https
		const accessid = config.OSSAccessKeyId;
		const policyBase64 = getPolicyBase64();
		const signature = getSignature(policyBase64); // 获取签名

		uni.uploadFile({
			url: aliyunServerURL, // 开发者服务器url
			filePath: filePath, // 要上传文件资源的路径
			name: 'file', // 必须填file
			formData: {
				'key': aliyunFileKey,
				'policy': policyBase64,
				'OSSAccessKeyId': accessid,
				'success_action_status': '200', // 让服务端返回200, 不然默认会返回204
				'signature': signature,
			},
			success: function(res) {
				if (res.statusCode != 200) {
					reject(new Error('上传错误:' + JSON.stringify(res)));
				}
				resolve(aliyunServerURL + aliyunFileKey);
			},
			fail: function(err) {
				err.domainName = aliyunServerURL;
				reject(err);
			},
		})
	});
}

const getPolicyBase64 = function() {
	let date = new Date();
	date.setHours(date.getHours() + config.timeout);
	let srcT = date.toISOString();

	const policyText = {
		"expiration": '2099-01-01T12:00:00.000Z', //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 
		"conditions": [
			["content-length-range", 0, 5242880] // 设置上传文件的大小限制(5m)
		]
	};
	const policyBase64 = base64.encode(JSON.stringify(policyText));
	return policyBase64;
}

// 生成签名
const getSignature = function(policyBase64) {
	const accesskey = config.AccessKeySecret;
	const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
		asBytes: true
	});
	const signature = Crypto.util.bytesToBase64(bytes);
	return signature;
}

module.exports = uploadFile;
