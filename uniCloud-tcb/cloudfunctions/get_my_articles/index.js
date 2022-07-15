'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
const $ = db.command.aggregate;

exports.main = async (event, context) => {
	const { 
		user_id
	} = event;
	
	let user_info = await db.collection("user").doc(user_id).get();
		user_info = user_info.data[0];
	
	const res = await db.collection("article")
				.aggregate()
				.addFields({
					is_like: $.in(["$_id",user_info.article_likes_ids]),		
					is_like_author: $.in(['$author.id',user_info.author_likes_ids]),		
					is_thumbs_up: $.in(['$_id',user_info.thumbs_up_article_ids])	
				}).match({
					id: dbCmd.in(user_info.article_ids)
				}).project({
					content:false,
					comments:false
				}).end();
	
	
	
	//返回数据给客户端
	return {
		code:200,
		data:res.data
	}
};
