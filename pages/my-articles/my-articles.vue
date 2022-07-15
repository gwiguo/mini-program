<template>
	<view class="my_articles_container">
		<scroll-view scroll-y="true" style="height: 100%;">
			<van-card 
				v-for="(articleItem,index) in article_list"
				lazy-load 
				class="article_item" 
				:key="index"
			>
				<view slot="thumb">					
					<van-image height="88" width="88" fit="cover" :src="articleItem.cover[0]"	use-error-slot use-loading-slot	@tap="toArticleDetail(articleItem)">					
						<van-icon slot="error" size="48" name="photo-fail" />
						<van-loading slot="loading" type="spinner" size="48" vertical />
					</van-image>
				</view>
				<view slot="title" class="article_item_title">
					<view @tap="toArticleDetail(articleItem)"> {{articleItem.title}} </view>
					<like :cardItem="articleItem"></like>
				</view>
				<view slot="num" style="display: flex;justify-content: space-between;">
					<van-tag plain color="#f07373" round type="primary">{{articleItem.classify}}</van-tag>
					<text style="color: #bbb;">{{articleItem.browse_count}}浏览</text>
				</view>	 																
			</van-card>
			<van-empty
				v-if="is_show_data"
				image="https://img.yzcdn.cn/vant/custom-empty-image.png"
				description="暂无文章~"
			/>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				article_list:[],
				is_show_data:false,
				item_loading:false
			}
		},
		onLoad(){
			this.get_my_artilcles();
			uni.$on("update_like",this.get_my_artilcles);
		},
		methods: {			
			get_my_artilcles(){		
				uni.showLoading({
					title:'加载中...'
				})					
				this.$ajax({
					name: "get_my_articles",
					data: {
					}
				}).then(res => {
					if (res.code == 200) {
						// console.log(res.data);
						if (res.data.length < 10) {
							this.item_loading = false;	
						}
						this.article_list = res.data;			
						this.is_show_data = res.data.length === 0 ? true : false;
					} else {
						
						console.log(res);
						uni.showToast({
							title: "数据库连接超时",
							icon: 'error'
						})
					}
				}).catch(err => {
					
					console.log(err);
					uni.showToast({
						title: "数据库连接超时",
						icon: 'error'
					})
				}).finally(()=>{
					uni.hideLoading()
				})
			},
			toArticleDetail(articleItem){
				const params = {
					_id:articleItem._id,
					title:articleItem.title,
					create_time:articleItem.create_time,
					thumbs_up_count:articleItem.thumbs_up_count,
					browse_count:articleItem.browse_count,
					author:articleItem.author,
					is_like:articleItem.is_like,
					is_thumbs_up:articleItem.is_thumbs_up,
					is_like_author:articleItem.is_like_author
				}
				uni.navigateTo({
					url:"/pages/home-detail/home-detail?params="+JSON.stringify(params)
				})
			},
		}
	}
</script>

<style lang="scss">
.my_articles_container{
	padding: 20px 16px;
	.article_item_title{
		padding-right: 30px;
		font-size: 16px;
		line-height: 24px;
	}
}
</style>
