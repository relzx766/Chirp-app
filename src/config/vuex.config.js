import Vuex from 'vuex'
import Vue from "vue";
import websocketLink from './websocket.config';
import {getToken} from '@/util/tools';

Vue.use(Vuex);


const store = new Vuex.Store({
    state: {
        ws: null,
        message: {},
        appendMessage: {},
        msgCount: 0,
        user: {}
    },
    getters: {
        getMessage: state => {
            return state.message;
        },
        getUser: state => {
            return state.user;
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
                    messages.forEach(item => {
                        if (item.entityType === 'CHIRPER') {
                            item.sonEntity = JSON.parse(item.sonEntity);
                            item.sonEntity.mediaKeys = JSON.parse(item.sonEntity.mediaKeys);
                            if (item.entity !== 'null') {
                                item.entity = JSON.parse(item.entity);
                                item.entity.mediaKeys = JSON.parse(item.entity.mediaKeys);
                            }
                            //按照[推文id][事件]分类
                            if (!state.message[item.sonEntity.id]) {
                                state.message[item.sonEntity.id] = {};
                            }
                            if (!state.message[item.sonEntity.id][item.event]) {
                                state.message[item.sonEntity.id][item.event] = []
                            }
                            //消息本身已是按时间排序，所以多条时使用push，才不会打乱
                            if (messages.length > 1) {
                                state.message[item.sonEntity.id][item.event].push(item);
                            } else {
                                state.message[item.sonEntity.id][item.event].unshift(item);
                            }
                        } else {
                            if (!state.message[item.event]) {
                                state.message[item.event] = [];
                            }
                            if (messages.length > 1) {
                                state.message[item.event].push(item);
                            } else {
                                state.message[item.event].unshift(item);
                            }
                        }
                        state.msgCount++;
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
        deleteMsgByType(state, type) {
            state.message[type] = [];
        },
        setUser(state, payload) {
            state.user = payload;
        }
    },
    actions: {
        wsInit({commit}) {
            commit('websocketInit');
        },

    }
})
export default store;
