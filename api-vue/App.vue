<script>
	export default {
		onLaunch: function() {
			console.log('>>>>>>>>>>>>>>>APP onLaunch<<<<<<<<<<<<<<')
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/uni_modules/uview-ui/libs/css/flex.scss";
	
	/**
	* 1. ข้อควรทราบเมื่อเขียนสไตล์ css ใน nuve: https://uniapp.dcloud.io/tutorial/nvue-css.html
	* 2. แบบแผนการใช้งานหน่วย rpx และ px
	* โปรดทราบว่าหน่วยความกว้างไดนามิกเช่น rpx จำเป็นต่อเมื่อคุณต้องการให้หน่วยขององค์ประกอบเปลี่ยนตามขนาดของความกว้างหน้าจอ (ช่วงเล็ก)
	* โดยทั่วไป ความสูงและขนาดตัวอักษรไม่ควรเปลี่ยนตามความกว้างของหน้าจอ (อัตราส่วนเท่ากัน) ดังนั้นความสูงและแบบอักษรจึงรวมเป็นหนึ่งโดยใช้ px
	*/
	page {
		background: #FFFFFF;
		color: $u-main-color;
		font-size: 14px;
	}
	
	.u-page {
		padding: 15px 15px 40px 15px;
	}

	view,
	navigator,
	image,
	text,
	scroll-view,
	swiper,
	swiper-item,
	input,
	textarea,
	button {
		box-sizing: border-box;
	}

	/* ข้อความกฎ kinsoku */
	.btw {
		table-layout: fixed;
		word-wrap: break-word;
		word-break: normal;
		text-align: justify;
		text-justify: inter-ideograph;
	}

	.bg-white {
		background: #fff;
	}

	.font-weight {
		font-weight: bold;
	}
</style>
