import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from "@/views/Index.vue";
import Home from "@/views/home/Home.vue";
import Chirper from "@/views/chirper/Chirper.vue";
import Profile from "@/views/profile/Profile.vue";
import Message from "@/views/message/Message.vue";
import Notice from "@/views/notice/Notice.vue";
import Search from "@/views/search/Search.vue";
import Explore from "@/views/explore/Explore.vue";
import {Loading} from "element-ui";
import ChatSetting from "@/views/message/ChatSetting.vue";
import ChatCard from "@/views/message/ChatCard.vue";

Vue.use(VueRouter)

// 解决vue-router在3.0版本以上重复报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const routes = [
    {
        path: '/',
        name: 'index',
        component: Index,
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: Home
            },
            {
                path: '/chirper/detail',
                component: Chirper
            },
            {
                path: '/profile',
                component: Profile
            },
            {
                path: '/message',
                component: Message,
                children: [
                    {
                        path: 'setting',
                        component: ChatSetting
                    },
                    {
                        path:'chat/:id',
                        component: ChatCard
                    }
                ]
            },
            {
                path: '/notice',
                component: Notice
            },
            {
                path: '/search',
                component: Search
            },
            {
                path: '/explore',
                component: Explore
            }
        ]
    },
]

const router = new VueRouter({
    mode: "history",
    routes
})

export default router
