import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import jsonBig from 'json-bigint'
import store from "@/config/vuex/index";
import waterfall from 'vue-waterfall2';
import Video from "video.js";
import "video.js/dist/video-js.min.css"
import xss from 'xss';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/assets/css/text-style.css';
import '@/assets/css/el-custom.css';
Vue.prototype.xss = xss;
Vue.prototype.$video = Video

window.JSON = jsonBig
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(waterfall)


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
