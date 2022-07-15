import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

const store = new Vuex.Store({
	state:{
		historyList: uni.getStorageSync("__history") || [],
		user_info:uni.getStorageSync("__userInfo") || {}
	},
	mutations:{
		SET_HISTORY_LIST(state,history){
			state.historyList = Array.from(new Set((history||[])));
			uni.setStorageSync("__history",history);
		},
		SET_USER_INFO(state,userInfo){
			state.user_info = userInfo;
			uni.setStorageSync("__userInfo",userInfo);
		},
	},
	actions:{
		set_history({commit,state},history){
			const { historyList } = state;
			historyList.unshift(history);
			commit('SET_HISTORY_LIST',historyList);
		},
		set_user_info({commit,state},userInfo){
			const { user_info } = state;
			user_info.unshift(history);
			commit('SET_USER_INFO',user_info);
		},
	}
})

export default store;