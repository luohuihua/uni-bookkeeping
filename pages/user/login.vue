<template>
	<view style="padding-top: 40upx;">
		<view class="inputArea" style="text-align: center;">
			<image class="logo-img" src="/static/images/money.png"></image>
		</view>
		<view class="text-xl padding text-center">
			<text class="text-black text-bold">记数簿</text>
		</view>
		<view class="text-s padding text-center">
			<text class="text-gray">家常记账，知悭识俭</text>
		</view>

		<view class="inputArea">
			<button class="login-button bg-gradual-orange" open-type="getUserInfo" @getuserinfo="goLogin">翻开记数簿</button>
		</view>
	</view>
</template>

<script>
	import {
		callCloudFunction
	} from '@/common/public_util.js';

	let _self;
	export default {
		components: {},
		data() {
			return {

			}
		},
		onLoad() {
			_self = this;
			// let userInfo = uni.getStorageSync('userInfo');
			// if (userInfo != null && userInfo.openid != null) {
			// 	console.log('用户信息:' + JSON.stringify(userInfo));
			// 	uni.switchTab({
			// 		url: '/pages/app/bookkeeping/bookkeeping'
			// 	});
			// }else{
			// 	_self.getUserInfo();
			// }
		},
		methods: {
			goLogin() {
				// uni.authorize({
				// 	scope: 'scope.userInfo',
				// 	success() {
				// 		_self.getUserInfo();
				// 	},
				// 	fail: (fail) => {
				// 		console.log('授权错误：' + JSON.stringify(fail));
				// 	}
				// })
				_self.getUserInfo();
			},
			getUserInfo: () => {
				uni.showLoading({
					title: '正在授权登录中........'
				});
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						// 获取用户信息
						uni.getUserInfo({
							provider: 'weixin',
							withCredentials: true,
							success: (infoRes) => {
								callCloudFunction('get_openid', {
									code: loginRes.code
								}, (res) => {
									uni.hideLoading();
									//获取到openid
									let openid = res.data.openid;
									let userInfo = infoRes.userInfo;
									userInfo.openid = openid;
									uni.setStorageSync('userInfo', userInfo);
									callCloudFunction('user_add', userInfo, (res) => {

									});
									console.log('用户信息:' + JSON.stringify(userInfo));
									uni.switchTab({
										url: '/pages/app/bookkeeping/bookkeeping'
									});
								});

							},
							fail: (fail) => {
								uni.hideLoading();
								uni.showToast({
									icon: "none",
									title: '翻开记数簿要允许授权'
								});
							}
						});
					},
					fail: (fail) => {
						uni.hideLoading();
						console.log(JSON.stringify(fail));
					}
				});
			}
		}
	}
</script>

<style>
	.inputArea {
		padding: 30upx 10%;
	}

	.inputClass {
		border: 2px solid #ccc;
		border-radius: 44upx;
		outline: 0;
		width: 90%;
		padding: 16upx 30upx;
		background-color: #FFFFFF;
	}

	.logo-img {
		width: 150upx;
		height: 150upx;
		border-radius: 150upx;
	}

	.login-button {
		/* background: #2fc25b; */
		color: #FFFFFF;
		border-radius: 54upx;
		font-size: 36upx;
		text-align: center;
		padding: 20upx;
	}
</style>
