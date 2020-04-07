<template>
	<view style="padding-top: 40upx;">
		<view class="inputArea" style="text-align: center;">
			<image class="logo-img" src="../../static/images/avatar.png"></image>
		</view>

		<view class="inputArea">
			<button class="login-button" open-type="getUserInfo" @getuserinfo="goLogin">授权登录</button>
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
			let userInfo = uni.getStorageSync('userInfo');
			if (userInfo != null && userInfo.openid != null) {
				console.log('用户信息:' + JSON.stringify(userInfo));
				uni.switchTab({
					url: '/pages/app/bookkeeping/bookkeeping'
				});
			}else{
				_self.getUserInfo();
			}
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
								// let appid = 'wxdf8fb6be9c8922e2';
								// //小程序secret
								// let secret = '6359a58b6eecfc8f37e6a13feaa548b9';
								// //wx接口路径
								// let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret +
								// 	'&js_code=' +
								// 	loginRes.code + '&grant_type=authorization_code';
								// uni.request({
								// 	url: url, // 请求路径
								// 	data: {}, // 请求体  注:在这里不需要写,有没有无所谓
								// 	method: 'GET', //请求方式,
								// 	header: '', //请求头  注:在这里不需要写,有没有无所谓
								// 	success: result => {
								// 		uni.hideLoading();
								// 		//获取到openid
								// 		let openid = result.data.openid;
								// 		let userInfo = infoRes.userInfo;
								// 		userInfo.openid = openid;
								// 		uni.setStorageSync('userInfo', userInfo);
								// 		callCloudFunction('user_add', userInfo, (res) => {
								// 			console.log('云函数返回:' + JSON.stringify(res));
								// 		});
								// 		console.log('用户信息:' + JSON.stringify(userInfo));
								// 		uni.switchTab({
								// 			url: '/pages/app/bookkeeping/bookkeeping'
								// 		});
								// 	},
								// 	fail: err => {
								// 		uni.hideLoading();
								// 	} //失败
								// });
							},
							fail: (fail) => {
								uni.hideLoading();
								console.log(JSON.stringify(fail));
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
		background: #2fc25b;
		color: #FFFFFF;
		border-radius: 54upx;
		font-size: 36upx;
		text-align: center;
		padding: 20upx;
	}
</style>
