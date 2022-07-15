'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
const $ = db.command.aggregate;
exports.main = async (event, context) => {
	const { 
		user_id = "f6e08a6462cd56630c14e8ed67021386"
	} = event;
	const user_info = await db.collection("user").doc(user_id).field({
		avatar:true,
		author_name:true,
		fans_count:true,
		follow_count:true,
		integral_count:true
	}).get();
	console.log(user_info);
	
	
	
	//返回数据给客户端
	return {
		code:200,
		data:user_info.data
	}
};
