'use strict';
const db = uniCloud.database();
const [ $,dbCmd] = [db.command.aggregate,db.command];
exports.main = async (event, context) => {
	const {
		user_id,
		article_id,
		content,
		// 评论ID
		comment_id
	} = event;
	
	let userInfo = await db.collection("user").doc(user_id).get();
	userInfo = userInfo.data[0];
	const article = await db.collection("article").doc(article_id).get();
	const comments = article.data[0].comments;
	
	let commentObj = {
		comment_id: genID(),
		comment_content:content,
		create_time:new Date().getTime(),
		author:{
			author_id:userInfo._id,
			author_name:userInfo.author_name,
			avatar:userInfo.avatar,
			professional:userInfo.professional			
		},
		replys:[]
	}
	
	// 回复文章
	if(comment_id == undefined){
		commentObj.replys = [];
		commentObj = dbCmd.unshift(commentObj);
		
	}else{
		// 回复评论
		// 获取需要回复的评论在全部评论中的位置
		let commentIndex = comments.findIndex(item=>item.comment_id==comment_id);
		// 获取作者信息
		let commentAuthor = comments.find(item=>item.comment_id==comment_id);
		commentAuthor = commentAuthor.author.author_name;
		commentObj.to = commentAuthor;
		// 更新回复信息
		commentObj = {
			[commentIndex]:{
				replys:dbCmd.unshift(commentObj)
			}
		}
	}
		
	await db.collection("article").doc(article_id).update({
		comments:commentObj
	});
			
	return {
		code:200,
		data:[]
	}
};

function genID(){
	return Number(Math.random().toString().substr(3,5)+Date.now()).toString(36)
}
