<template>
	<view class="follow-author-list">
		<view>
			<van-image use-loading-slot width="60" height="60" fit="cover" :src="item.avatar || 'https://img.yzcdn.cn/vant/cat.jpeg'">
				  <van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
		</view>
		<view class="info">
			<view> {{ item.author_name }} </view>
			<view class="title"> 
				<text style="color: #666;"> {{ item.professional }} </text>
				<view class="count">
					<view style="margin-right: 20px;" class="grey"> 发帖 {{ item.article_ids.length}} </view>
					<view class="grey"> 粉丝 {{ item.fans_count }} </view>					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"follow-author-list",
		props:{
			item:{
				type:Object,
				default(){
					return {}
				}
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.follow-author-list{
	display: flex;
	padding: 12px 16px;
	.info{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		flex: 1;
		padding: 0 10px;
	}
	.title{
		display: flex;		
		justify-content: space-between;
		.count{
			display: flex;
			.grey{
				color: #999;
			}
		}
	}
}
</style>