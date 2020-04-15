<template>

	<view class="qiun-columns">
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt" style="width: 100%;">
			<view class="qiun-title-dot-light">联系人:罗先生</view>
		</view>
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt" style="width: 100%;">
			<view class="qiun-title-dot-light" @click="copyText('295228341@qq.com')">邮箱:295228341@qq.com</view>
		</view>
		<image class="logo-img" style="padding-top: 20px;" mode="aspectFit" @click="copyText('13537927121')" src="/static/wx.png"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {
			copyText(text) {
				uni.setClipboardData({
					data: text,
					success: function() {
						uni.showToast({
							title: '复制成功'
						})
					}
				});
			}

		}
	}
</script>

<style>

</style>
