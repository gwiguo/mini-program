'use strict';
const db = uniCloud.database();
// 定义聚合的操作符
const $ = db.command.aggregate;
exports.main = async (event, context) => {
  const {
	classify,
    user_id,
    page = 1,
    pageSize = 10
  } = event;
  let matchObj = {};
  if (classify !== '全部') {
    matchObj = {
      classify: classify
    }
  }
  let article_likes_ids = []
  let userinfo = await db.collection('user').doc(user_id).field({
    "article_likes_ids": true,
    "author_likes_ids": true,
    "thumbs_up_article_ids": true,
  }).get();
  userinfo = userinfo.data[0];

  // 使用聚合
  // 聚合 ： 更精细化的去处理数据 求和 、分组、指定那些字段
  const list = await db.collection('article')
    .aggregate()
    // 追加字段
    .addFields({
		// 是否关注这篇文章
		is_like: $.in(['$_id', userinfo.article_likes_ids]),		
		is_like_author: $.in(['$author.id',userinfo.author_likes_ids]),		
		is_thumbs_up: $.in(['$_id',userinfo.thumbs_up_article_ids])	
    })
    .match(matchObj)
    .project({
      content: 0,
	  comments:0	  
    })
    //  分页加载
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .end()
	
  //返回数据给客户端
  return {
    code: 200,
    msg: '数据请求成功',
    data: list.data
  }
};