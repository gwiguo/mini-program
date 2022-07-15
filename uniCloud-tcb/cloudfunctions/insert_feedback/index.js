'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
const $ = db.command.aggregate;

exports.main = async (event, context) => {
	const {
		user_id,
		feedBackImgs = [],
		feedBackContent
	} = event;
		
	const res = await db.collection("feedback").add({
		user_id,
		feedBackImgs,
		feedBackContent
	});
		
	//返回数据给客户端
	return {
		code:200,
		data:[]
	}
};
