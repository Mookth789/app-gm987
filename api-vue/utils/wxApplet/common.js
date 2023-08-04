import {
	wxLogin as login,
	wxGetUserInfo,
	wxGetPhoneNumber
} from '@/api/api.js'

import store from '@/store/index.js'

/**
 * 获取登录凭证
 * @return {boolean} true:已过期、false:未过期
 */
const wxLogin = () => {
	return new Promise((resolve, reject) => {
		uni.checkSession({
			success: () => {
				//session_key 未过期，并且在本生命周期一直有效
				resolve(false)
			},
			fail() {
				// session_key 已经失效，需要重新执行登录流程
				uni.login({
					provider: 'weixin',
					success: (res) => {
						login(res.code).then(res => {
							store.commit('user/set_openid', res.openid)
							resolve(true)
						})
					}
				})
			}
		})
	})
}

/**
 * 退出登录
 */
const logout = () => {
	return new Promise((resolve, reject) => {
		store.commit('user/set_token', '')
		store.commit('user/set_userInfo', {})
		store.commit('user/set_phone', '')
		resolve(true);
	})
}

/**
 * 获取用户基础信息（昵称、头像等）
 * @return {object} { true: '允许授权｜已授权过了 可以继续往下执行其他业务逻辑', false: '拒绝授权｜异常' }
 */
const getUserProfile = () => {
	return new Promise((resolve, reject) => {
		let userInfo = store.getters.userInfo,
			openid = store.getters.openid;
			
		if (!openid) { 
			uni.$u.toast('openid为空！请先调用login接口');
			resolve(false);
		} else {
			if (JSON.stringify(userInfo) == "{}") {
				uni.getUserProfile({
					// 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					desc: '用于完善会员资料',
					success: (res) => {
						// 允许授权
						wxGetUserInfo({
							encryptedData: res.encryptedData,
							iv: res.iv,
							openid
						}).then(userInfo => {
							store.commit('user/set_userInfo', userInfo)
							resolve(true);
						}).catch(err => {
							uni.$u.toast(err.errMsg);
							resolve(false);
						});
					},
					fail: (err) => {
						// 拒绝授权｜其他异常
						if (err.errMsg != "getUserProfile:fail auth deny") {
							uni.$u.toast(err.errMsg);
						}
						resolve(false);
					}
				})
			} else {
				// 已经授权过了
				resolve(true)
			}
		}
	})
}

/**
 * 微信手机号快捷登录
 * @param {object} e 回调函数的整个参数
 * @return {object} { true: '允许授权｜已授权过了 可以继续往下执行其他业务逻辑', false: '拒绝授权' }
 */
const getPhoneNumber = (e) => {
	return new Promise((resolve, reject) => {
		let detail = e.detail;
		if (detail.errMsg == "getPhoneNumber:ok") {
			let openid = store.getters.openid;
			if (!openid) {
				uni.$u.toast('openid为空！请先调用login接口');
				resolve(false);
			} else {
				wxLogin().then(() => {
					wxGetPhoneNumber({
						encryptedData: detail.encryptedData,
						iv: detail.iv,
						openid
					}).then(data => {
						store.commit('user/set_phone', data.phones)
						store.commit('user/set_token', data.token)
						store.commit('user/set_userInfo', data.userInfo)
						resolve(true);
					})
				})
			}
		} else {
			// 拒绝授权
			if (detail.errMsg == 'getPhoneNumber:fail user deny' || detail.errMsg == 'getPhoneNumber:fail:user deny') {
				uni.$u.toast('授权登录后才能体验完整的功能哦', 2500);
			} else if (detail.errMsg == 'getPhoneNumber:fail no permission') {
				uni.$u.toast('该小程序暂无权限获取用户的手机号！', 2500);
			}
			resolve(false);
		}
	})
}

export default {
	wxLogin,
	logout,
	getUserProfile,
	getPhoneNumber
}
