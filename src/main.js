import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import jsonBig from 'json-bigint'
import store from "@/config/vuex.config";
import waterfall from 'vue-waterfall2';
import Video from "video.js";
import "video.js/dist/video-js.min.css"
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import xss from 'xss';
// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.prototype.xss = xss;

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
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
