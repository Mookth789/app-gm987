<template>
	<view class="u-page">
		<view class="u-flex-x-center">
			<view class="avatarUrl u-flex-x-center">
				<image class="avatarUrl_img" v-if="userInfo.avatar_url" :src="userInfo.avatar_url" mode="widthFix"></image>
				<!-- #ifdef APP-NVUE -->
				<u-icon v-else name="account" color="#c0d0cb" size="80"></u-icon>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<open-data v-if="!userInfo.avatar_url" type="userAvatarUrl"></open-data>
				<!-- #endif -->
			</view>
		</view>

		<view class="content">
			<view class="v2"></view>

			<view v-if="isShowUserInfo" class="v3">
				<text class="v3_text">สมัครรับสิทธิ์ดังต่อไปนี้</text>
			</view>
			<view v-if="isShowUserInfo" class="v4">
				<text class="v4_text">获取你的公开信息（昵称、头像等）</text>
			</view>

			<view v-if="!isShowUserInfo" class="v3">
				<text class="v3_text">手机号快捷登录</text>
			</view>
			<view v-if="!isShowUserInfo" class="v4">
				<text class="v4_text">未注册的手机号登录后将自动注册</text>
			</view>

			<button v-if="isShowUserInfo" @click="getUserProfile" class="u-reset-button u-flex-xy-center btn1" type="default">
				<u--text color="#fff" prefixIcon="weixin-fill" align="center" iconStyle="font-size:24px;margin-right:4px;color:#fff" text="获取微信昵称头像"></u--text>
			</button>

			<button v-else open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="u-reset-button u-flex-xy-center btn1" type="default">
				<u--text color="#fff" align="center" text="微信手机号快捷登录"></u--text>
			</button>

			<button @click="noSignIn" class="u-reset-button u-flex-xy-center btn2" type="default">
				<text class="btn2_text">暂不登录</text>
			</button>
		</view>
	</view>
</template>

<script>
	import common from '@/utils/wxApplet/common.js'
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				// แสดงปุ่มรับชื่อเล่นอวาตาร์หรือไม่
				isShowUserInfo: true,
			}
		},
		computed: {
			...mapGetters([
				'userInfo'
			])
		},
		onLoad() {
			this.isShowUserInfo = JSON.stringify(this.userInfo) == "{}" ? true : false
		},
		methods: {
			// รับชื่อเล่น อวาตาร์ และข้อมูลอื่นๆ
			getUserProfile() {
				common.getUserProfile().then(res => {
					if (res) {
						this.isShowUserInfo = false;
					}
				})
			},
			// เข้าสู่ระบบด้วยหมายเลขโทรศัพท์มือถือ
			getPhoneNumber(e) {
				common.getPhoneNumber(e).then(res => {
					if (res) {
						uni.showToast({
							title: 'เข้าสู่ระบบสำเร็จ',
							icon: 'success'
						})
						setTimeout(() => {
							this.noSignIn();
						}, 1300)
					}
				})
			},
			// อย่าเข้าสู่ระบบ
			noSignIn() {
				let pages = getCurrentPages()
				// ไม่มีเพจหลัก กลับไปที่โฮมเพจโดยตรง
				if (pages.length == 1) {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				} else {
					uni.navigateBack()
				}
			}
		} 
	}
</script>

<style lang="scss" scoped>
	.avatarUrl {
		width: 100px;
		height: 100px;
		border-radius: 50px;
		overflow: hidden;
		border: 4rpx solid #fff;
		box-shadow: 0rpx 0rpx 10rpx $u-light-color;

		&_img {
			width: 100px;
		}
	}

	.content {
		padding: 0 20px;
		flex-direction: column;
	}

	.v2 {
		margin-top: 70rpx;
		height: 1px;
		background: $u-border-color;
	}

	.v3 {
		margin-top: 50rpx;

		&_text {
			font-weight: bold;
			font-size: 16px;
			color: $u-main-color;
		}
	}

	.v4 {
		margin: 30rpx 0 80rpx 0;

		&_text {
			font-size: 14px;
			color: $u-tips-color;
		}
	}

	.btn1 {
		margin-bottom: 24rpx;
		background: #808003;
		height: 45px;
		border-radius: 45px;
	}

	.btn2 {
		background: $u-border-color;
		height: 45px;
		border-radius: 45px;

		&_text {
			color: #FFFFFF;
			font-size: 15px;
		}
	}
</style>
