'use strict';
//云函数:获取授权微信的唯一标记，使用云函数的原因是不能在客户端请求，该域名不能被配置为服务器域名就无法使用
//出于安全考虑，api.weixin.qq.com 不能被配置为服务器域名，相关API也不能在小程序内调用。 开发者应将 AppSecret 保存到后台服务器中，通过服务器使用 getAccessToken 接口获取 access_token，并调用相关 API；
const appid = 'wxdf8xxxxxxx'; //小程序的appid
const secret = '6359a58bxxxxxxxxxx'; //小程序的secret
const loginUrl = 'https://api.weixin.qq.com/sns/jscode2session';//请求网址
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event)
	let res = await uniCloud.httpclient.request(loginUrl, {
		data: {
			appid: appid,
			secret: secret,
			js_code: event.code,
			grant_type: 'authorization_code'
		},
		dataType: 'json'
	})
	console.log('res : ' + res)
	return res
};
