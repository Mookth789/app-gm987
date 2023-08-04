<template>
	<view class="u-page u-flex-items-center">
		<image class="logo" src="/static/images/logo.png"></image>
		<text class="title">
			项目init
		</text>
		<view class="bottom">
			<u-link under-line href="https://uviewui.com/" text="เปิดเอกสาร uView UI"></u-link>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.logo {
		height: 100px;
		width: 100px;
		margin-top: 100rpx;
		margin-bottom: 50rpx;
	}

	.title {
		font-size: 15px;
		color: $u-content-color;
	}

	.bottom {
		margin-top: 80rpx;
	}
</style>
