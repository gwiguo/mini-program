'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const {
		article_id,
		user_id
	} = event;
	
	let user_info = await db.collection("user").doc(user_id).get();
	let thumbs_up_article_ids = user_info.data[0].thumbs_up_article_ids;
	
	let article_info = await db.collection("article").doc(article_id).get();
	let thumbs_up_count = article_info.data[0].thumbs_up_count;
	
	// 用户的点赞列表中push该article_id
	await db.collection("user").doc(user_id).update({
		thumbs_up_article_ids:dbCmd.push(article_id)
	});
	// 对应的文章中浏览次数+1
	await db.collection("article").doc(article_id).update({
		thumbs_up_count:++thumbs_up_count
	});
	
	//返回数据给客户端		
	return {
		code:200,
		data:[]
	}
};
