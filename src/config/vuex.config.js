import Vuex from 'vuex'
import Vue from "vue";
import websocketLink from './websocket.config';
import {getToken} from '@/util/tools';

Vue.use(Vuex);


const store = new Vuex.Store({
    state: {
        ws: null,
        message: {
            record:{},
            isInit:false,
            count:0,
            unRead:0
        },
        notice: {
            record: {},
            isInit: false,
            count: 0,
            unRead:0,
            unReadRecord:[],
            page:1
        },
        followingUpdate: {
            record: [],
            count: 0
        },
        msgCount: 0,
        user: {}
    },
    getters: {
        getMessage: state => {
            return state.message;
        },
        getUser: state => {
            return state.user;
        },
        getNotice: state => {
            return state.notice.record;
        },
        getUnReadNoticeCount:state=>{
          return state.notice.unRead;
        },
        popFollowingUpdate: state => {
            return state.followingUpdate.record.splice(0, state.followingUpdate.record.length);
        },
        getNoticePage:state=>{
            return state.notice.page;
        },
        getUnreadNoticeRecord:state => {
            return state.notice.unReadRecord;
        }
    },
    mutations: {
        websocketInit(state) {
            let url = 'ws://localhost:8080/advice-service/interaction/' + getToken();
            state.ws = new websocketLink(url, {
                onopen: () => {
                    console.log("已与服务器建立websocket连接");
                },
                onmessage: e => {
                    let messages = JSON.parse(e.data);
                    this.dispatch('pushNotice',{
                        payload:messages,
                        top:true
                    });
                },
                onerror: err => {
                    console.log("websocket连接出错\n", err);
                }
            });
            state.ws.start();
        },
        websocketClose(state) {
            state.ws.close();
        },
        wsSend(state,payload){
          state.ws.send(payload);
        },
        deleteMsgByType(state, type) {
            state.message[type] = [];
        },
        setUser(state, payload) {
            state.user = payload;
        },
        readAllNotice(state){
            state.notice.unRead=0;
        },
        addNotice(state, {payload,top}){
            let messages=Array.from(payload);
                messages.forEach(item => {
                    if (!item.isRead){
                        state.notice.unReadRecord.push(item.id);
                        state.notice.unRead++;
                    }
                    if (item.entityType === 'CHIRPER' || item.entityType === 'USER') {
                        if (item.event === 'TWEETED') {
                            state.followingUpdate.record.unshift(item);
                            state.followingUpdate.count += 1;
                        } else {
                            if (item.entityType === 'CHIRPER') {
                                item.sonEntity = JSON.parse(item.sonEntity);
                                if (item.entity !== 'null') {
                                    item.entity = JSON.parse(item.entity);
                                }
                                //按照[推文id][事件]分类
                                if (!top) {
                                    if (!state.notice.record[item.sonEntity.id]) {
                                        state.notice.record[item.sonEntity.id] = {};
                                    }
                                } else {
                                    let obj = {};
                                    obj[item.sonEntity.id] = {};
                                    state.notice.record = Object.assign(obj, state.notice.record);
                                }
                                if (!state.notice.record[item.sonEntity.id][item.event]) {
                                    state.notice.record[item.sonEntity.id][item.event] = []
                                }
                                //消息本身已是按时间排序，所以多条时使用push，才不会打乱
                                if (messages.length > 1) {
                                    state.notice.record[item.sonEntity.id][item.event].push(item);
                                } else {
                                    state.notice.record[item.sonEntity.id][item.event].unshift(item);
                                }
                            } else if (item.event === 'FOLLOW') {
                                if (!state.notice.record[item.receiverId]) {
                                    state.notice.record[item.receiverId] = {}
                                }
                                if (!state.notice.record[item.receiverId][item.event]) {
                                    state.notice.record[item.receiverId][item.event] = [];
                                }
                                if (messages.length > 1) {
                                    state.notice.record[item.receiverId][item.event].push(item);
                                } else {
                                    state.notice.record[item.receiverId][item.event].unshift(item);
                                }
                            }
                            state.notice.count += 1;
                        }
                    }
                });
        },
        setNoticeUnread(state,payload){
            state.notice.unRead=payload;
        },
        setNoticePage(state,payload){
            state.notice.page=payload;
        },
        incrementNoticePage(state){
            state.notice.page++;
        },
        clearUnreadNotice(state){
            state.notice.unReadRecord=[];
        }

    },
    actions: {
        wsInit({commit}) {
            commit('websocketInit');
        },
        pushNotice({commit},payload){
            commit('addNotice',payload)
        }
    }
})
export default store;
