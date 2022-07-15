<script>
	export default {
		onLaunch: function() {
			// console.log('App Launch')
			this.$ajax({
				name:"get_user",
				data:{
					// user:""
				}
			}).then(res =>{
				if(res.code == 200){
					this.$store.commit("SET_USER_INFO",res.data[0]);
				}
			})
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}		
	}
</script>

<style>
	/*每个页面公共css */
    @import "/wxcomponents/vant/common/index.wxss";
	@import "/components/gaoyia-parse2/parse.css"
</style>
