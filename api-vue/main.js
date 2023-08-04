import Vue from 'vue'
import App from './App'
import config from '@/config.js'
import store from '@/store'
import uView from '@/uni_modules/uview-ui'

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$ossDomain = config.OSS_DOMAIN
Vue.use(uView)

// #ifdef H5
import wechat from '@/utils/wxH5/jssdk.js'
if (wechat.isWechat())
	Vue.prototype.$wechat = wechat
// #endif

// #ifndef MP
// แนะนำแพ็คเกจมิกซ์อินที่แชร์โดย uView ไปยังแอปเพล็ต
let mpShare = require('@/uni_modules/uview-ui/libs/mixin/mpShare.js')
Vue.mixin(mpShare)
// #endif
 
const app = new Vue({
	store,
	...App
})

// ขอแพ็คเกจ
require('@/utils/request.js')(app)

app.$mount()
