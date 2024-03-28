import {wsMutations} from "@/config/vuex/mutation-types";
import {getToken} from "@/util/auth";
import {chatActions, noticeActions, wsActions} from "@/config/vuex/action-types";
import websocketLink from "@/config/websocket.config";
import {messageTypeEnums, wsConnectionStatus} from "@/enums/enums";

export default {
    namespaced: true,
    state: {
        connect: null,
        baseUrl: 'ws://localhost:8080/advice-service/interaction',
        url: '',
        status: wsConnectionStatus.CLOSE,
        messageQueue: []
    },
    mutations: {
        [wsMutations.SET_WS](state, {connect}) {
            state.connect = connect;
        },
        [wsMutations.SET_WS_URL](state, {url}) {
            state.url = url;
        },
        [wsMutations.SET_WS_STATUS](state, {status}) {
            state.status = status;
        },
        [wsMutations.PUSH_MSG_QUEUE](state, {message}) {
            state.messageQueue.push(message);
        },
        [wsMutations.SHIFT_MSG_QUEUE](state) {
            state.messageQueue.shift();
        }
    },
    actions: {
        [wsActions.INIT_WS]({commit, dispatch, state}) {
            if (getToken()) {
                commit(wsMutations.SET_WS_URL, {url: `${state.baseUrl}/${getToken()}`});
                let ws = new websocketLink(state.url, {
                    onopen: () => {
                        dispatch(wsActions.HANDLER_WS_OPEN);
                    },
                    onmessage: message => {
                        dispatch(wsActions.HANDLER_WS_MESSAGE, {message});
                    },
                    onerror: e => {
                        dispatch(wsActions.HANDLER_WS_ERROR, e);
                    },
                    onclose: () => {
                        dispatch(wsActions.HANDLER_WS_CLOSE);
                    },
                    onretry: () => {
                        dispatch(wsActions.HANDLER_WS_RECONNECT);
                    }
                });
                ws.start();
                commit(wsMutations.SET_WS, {connect: ws});
            } else {
                throw new Error('未登录');
            }
        },
        [wsActions.HANDLER_WS_OPEN]({commit}) {
            commit(wsMutations.SET_WS_STATUS, {status: wsConnectionStatus.OPEN});
        },
        [wsActions.HANDLER_WS_MESSAGE]({dispatch}, {message}) {
            let data = JSON.parse(message.data);
            let notices = data[messageTypeEnums.NOTICE]
            let chats = data[messageTypeEnums.CHAT];
            if (notices && notices.length > 0) {
                dispatch(`notice/${noticeActions.ADD_NEW_NOTICE_RECORD}`, {notices, isNew: true}, {root: true});
            }
            if (chats && chats.length > 0) {
                dispatch(`chat/${chatActions.ADD_NEW_CHAT_RECORD}`, {chats, isNew: true}, {root: true});
            }
        },
        [wsActions.HANDLER_WS_ERROR]({commit}, {e}) {
            commit(wsMutations.SET_WS_STATUS, {status: wsConnectionStatus.ERROR});
        },
        [wsActions.HANDLER_WS_CLOSE]({commit}) {
            commit(wsMutations.SET_WS_STATUS, {status: wsConnectionStatus.CLOSE});
        },
        [wsActions.HANDLER_WS_RECONNECT]({commit}) {
            commit(wsMutations.SET_WS_STATUS, {status: wsConnectionStatus.RETRY});
        },
        [wsActions.HANDLER_WS_SEND]({commit, state, dispatch}) {
            let length = state.messageQueue.length;
            for (let i = 0; i < length; i++) {
                let message = state.messageQueue[0];
                if (state.status === wsConnectionStatus.OPEN) {
                    state.connect.send(message);
                    commit(wsMutations.SHIFT_MSG_QUEUE);
                } else {
                    break;
                }
            }
        },
        [wsActions.COMMIT_MESSAGE]({commit, state, dispatch}, {message}) {
            commit(wsMutations.PUSH_MSG_QUEUE, {message});
            if (state.status !== wsConnectionStatus.OPEN) {
                return dispatch(wsActions.INIT_WS).then(() => {
                    return dispatch(wsActions.HANDLER_WS_SEND);
                });
            } else {
                return dispatch(wsActions.HANDLER_WS_SEND);
            }
        }
    }
}