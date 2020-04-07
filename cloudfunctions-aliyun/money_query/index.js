'use strict';
//云函数:查询日常账单
const db = uniCloud.database();
const collection = db.collection('money');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event);
	let res = await collection.orderBy("date", "desc").where({
		openid: event.openid
	}).get();
	//返回数据给客户端
	console.log('res : ' + res);
	return res
};
