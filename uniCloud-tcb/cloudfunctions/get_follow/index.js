'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
const $ = db.command.aggregate;

exports.main = async (event, context) => {
	const { 
		user_id,
		tab
	} = event;
	
	let res;
	
	if(tab == '文章'){
	
		let articleData = await db.collection("user").doc(user_id).field({article_likes_ids:true}).get();
		const article_likes_ids = articleData.data[0].article_likes_ids;
		
		let user_info = await db.collection('user').doc(user_id).field({
		  "article_likes_ids": true,
		  "author_likes_ids": true,
		  "thumbs_up_article_ids": true,
		}).get();
		user_info = user_info.data[0];
		
		res = await db.collection("article")
		.aggregate()
		.addFields({
			is_like:$.in(['$_id',user_info.article_likes_ids]),		
			is_like_author: $.in(['$author.id',user_info.author_likes_ids]),		
			is_thumbs_up: $.in(['$_id',user_info.thumbs_up_article_ids])
		})
		.project({
			content:0,
			comments:0
		})
		.match({
			is_like:true
		})
		.end();
		
	}else if(tab == '作者'){
		
		const user_info = await db.collection('user').doc(user_id).field({
						  "author_likes_ids": true
						}).get();
		const author_likes_ids = user_info.data[0].author_likes_ids;
		
		res = await db.collection("user")
		.aggregate()
		.addFields({
			is_like : $.in(['$id',author_likes_ids])
		})
		.match({
			is_like:true
		}).
		project({
			avatar:true,
			author_name:true,
			professional:true,
			fans_count:true,
			article_ids:true
		})
		.end();
				
		
	}
		
	//返回数据给客户端
	return {
		code:200,
		data:res.data
	}
};
