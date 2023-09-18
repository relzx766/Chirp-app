import Vuex from 'vuex'
import Vue from "vue";
import websocketLink from './websocket.config';
import {getToken} from '@/util/tools';

Vue.use(Vuex);


const store = new Vuex.Store({
    state: {
        ws: null,
        message: [],
        msgCount: 0,
        user: {}
    },
    getters: {
        getMessage: state => {
            let messages = structuredClone(state.message);
            if (!messages) {
                messages = [];
            }
            return messages;
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
                            item.entity = JSON.parse(item.entity);
                            item.entity.mediaKeys = JSON.parse(item.entity.mediaKeys);
                        }
                        state.message.unshift(item);
                        state.msgCount++;
                    })
                },
                onerror: err => {
                    console.log("websocket连接出错\n", err);
                }
            });
            state.ws.start();
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