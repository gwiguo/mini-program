<template>
	<view class="navbar">
		<van-search
			v-model="searchValue"
			shape="round"
			placeholder="前端 node"
			class="test"
			@tap="goSearchPage"
			@search="searchTap"
			@change="queryChange"
			@clear="clearQuery"
			ref="my-search"
			:readonly="search_readonly"			
		/>
	</view>
</template>

<script>
	
	export default {
		name:"navbar",
		data() {
			return {
				searchValue:"",
				status_bar_height:0,
				search_readonly:true,				
			};
		},
		created(){
			// const systemInfo = uni.getSystemInfoSync();
			// this.status_bar_height =  systemInfo.uniPlatform == 'mp-weixin' ? uni.getSystemInfoSync().statusBarHeight + 35 : uni.getSystemInfoSync().statusBarHeight;
		},
		methods:{
			goSearchPage(){
				const pageStack = getCurrentPages();
				const currentPageRoute = pageStack[pageStack.length-1].route;	
				if(currentPageRoute != 'pages/home-search/home-search'){
					uni.navigateTo({
						url:"/pages/home-search/home-search"
					})					
				}
			},
			searchTap(e){
				this.$emit("searchTap",e.detail);
			},
			queryChange(e){
				// if(e.detail && e.detail.trim()){
					clearTimeout(this.timer);
					this.timer = setTimeout(()=>{
						this.$emit("search",e.detail)
					},500);
				// }
			},
			clearQuery(){
				this.$emit('clear');
			}
		},
		mounted(){
			const pageStack = getCurrentPages();
			const currentPageRoute = pageStack[pageStack.length-1].route;	
			if(currentPageRoute == 'pages/home-search/home-search'){
				this.search_readonly = false;
			}	
		},
	}
</script>

<style lang="scss">		
.navbar{
	flex: 1;
	width: 100%;
	height: 45px;
	background-color: $mk-base-color;
	/deep/.custom-class{
		padding: 100px;
	}
	.test{
		.van-search__content{
			flex: none !important;
		}
	}
}
</style>