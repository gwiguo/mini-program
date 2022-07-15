<template>
	<view class="comments_item">		
		<van-divider v-if="item.replys.length" />		
		<view class="comments_header">
			<van-image height="40" width="40" round  :src="item.author.avatar" style="margin-right: 15px;"/>
			<view class="comments_header_info">
				<view>{{ item.author.author_name }}</view>
				<view style="color: #999;">{{ item.create_time }}</view>
			</view>
		</view>
		<view class="comments_text">
			{{ item.comment_content }}
		</view>
		<view class="comments_reply_btn">
			<van-button plain color="#999" size="mini" round @tap="commentReply(item)">回复</van-button>
		</view>
		<!-- 回复 -->
		<view v-if="item.replys.length" style="padding: 20px 20px 0 20px;margin-top:10px;border: 1px solid #eee;">
			<comments-box v-for="replyItem in item.replys" :key="replyItem.comment_id" :item="replyItem"></comments-box>
		</view>
		
	</view>
</template>

<script>
	import commentsBox from "@/components/comments-box/comments-box.vue"
	export default {
		name:"comments-box",
		components:{
			commentsBox
		},
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
		},
		methods:{
			commentReply(commentItem){
				this.$emit("reply",commentItem);
			}			
		},
	}
</script>

<style lang="scss">
.comments_item{
	margin-bottom: 20px;
	.comments_header{
		display: flex;
		height: 50px;
		.comments_header_info{
			display: flex;
			flex-direction: column;
			justify-content: space-between;			
		}
	}
	.comments_text{
		margin: 20px 0;
	}
}
</style>