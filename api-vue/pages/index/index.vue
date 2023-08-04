<template>
  <view class="u-page u-flex-items-center">
    <image class="logo" src="/static/images/logo.png"></image>
    <text class="title"> index </text>
    <view class="bottom">
      <navigator url="/pages/login/login">
        <u-button type="primary" plain text="การแสดงหน้า Landing Page แบบสากล"></u-button>
      </navigator>
    </view>
  </view>
</template>

<script>
import { wxGetUserInfo } from '@/api/api.js'
import store from '@/store/index.js'
export default {
  data() {
    return {}
  },
  onLoad() {
    store.commit('user/set_token', 66666)
    console.log(this.$store.state.user.token,'---------token')
    // wxGetUserInfo()
  },
  methods: {}
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
