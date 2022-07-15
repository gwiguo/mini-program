<template>
	<view class="scroll">
		<scroll-view scroll-y="true" class="list-scroll">
			<view v-for="n in 100" style="height: 50px;display: flex;align-items: center;justify-content: center;font-size: 24px;">{{n+1}}</view>
		</scroll-view>		
	</view>
</template>

<script>
	export default {
		name:"list-scroll",
		data() {
			return {
				
			};
		},
		created(){
			console.log(uni.getSystemInfoSync());
		}
	}
</script>

<style lang="scss">
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

</style>