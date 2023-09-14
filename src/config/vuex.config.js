import Vuex from 'vuex'
import Vue from "vue";

Vue.use(Vuex);


const store = new Vuex.Store({
    state: {
        message: [],
        notice:{
        },
        msgCount:0,
        user:{}
    },
    getters: {
        //通知
        getNotice: state => {
            return state.notice;
        },
        getNoticeByType:(state)=>(type)=>{
            return state.notice[type];
        },
        //私信
        getMessage: state => {
            return state.message;
        },
        getUser:state => {
            return state.user;
        }
    },
    mutations: {
        pushMessage(state, message) {
            state.message.push(...message)
        },
        clearMessage(state){
            state.message.splice(0,state.message.length)
        },
        pushNotice(state, {notice, type}){
            if (!state.notice[type]){
                state.notice[type]=[]
            }
            state.notice[type].push(...notice)
            state.msgCount+=notice.length
        },
        delByArrAndTypeOfNotice(state, {notice, type}){
            state.notice[type]=state.notice[type].filter((n)=> notice.indexOf(n)===-1);
            state.msgCount-=notice.length;
        },
        clearNotice(state){
            state.notice={
            }
        },
        setUser(state,payload){
            state.user=payload;
        }
    }
})
export default store;