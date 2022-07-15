'use strict';
exports.main = async (event, context) => {
	const {
		user_id,
		article_id
	} = event;
	const db = uniCloud.database();
	const $ = db.command.aggregate;
	
	let userInfo = await db.collection("user").doc(user_id).get();
	userInfo = userInfo.data[0];
	
	const res = await db.collection("article")
	.aggregate()
	.addFields({
		// 是否关注作者
		is_like_author:$.in(['$author.id',userInfo.author_likes_ids]),
		// 是否关注这篇文章
		is_like_article:$.in(['$_id',userInfo.article_likes_ids]),
		// 是否点赞
		is_thumbs_up:$.in(['$_id',userInfo.thumbs_up_article_ids])		
	}).match({
		_id:article_id
	}).project({
		comments:0
	}).end();		
	
	return {
		code : 200,
		data:res.data
	}
};
