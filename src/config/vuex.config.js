import Vuex from 'vuex'
import Vue from "vue";
import websocketLink from './websocket.config';
import {getToken} from "@/util/tools";

Vue.use(Vuex);


const store = new Vuex.Store({
    state: {
        ws: null,
        message: {
            record: {
             /*   conversation: "",
                messages: [],
                unreadCount: 0,
                user: {},
                reading: false,
                page:1*/
            },

            isInit: false,
            count: 0,
            unRead: 0,
            filterMap: new Map(),
            //每个发送者都需要存储
            page: new Map()
        },
        notice: {
            record: {},
            isInit: false,
            count: 0,
            unRead: 0,
            unReadRecord: [],
            filterMap: new Map(),
            page: 1
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
        getUnReadNoticeCount: state => {
            return state.notice.unRead;
        },
        popFollowingUpdate: state => {
            return state.followingUpdate.record.splice(0, state.followingUpdate.record.length);
        },
        getNoticePage: state => {
            return state.notice.page;
        },
        getUnreadNoticeRecord: state => {
            return state.notice.unReadRecord;
        },
        getPrivateMessage: state => {
            return state.message;
        },
        getChatHistory: (state) => (conversationId) => {
            return state.message.record[conversationId];
        },
        getChatUnreadCount: state => {
            return state.message.unRead;
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
                    let notice = messages.NOTICE;
                    let chat = messages.CHAT;
                    console.log(messages)
                    if (notice && notice.length > 0) {
                        this.dispatch('pushNotice', {
                            payload: notice,
                            top: true
                        });
                    }
                    if (chat && chat.length > 0) {
                        this.dispatch('pushMessage', {
                            payload: chat,
                            top: true
                        })
                    }
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
        wsSend(state, payload) {
            state.ws.send(payload);
        },
        deleteMsgByType(state, type) {
            state.message[type] = [];
        },
        setUser(state, payload) {
            state.user = payload;
        },
        readAllNotice(state) {
            state.notice.unRead = 0;
        },
        addNotice(state, {payload, top}) {
            let messages = Array.from(payload);
            for (let i = 0; i < messages.length; i++) {
                let item = messages[i];
                if (state.notice.filterMap.has(item.id)) {
                    continue;
                } else {
                    state.notice.filterMap.set(item.id, 1);
                }
                if (!item.isRead) {
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
                            let key = `${item.event}${item.sonEntity.id}${state.notice.page}`;
                            //按照[推文id][事件]分类
                            if (!top) {
                                if (!state.notice.record[key]) {
                                    state.notice.record[key] = [];
                                }
                            } else {
                                let obj = {};
                                obj[key] = [];
                                state.notice.record = Object.assign(obj, state.notice.record);
                            }
                            //消息本身已是按时间排序，所以多条时使用push，才不会打乱
                            if (messages.length > 1) {
                                state.notice.record[key].push(item);
                            } else {
                                state.notice.record[key].unshift(item);
                            }
                        } else if (item.event === 'FOLLOW') {
                            let key = `${item.event}${item.receiverId}`;
                            if (!state.notice.record[key]) {
                                state.notice.record[key] = []
                            }
                            if (messages.length > 1) {
                                state.notice.record[key].push(item);
                            } else {
                                state.notice.record[key].unshift(item);
                            }
                        }
                        state.notice.count += 1;
                    }
                }

            }

        },
        setNoticeUnread(state, payload) {
            state.notice.unRead = payload;
        },
        setNoticePage(state, payload) {
            state.notice.page = payload;
        },
        incrementNoticePage(state) {
            state.notice.page++;
        },
        clearUnreadNotice(state) {
            state.notice.unReadRecord = [];
        },
        addPrivateMessage(state, {payload, top}) {
            let messages = Array.from(payload);
            for (let i = 0; i < messages.length; i++) {
                let item = messages[i];
                let key = item.conversationId;
                if (item.tempId && state.message.record[key] && state.message.record[key].messages) {
                    let index = state.message.record[key].messages.findIndex(message =>
                        message.tempId === item.tempId
                    );
                    if (index !== -1) {
                        state.message.record[key].messages.splice(index, 1);
                    }
                }
                if (state.message.filterMap.has(item.id)) {
                    continue;
                } else {
                    state.message.filterMap.set(item.id, 1);
                }
                if (!state.message.record[key]) {
                    state.message.record[key] = {
                        conversation: key,
                        messages: [],
                        unreadCount: 0,
                        user: {},
                        reading: false,
                        page:1
                    };
                }
                let user = state.user;
                switch (user.id) {
                    case item.senderId: {
                        state.message.record[key].user.id = item.receiverId;
                        state.message.record[key].user.smallAvatarUrl = item.receiverAvatar;
                        state.message.record[key].user.nickname = item.receiverName;
                    }
                        break;
                    case item.receiverId: {
                        state.message.record[key].user.id = item.senderId;
                        state.message.record[key].user.smallAvatarUrl = item.senderAvatar;
                        state.message.record[key].user.nickname = item.senderName;
                    }
                        break;
                    default : {
                        state.message.record[key].user = user;
                    }
                }
                if (top) {
                    state.message.record[key].messages.unshift(item);
                    if (!state.message.record[key].reading && item.status === 1 && state.user.id !== item.senderId) {
                        state.message.record[key].unreadCount++;
                        state.message.unRead++;
                    }
                } else {
                    state.message.record[key].messages.push(item);
                }
            }

            this.dispatch('addMessageCount', messages.length);
        },
        addMessageCount(state, count) {
            state.message.count += count;
        },
        initChatIndex(state, payload) {
            Object.keys(payload).forEach(key => {
                state.message.record[key] = {
                    conversation: key,
                    messages: [],
                    unreadCount: payload[key].unreadCount,
                    user: {},
                    reading: false,
                    page:1
                };
                state.message.unRead += payload[key].unreadCount;
                this.dispatch('pushMessage', {
                    payload: payload[key].data,
                    top: false
                })
            })
        },
        setConversationUnread(state, {conversation, count}) {
            if (state.message.record[conversation]) {
                let unread = state.message.record[conversation].unreadCount;
                state.message.record[conversation].unreadCount = count;
                state.message.unRead += count - unread;
            }
        },
        setConvReadStatus(state, {conversation, status}) {
            if (state.message.record[conversation]) {
                state.message.record[conversation].reading = status;
            }
        },
        setConvPage(state, {conversation, page}){
            state.message.record[conversation].page=page
        },
        addConversation(state, {conversation, user}) {
            if (!state.message.record[conversation]) {
                state.message.record[conversation] = {
                    conversation: conversation,
                    messages: [],
                    unreadCount: 0,
                    user: user,
                    reading: false,
                    page:1
                }
            }
        }

    },
    actions: {
        wsInit({commit}) {
            commit('websocketInit');
        },
        pushNotice({commit}, payload) {
            commit('addNotice', payload)
        },
        pushMessage({commit}, payload) {
            commit('addPrivateMessage', payload)
        },
        addMessageCount({commit}, count) {
            commit('addMessageCount', count);
        }
    }
})
export default store;
