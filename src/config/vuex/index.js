import Vue from "vue";
import Vuex from "vuex";
import chat from "@/config/vuex/module/chat";
import e2ee from "@/config/vuex/module/e2ee";
import notice from "@/config/vuex/module/notice";
import setting from "@/config/vuex/module/setting";
import user from "@/config/vuex/module/user";
import ws from "@/config/vuex/module/ws";

Vue.use(Vuex);
export default new Vuex.Store({
    modules:{
        chat,e2ee,notice,setting,user,ws
    }
})