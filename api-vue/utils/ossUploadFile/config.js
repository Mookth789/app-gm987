import config from '@/config.js'

// 在h5端上传涉及到跨域，需在阿里云上配置跨域规则才能正常使用
module.exports = {
	uploadImageUrl: config.OSS_DOMAIN + '/', // 默认存在根目录后面要跟个'/' (在你当前小程序的后台的uploadFile 合法域名也要配上这个域名)
	AccessKeySecret: config.ACCESSKEYSECRET, // AccessKeySecret 去你的阿里云上控制台上找
	OSSAccessKeyId: config.ACCESSKEYID, // AccessKeyId 去你的阿里云上控制台上找
	timeout: 87600 // 这个是上传文件时Policy的失效时间
}
