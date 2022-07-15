import App from './App'
import { Ajax } from './common/request'
import Vue from 'vue'
import store from "./store/index.js"

Vue.prototype.$ajax= Ajax;
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    store,
	...App
})
app.$mount()