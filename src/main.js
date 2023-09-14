import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import jsonBig from 'json-bigint'
import store from "@/config/vuex.config";
import waterfall from 'vue-waterfall2'

window.JSON = jsonBig
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(waterfall)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
