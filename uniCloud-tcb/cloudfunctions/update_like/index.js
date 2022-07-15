'use strict';
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const {
		article_id,
		user_id
	} = event;
	
	const dbCmd = db.command;
	let dbFuns = null;
	const userInfo = await db.collection('user').doc(user_id).get();
	const article_likes_ids = userInfo.data[0].article_likes_ids;
	
	if(article_likes_ids.includes(article_id)){
		dbFuns = dbCmd.pull(article_id)		
	}else{
		dbFuns = dbCmd.addToSet(article_id)
	}
	
	const res = await db.collection('user').doc(user_id).update({
		article_likes_ids:dbFuns
	});
	
	//返回数据给客户端		
	return {
		code : 200,
		data:null
	}
};
