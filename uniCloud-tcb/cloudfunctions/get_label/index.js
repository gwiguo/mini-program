'use strict';
exports.main = async (event, context) => {
	const dbJQL = uniCloud.databaseForJQL({
		event,context
	});
	
	dbJQL.setUser({
		uid:"596297735@qq.com",
		role:['admin']
	})
	const labelList = await dbJQL.collection('label').get();
	console.log(labelList.data);
		
	//返回数据给客户端		
	return {
		code:200,
		data:labelList.data
	}
};
