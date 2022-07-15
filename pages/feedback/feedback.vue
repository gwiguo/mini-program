<template>
	<view class="feedback_container">
		<view class="input_container">
			<view style="margin-bottom: 10px;">意见反馈</view>
			<van-field
				:value="feedback_text"
				type="textarea"
				:autosize="{maxHeight:200,minHeight: 200}"
				placeholder="请输入您要反馈的问题"
				size="large"
				@input="input_text"
			>
			</van-field>			
		</view>
		<view class="image_container">
			<view style="margin-bottom: 10px;">反馈图片</view>
			<van-uploader
				:file-list="fileList"
				max-count="5"
				multiple
				@after-read="afterRead"
				@delete="deleteImg"
			></van-uploader>
		</view>
		<view>
			<van-button type="primary" size="large" @click="submit" :disabled="isDisabledSubmitBtn">提交反馈意见</van-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				feedback_text:"",
				fileList:[],
				submitLoading:false
			}
		},
		methods: {
			afterRead(event){
				const { file } = event.detail;
				file.forEach(obj=>{
					this.fileList.push({
						url:obj.url
					});							
				})	
			},
			input_text(e){
				this.feedback_text = e.detail;				
			},
			async submit(){
				this.submitLoading = true;
				uni.showLoading({
					title:"上传中..."
				})
				
				const uploadTask = this.fileList.map(file => this.uploadFilePromise(file.url));
				
				if(uploadTask.length){
					// 需要上传图片
					Promise.all(uploadTask).then(async res=>{	
						// 腾讯云需要从另一个接口中通过fileID拿到刚刚已上传图片的地址
						const tempRes = await this.getTempFileURL(res.map(o=>o.fileID));
						
						const tempFileAdressList = tempRes.fileList.map(o=>o.tempFileURL);		
						
						this.$ajax({
							name:"insert_feedback",
							data:{
								feedBackContent:this.feedback_text,
								feedBackImgs:tempFileAdressList
							}
						}).then(res=>{			
							uni.hideLoading();	
							uni.showToast({
								title:'反馈成功~',
								icon:'none'
							})
							
							this.fileList = [];
							this.feedback_text = "";
							this.submitLoading = false;	
						}).catch(()=>{
							uni.showToast({
								title:'反馈失败',
								icon:'error'
							})		
							this.submitLoading = false;					
						})	
					})
					.catch(e => {
						console.log(e);
					});						
				}else{
					// 只上传文字
					this.$ajax({
						name:"insert_feedback",
						data:{
							feedBackContent:this.feedback_text,
							feedBackImgs:[]
						}
					}).then(res=>{			
						uni.hideLoading();	
						uni.showToast({
							title:'反馈成功~',
							icon:'none'
						})
							
						this.fileList = [];
						this.feedback_text = "";
						this.submitLoading = false;	
					}).catch(()=>{
						uni.showToast({
							title:'反馈失败',
							icon:'error'
						})		
						this.submitLoading = false;					
					})	
				}
								
			},
			uploadFilePromise(filePath){
				return uniCloud.uploadFile({
					filePath,
					cloudPath:`${Math.random().toString().substr(2)}${/(\..*)$/.exec(filePath)[1]}`
				})
			},
			getTempFileURL(fileList){
				return new Promise((resolve,reject)=>{					
					uniCloud.getTempFileURL({
						fileList
					})
					.then(res => {
						resolve(res);
					});
				}).catch(()=>{
					reject();
				})
			},
			deleteImg(e){
				const imgIndex = e.detail.index;
				this.fileList.splice(imgIndex,1);
			}
		},
		computed:{
			isDisabledSubmitBtn(){
				if(this.submitLoading) return true;
				else if(this.fileList.length != 0) return false;
				else if(this.feedback_text.trim().length != 0 ) return false;
				else return true;
			}
		}
	}
</script>

<style lang="scss">
.feedback_container{
	padding: 20px 16px;
	.input_container{
		margin-bottom: 20px;
		.van-cell{
			border: 1px solid #eee;
		}		
	}
	.image_container{
		margin-bottom: 20px;
	}
}
</style>
