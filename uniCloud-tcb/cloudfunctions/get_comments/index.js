'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	const {
		article_id
	} = event;
	
	const res = await db.collection("article").doc(article_id).field({comments:true}).get();
	
	//返回数据给客户端
		
	return {
		code:200,
		data:res.data[0].comments || []
	}
};
