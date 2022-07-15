<template>
	<view class="follow_container">
		<van-tabs animated swipeable type="card" color="#f07373" :active="tab_active" @change="tab_active_change">
			<van-tab title="文章" name="文章">
				<scroll-view scroll-y="true" @scrolltolower="scrolltolower" style="height: 100%;">
					<van-card 
						v-for="(articleItem,index) in article_list"
						lazy-load 
						class="article_item" 
						:key="index"
					>
						<view slot="thumb">
							<image 
								:src="articleItem.cover[0]||'https://img.yzcdn.cn/vant/cat.jpeg'" 
								mode="aspectFill" 
								@tap="toArticleDetail(articleItem)"
								style="width: 88px;height: 88px;"
							></image>
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
					<uni-load-more iconType="snow" v-if="article_list.length === 0 && !is_show_data" :status="item_loading ? 'loading':'noMore'"></uni-load-more>
					<van-empty
						v-if="is_show_data"
						image="https://img.yzcdn.cn/vant/custom-empty-image.png"
						description="暂无关注~"
					/>
				</scroll-view>
			</van-tab>
			<van-tab title="作者" name="作者">
				<follow-author-list v-for="(item,index) in author_list" :item="item" :key="index"></follow-author-list>
			</van-tab>
		</van-tabs>

	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import like from "@/components/like/like.vue"
	import followAuthorList from '@/components/follow-author-list/follow-author-list.vue'
	
	export default {
		components:{
			uniLoadMore,
			like,
			followAuthorList
		},
		data() {
			return {
				cache_data:{
					文章:[],
					作者:[]
				},
				article_list: [],
				author_list: [],
				tab_active:'文章',
				page:1,
				size:10,
				item_loading:true,
				is_show_data:false
			};
		},
		onLoad(){
			// get_follow();
			this.init();
		},
		created(){
			uni.$on("update_follow",this.get_follow);
		},
		methods: {
			async init (){
				await this.get_follow();
			},
			tab_active_change(e) {
				this.tab_active = e.detail.name;
				this.page = 1;
				this.pageSize = 10;
				this.item_loading = true;
				// if (!Object.keys(this.cache_data).includes(e.detail.name)) {				
				// }
				if(this.tab_active == '文章' && !this.article_list.length){
					this.get_follow();
				}else if(this.tab_active == '作者' && !this.author_list.length){
					this.get_follow();
				}
				
			},
			get_follow(type) {
				uni.showLoading({
					title:'加载中...'
				})
				return new Promise((resolve,reject)=>{
					
					this.$ajax({
						name: "get_follow",
						data: {
							pageSize: this.pageSize,
							page: this.page,
							tab:this.tab_active
						}
					}).then(res => {
						if (res.code == 200) {
							// console.log(res.data);
							if (res.data.length < 10) {
								this.item_loading = false;	
							}
							if(this.tab_active == '文章'){
								this.article_list = res.data;
							}else if(this.tab_active == '作者'){
								this.author_list = res.data;
							}
							// if (type && type == 'push') {
							// 	this.cache_data[this.tab_active] = this.cache_data[this.tab_active].concat(res.data);
							// } else {
							// 	this.cache_data[this.tab_active] = res.data;
							// }							
							this.is_show_data = res.data.length === 0 ? true : false;
							// console.log(this.cache_data);
							resolve();
						} else {
							reject();
							console.log(res);
							uni.showToast({
								title: "数据库连接超时",
								icon: 'error'
							})
						}
					}).catch(err => {
						reject();
						console.log(err);
						uni.showToast({
							title: "数据库连接超时",
							icon: 'error'
						})
					}).finally(()=>{
						uni.hideLoading()
					})
					
				})
			},
			scrolltolower() {
				this.page++;
				this.get_follow('push');
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
			stringify(json){
				return JSON.stringify(json)
			},
		},
	}
</script>

<style lang="scss">
page {
	height: 100%;
}
.follow_container {
	display: flex;
	flex-direction: column;
	padding-top: 20px;
	height: 100%;
	van-tabs{
	}
	.van-tabs{	
	}
	van-tab {
		margin-top: 16px;
	}

	.van-tabs__nav {
		padding: 0;
	}
	
	.article_item {
		.right_content {
			background-color: #f66;
		}
		.article_item_title {
			position: relative;
			padding-right: 30px;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			line-height: 24px;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			font-size: 16px;
		}
	}
}
</style>
