/**
 * 可以认为是store的计算属性
 * getter的返回值会根据它的依赖被缓存起来
 * 在组件中访问getter: mapGetters辅助函数 | this.$store.xxx
 */
const getters = {
	windowWidth: () => uni.getSystemInfoSync().windowWidth,
	windowHeight: () => uni.getSystemInfoSync().windowHeight,
	userInfo: state => state.user.userInfo,
	openid: state => state.user.openid,
	token: state => state.user.token,
	phone: state => state.user.phone,
}
export default getters
