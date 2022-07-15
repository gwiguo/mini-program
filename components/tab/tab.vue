<template>
	<view class="tabs_container">
		<!-- <van-tabs swipeable animated class="tab_bar" :active="tab_active" @change="tab_active_change">		
			<van-icon slot="nav-right" name="setting-o" class="tab_setting_icon" />	
			<van-tab v-for="(o,index) in list" :key="index" :title="o.name">
				<view class="scroll">
					<scroll-view scroll-y="true" class="list-scroll">
						<view v-for="n in 100" style="height: 50px;display: flex;align-items: center;justify-content: center;font-size: 24px;">{{o.name}}</view>
					</scroll-view>		
				</view>
			</van-tab>
		</van-tabs>		 -->		
	</view>
</template>

<script>
	export default {
		name:"tab",
		props:{
			list:{
				type:Array,
				default(){
					return []
				}
			}
		},
		data() {
			return {
				tab_active:0,
			};
		},
		methods:{			
			tab_active_change(e){
				this.tab_active = e.detail;				
			},
		}
	}
</script>

<style lang="scss">
.tabs_container{
	display: flex;
	flex: 1;
	margin-bottom: 10px;
	.tab_bar{		
		// flex: 1;
		overflow: hidden;
		// width: 90%;
		.van-tab{
			padding: 0 10px;
			flex-basis:auto !important;
		}
	}	
	.tab_setting_icon{
		flex: 1;
		padding: 0 10px;
		font-size: 24px;
		view{
			flex: 1;
		}
		&::after{
			content: "";
			position: absolute;
			left: 0;
			top: 12px;
			bottom: 12px;
			width: 1px;
			background-color: #ccc;		
		}
	}
	.scroll{
		flex: 1;
		overflow: hidden;	
		box-sizing: border-box;
		// height: 100%;
		.list-scroll{
			height: 100%;
			display: flex;
			flex-direction: column;
		}
	}
}

</style>