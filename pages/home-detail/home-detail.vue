<template>
	<view class="detail_container">
		<view class="title">{{ formData.title }}</view>
		<view class="header">
			<view class="avatar">
				<van-image :src="formData.author.avatar" fit="fill" round width="50" height="50"></van-image>
			</view>
			<view class="header_info">
				<view style="flex:1;">
					{{ formData.author.author_name }}
					<van-button 
						size="mini" 
						round 
						custom-style="margin-left:10px;border-radius:5px;color:#FFF;background:#f07373;"
						@click="follow_author"
					> {{ formData.is_like_author ? '取消关注' : '关注' }} </van-button>
				</view>
				<view style="display: flex;color: #bbb;justify-content: space-between;flex: 1;width: 100%;">
					<view>
						{{ formData.create_time }}	
					</view>
					<view>	{{ formData.browse_count }} 浏览 </view>
					<view>{{ formData.thumbs_up_count }} 赞 </view>
				</view>
			</view>
		</view>
		<!-- 文章内容区域 -->
		<scroll-view class="detail_content" scroll-y="true">
			<u-parse :content="formData.content" :noData="noData"></u-parse>
		</scroll-view>
		<!-- 文章内容区域 -->
		
		<!-- 评论区域 -->
		<view class="comments_container">
			<view> 最新评论	</view>			
			<comments-box v-for="(item,index) in commentList" :key="index" :item="item" @reply="reply"></comments-box>
		</view>
		<!-- 评论区域 -->
		
		<!-- 吸底区域 -->
		<view class="bottom_tools_container">
			<view class="">
				<van-search
				  placeholder="谈谈您的看法"
				  use-left-icon-slot
				  use-right-icon-slot	
				  class="input_opinion"
				  @tap="comment_popur=true;"
				  readonly
				>
					<text slot="left-icon"></text>					
					<van-icon name="records" slot="right-icon" size="20px"></van-icon>					
				</van-search>
			</view>
			<view class="btns">
				<!-- <van-icon name="comment-o" size="24px"></van-icon>	 -->
				<van-icon :name="is_like ? 'like' : 'like-o'" color="#f07373" size="24px" @tap="update_like"/>
				<van-icon 
					:color="is_thumbs_up ? '#f07373':''" 
					:name="is_thumbs_up ? 'good-job' : 'good-job-o'" 
					size="24px"
					@tap="update_thumb_up"					
				/>				
			</view>
		</view>
		<!-- 吸底区域 -->
		
		<!-- 发布评论的弹窗区域 -->
		<van-popup
			:show="comment_popur"
			round
			position="bottom"
			custom-style="height: 360px;"
			close-icon-position="top-left"
			@close="comment_popur_close"
		>		
			<view style="text-align: right;margin:10px 10px 0 0;">
				<van-button 
					size="small" 
					type="info" 
					@click="submit_comment" 
					:loading="comment_submit_loading" 
					loading-text="发布中..."
					loading-type="spinner"
					:disabled="!comment_text.length || !comment_text.trim().length"
				>发布</van-button>				
			</view>
			<van-divider />
			<van-field
				:value="comment_text"
				type="textarea"
				:autosize="{maxHeight:200,minHeight: 200}"
				placeholder="请输入"
				size="large"
				maxlength="200"
				show-word-limit	
				@input="input_comment"
			>
			</van-field>
		</van-popup>		
		<!-- 发布评论的弹窗区域 -->
	</view>
</template>

<script>
	import like from "../../components/like/like.vue"
	import uParse from "../../components/gaoyia-parse2/parse.vue"	
	// import mpHtml from "../../components/mp-html/mp-html.vue"
	import commentsBox from "../../components/comments-box/comments-box.vue"
	
	export default {		
		components:{
			like,
			uParse,
			commentsBox,
			// mpHtml
		},
		onLoad(options){
			const  { params } = options;
			this.formData = JSON.parse(params);
			
			// this.is_like = this.formData.is_like;
			this.is_thumbs_up = this.formData.is_thumbs_up;
			
			// 获取文章内容
			this.init();
			
			// 获取文章评论
			this.get_comments();
			
		},
		data() {
			return {
				formData:{},
				comment_popur:false,
				comment_text:"",
				comment_submit_loading:false,				
				noData:"<p style='text-align:center;color:#666;'>文章加载中...<p>",
				commentList:[],
				replyFormData:{},
				is_like:false,
				is_thumbs_up:false,
				is_show_article_content:false
			}
		},
		methods: {
			comment_popur_close(){
				this.comment_popur = false;
			},
			input_comment(e){
				this.comment_text = e.detail;
			},
			submit_comment(){
				this.comment_submit_loading = true;
				const data = {					
					article_id:this.formData._id,
					content:this.comment_text,
					...this.replyFormData
				}
				this.$ajax({
					name:"update_comment",
					data
				}).then(res=>{
					if(res.code == 200){
						this.get_comments();
						uni.showToast({
							title:"评论成功"
						});
						this.comment_popur = false;
						this.comment_text = "";
					}else{						
						uni.showToast({
							title:"评论失败",
							icon:"error"
						});
					}
				}).catch(()=>{				
					uni.showToast({
						title:"评论失败",
						icon:"error"
					});					
				}).finally(()=>{
					this.comment_submit_loading = false;
				})
			},
			get_comments(){
				this.$ajax({
					name:"get_comments",
					data:{
						article_id:this.formData._id
					}
				}).then(res=>{
					if(res.code == 200){
						this.commentList = res.data;				
					}
				}).catch(()=>{				
					uni.showToast({
						title:"获取评论失败",
						icon:"error"
					});					
				});
			},
			reply(commentItem){
				this.replyFormData = {
					comment_id:commentItem.comment_id
				}
				this.comment_popur = true;				
			},
			follow_author(){
				uni.showLoading();
				this.$ajax({
					name:"update_author",
					data:{
						author_id:this.formData.author.id
					}
				}).then(async res=>{
					if(res.code == 200){
						await this.get_article_detail();
						uni.showToast({
							title: this.formData.is_like_author ? '关注成功' : '取消关注'
						});
						uni.$emit("update_follow")
					}else{
						uni.showToast({
							title:'关注失败',
							icon:"error"
						})						
					}
				}).catch(()=>{					
					uni.showToast({
						title:'关注失败',
						icon:"error"
					})	
				})
			},
			async init(){
				await this.get_article_detail();
			},
			get_article_detail(){
				return new Promise((reslove,reject)=>{
					uni.showLoading({
						title:"文章加载中..."
					});
					this.$ajax({
						name:"get_article_detail",
						data:{
							article_id:this.formData._id
						},
					}).then(res=>{
						if(res.code == 200){
							this.formData = res.data[0];
							this.is_show_article_content = true;
							this.is_like = this.formData.is_like_article;
							reslove();
						}else{
							reject();
						}
					}).catch(()=>{			
						uni.showToast({
							title:'数据库连接超时',
							icon:"error"
						})							
						reject();						
					}).finally(()=>{
						uni.hideLoading();
					});							
				});		
			},
			stringify(obj){
				return JSON.stringify(obj);
			},
			update_like(){				
				uni.showLoading({
					title:'加载中...'
				});
				this.$ajax({
					name:"update_like",
					data:{
						article_id:this.formData._id
					}
				}).then(res=>{
					if(res.code == 200){
						this.is_like = !this.is_like;
						uni.$emit("update_article");
						// uni.showToast({
						// 	title:this.is_like?'取消收藏':'收藏成功'
						// });
					}
				}).catch(()=>{				
					uni.showToast({
						title:'收藏失败',
						icon:"error"
					})						
				}).finally(()=>{
					uni.hideLoading();
				})				
			},
			update_thumb_up(){		
				// 点赞后不能取消
				if(this.is_thumbs_up === true) return;
				
				uni.showLoading({
					title:"加载中..."
				});
				this.$ajax({
					name:"update_thumb_up",
					data:{
						article_id:this.formData._id
					}
				}).then(res=>{
					if(res.code == 200){
						uni.showToast({
							title:'点赞成功'
						});
						this.is_thumbs_up= true;		
						this.get_article_detail();
					}
				}).catch(()=>{				
					uni.showToast({
						title:'点赞失败',
						icon:"error"
					})						
				}).finally(()=>{
					uni.hideLoading();
				})			
				
			},
		}
	}
</script>

<style lang="scss">
page{height: 100%;}
.detail_container{
	// display: flex;
	// flex-direction: column;	
	// height: 100%;
	padding: 0 20px 54px 20px;
	.title{
		padding-top: 20px;
		margin-bottom: 20px;
		font-size: 20px;
		font-weight: bold;
	}
	.header{
		margin:20px 0;
		display: flex;
		justify-content: space-between;
		.header_info{
			display: flex;
			flex-direction: column;
			flex: 1;
			align-items: baseline;
			padding: 0 10px 0 20px;
		}
	}
	.detail_content{
		flex: 1;
		margin-bottom: 20px;
	}
	.bottom_tools_container{
		display: flex;
		position: fixed;
		bottom: 0;
		padding-bottom: 20px;
		width: calc(100% - 20px);
		background-color: #fff;
		.input_opinion{
			.van-search{
				width: 200px;				
			}
		}
		.btns{
			flex:1;
			display: flex;
			justify-content: space-around;
		}
	}
}
</style>
