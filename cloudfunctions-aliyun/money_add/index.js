'use strict';
//云函数:新增日常账单记录
const db = uniCloud.database();//打开链接
const collection = db.collection('money');//指定表
exports.main = async (event, context) => {
	event['date'] = new Date().toISOString();
	//event为客户端上传的参数
	console.log('传入event : ' + event);
	let res = await collection.add(event);
	//返回数据给客户端
	console.log('返回res : ' + res);
	return res;
};
