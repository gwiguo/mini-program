<template>
	<view>		
		<van-icon class="icon" :color="is_like?'#f07373':''" :name="is_like ? 'like' : 'like-o'" @click.stop="likeTap"/>
	</view>
</template>

<script>
	export default {
		name:"like",			
		props:{
			cardItem:{
				type:Object
			}
		},
		data() {
			return {
				is_like:false
			};
		},
		watch:{
			cardItem(newV){
				this.is_like = newV.is_like;
			}
		},
		created(){
			this.is_like = this.cardItem.is_like;
		},
		methods:{
			likeTap(){					
				const that = this;
				uni.showLoading({
					title:'加载中...'					
				});
				this.$ajax({
					name:"update_like",
					data:{
						article_id:this.cardItem._id
					}
				}).then(res=>{
					if(res.code == 200){
						// uni.showToast({
						// 	title:this.is_like ? '取消收藏':'收藏成功',
						// 	duration:2000,
						// 	success(){								
						// 		that.is_like = !that.is_like;
						// 		uni.$emit("update_like");
						// 		uni.$emit("update_follow");								
						// 	}
						// });
						uni.$emit("update_like");
						uni.$emit("update_follow");
							// this.is_like = !this.is_like;	
						setTimeout(()=>{						
						},3000)
					}
				}).finally(()=>{
					// uni.hideLoading();
				})
			}
		}
	}
</script>

<style lang="scss">	
.icon{
	position: absolute;
	top: 0;
	right: 0;
	font-size:24px;
}
</style>