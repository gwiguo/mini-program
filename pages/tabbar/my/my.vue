<template>
	<view class="my_container">
		<view class="header_background">
			<image :src="user_info.avatar" mode="aspectFill"></image>
		</view>
		<view class="header_info">
			<view class="author_avatar">
				<van-image height="60" width="60" round fit="cover" :src="user_info.avatar"	use-error-slot use-loading-slot>					
					<van-icon slot="error" size="48" name="photo-fail" />
					<van-loading slot="loading" type="spinner" size="48" vertical />
				</van-image>
			</view>
			<view class="author_name">
				{{ user_info.author_name || '' }}
			</view>
			<view class="count_info">
				<view>
					<view>关注</view>
					<view>{{ user_info.follow_count || 0 }}</view>
				</view>
				<view>
					<view>粉丝</view>
					<view> {{ user_info.fans_count || 0 }} </view>
				</view>
				<view>
					<view>积分</view>
					<view>{{ user_info.integral_count || 0 }}</view>
				</view>
			</view>
		</view>
		<view class="my_articles" @tap="toMyArticles">
			<view class="text_info">
				<van-icon size="24" name="user-circle-o" style="margin-right: 10px;" />
				我的文章
			</view>
			<view>
				<van-icon size="24" name="arrow" />
			</view>			
		</view>
		<view class="feedback" @tap="toFeedBack">
			<view class="text_info">
				<van-icon size="24" name="question-o" style="margin-right: 10px;" />
				意见反馈
			</view>
			<view>
				<van-icon size="24" name="arrow" />
			</view>					
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(){
			
		},
		data() {
			return {
				user_info:this.$store.state.user_info
			};
		},
		mounted(){
		},
		methods:{
			get_user(){
				// uni.showLoading({
				// 	title:'加载中...'
				// });
				this.$ajax({
					name:"get_user",
					data:{
						// user:""
					}
				}).then(res =>{
					if(res.code == 200){
						this.user_info = res.data[0];
					}
				}).finally(()=>{
					uni.hideLoading()
				})
			},
			toMyArticles(){
				uni.navigateTo({
					url:"../../my-articles/my-articles"
				})
			},
			toFeedBack(){
				uni.navigateTo({
					url:"../../feedback/feedback"
				})
			},
		}
	}
</script>

<style lang="less">
page{height: 100%;}
.my_container{
	display: flex;
	flex-direction: column;
	position: relative;
	height: 100%;
	background-color: #f5f5f5;
	.header_background{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		filter: blur(8px);
		opacity: 0.3;
		height: 33%;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.header_info{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		height: 33%;
		.author_avatar{
			margin-top: 20px;
		}
		.author_name{
			font-size: 24px;
			font-weight: bold;
		}
		.count_info{
			display: flex;
			justify-content: space-around;
			width: 100%;
			color: #666;
		}		
	}
	.my_articles,.feedback{
		display: flex;
		justify-content: space-between;
		padding: 0 20px;
		margin-top: 20px;
		height: 60px;
		line-height: 60px;
		font-size: 18px;
		background-color: #fff;
		.text_info{
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}	
}
</style>
