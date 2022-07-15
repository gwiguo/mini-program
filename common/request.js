export const Ajax = (payload) =>{
	return new Promise((reslove,reject)=>{		
			const newPayload = payload;
			newPayload.data && (newPayload.data.user_id = "f6e08a6462cd56630c14e8ed67021386");
			uniCloud.callFunction(newPayload).then(res=>{					
				if(res.result.code == 200){
					reslove(res.result);
				}else{
					reject(res.result);
				}
			}).catch(err=>{
				reject(err);				
			})
	});
}