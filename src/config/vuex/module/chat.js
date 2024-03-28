import {chatMutations} from "@/config/vuex/mutation-types";
import {chatActions, e2eeActions, userActions,} from "@/config/vuex/action-types";
import {
    getChatHistory,
    getChatIndexPage,
    getChatUnread,
    leaveConv,
    markAsDel,
    markConversationRead,
} from "@/api/advice";
import {doChatDecrypt, getOtherParticipantID} from "@/util/chatUtil";
import {getShareKey} from "@/util/encrypt";
import {chatTypeEnums, messageStatusEnums} from "@/enums/enums";

export default {
    namespaced: true,
    state: {
        record: {
            /* key: { conversation: "",
                    messages: [],
                    unread: 0,
                    reading: false,
                    date:timestamp,
                    bottom:false,
                    page:1}*/
        },
        reply: null,
        count: 0,
        unread: 0,
        reading: "",
        shareKeys: {},
        existsMap: new Map(),
        advice: [],
    },
    mutations: {
        [chatMutations.ADD_CHAT_RECORD](state, {chat, isNew}) {
            //按照渲染顺序排序
            if (isNew) {
                state.record[chat.conversationId].messages.push(chat);
                state.record[chat.conversationId].date = new Date(
                    chat.createTime
                ).getTime();
            } else {
                state.record[chat.conversationId].messages.unshift(chat);
            }
        },
        [chatMutations.SET_CHAT_SHARE_KEY](state, {conversation, shareKey}) {
            state.shareKeys[conversation] = shareKey;
        },
        [chatMutations.INCREASE_CHAT_PAGE](state, {conversation, page}) {
            state.record[conversation].page += page;
        },
        [chatMutations.INCREASE_CHAT_UNREAD](state, {unread}) {
            state.unread += unread;
        },
        [chatMutations.INCREASE_CHAT_COUNT](state, {count}) {
            state.count += count;
        },
        [chatMutations.INCREASE_CONVERSATION_UNREAD](
            state,
            {conversation, unread}
        ) {
            state.record[conversation].unread += unread;
        },
        [chatMutations.SET_CHAT_READING](state, {reading}) {
            state.reading = reading;
        },
        [chatMutations.ADD_CHAT_EXISTS_RECORD](state, {key}) {
            state.existsMap.set(key, 1);
        },
        [chatMutations.ADD_CHAT_ADVICE](state, {chat}) {
            state.advice.push(chat);
        },
        [chatMutations.CLEAR_CHAT_ADVICE](state) {
            state.advice.splice(0, state.advice.length);
        },
        [chatMutations.MODIFY_TEMP_CHAT](state, {chat}) {
            if (
                chat.tempId &&
                state.record[chat.conversationId] &&
                state.record[chat.conversationId].messages
            ) {
                let index = state.record[chat.conversationId].messages.findIndex(
                    (message) => {
                        return message.tempId === chat.tempId;
                    }
                );
                if (index !== -1) {
                    state.record[chat.conversationId].messages.splice(index, 1);
                }
            }
        },
        [chatMutations.SET_CONVERSATION_UNREAD](state, {conversation, unread}) {
            state.record[conversation].unread = unread;
        },
        [chatMutations.INIT_CONVERSATION](state, {conversation}) {
            state.record[conversation] = {
                conversation: conversation,
                messages: [],
                unread: 0,
                date: new Date().getTime(),
                page: 1,
                reading: false,
                bottom: false,
            };
        },
        [chatMutations.SET_CHAT_LOAD_COMPLETE](state, {conversation, bottom}) {
            state.record[conversation].bottom = bottom;
        },
        [chatMutations.SET_CHAT_REPLY](state, {message}) {
            state.reply = structuredClone(message);
        },
        [chatMutations.DEL_CHAT_RECORD](state, {conversation, id}) {
            if (state.record[conversation].messages) {
                let index = state.record[conversation].messages.findIndex(
                    (message) => message.id === id
                );
                if (index !== -1) {
                    state.record[conversation].messages.splice(index, 1);
                }
            }
        },
        [chatMutations.CLEAR_CONVERSATION](state, {conversation}) {
            delete state.record[conversation];
        },
        [chatMutations.SET_CHAT_UNREAD](state, {unread}) {
            state.unread = unread;
        },
    },
    actions: {
        [chatActions.INIT_CHAT]({commit, dispatch, state, rootState}) {
            return getChatIndexPage()
                .then((res) => {
                    if (res.code === 200) {
                        return dispatch(chatActions.ADD_NEW_CHAT_RECORD, {
                            chats: res.data.record,
                        });
                    } else {
                        throw new Error(res.message);
                    }
                })
                .then(() => {
                    let conversations = Object.values(state.record).map(
                        (r) => r.conversation
                    );
                    getChatUnread(conversations).then((r) => {
                        if (r.code === 200) {
                            let record = r.data.record;
                            let unread = 0;
                            Object.keys(record).forEach((conversation) => {
                                unread += record[conversation];
                                commit(chatMutations.SET_CONVERSATION_UNREAD, {
                                    conversation,
                                    unread: record[conversation],
                                });
                            });
                            commit(chatMutations.SET_CHAT_UNREAD, {unread});
                        } else {
                            throw new Error(r.message);
                        }
                    });
                });
        },
        [chatActions.ADD_NEW_CHAT_RECORD](
            {commit, dispatch, state, rootState},
            {chats, isNew = false}
        ) {
            let unLoadPublicUserIds = [];
            let participants = new Set();
            chats.forEach((chat) => {
                let other = getOtherParticipantID(
                    chat.conversationId,
                    rootState.user.id
                );
                participants.add(other);
                if (!rootState.e2ee.publicKeys[other]) {
                    unLoadPublicUserIds.push(other);
                }
            });
            //加载所有参与者的信息
            return dispatch(
                `user/${userActions.FETCH_USER}`,
                {userIds: participants},
                {root: true}
            ).then(() => {
                return dispatch(
                    `e2ee/${e2eeActions.FETCH_PUBLIC_KEY}`,
                    {userIds: unLoadPublicUserIds},
                    {root: true}
                ).then(() => {
                    let count = 0;
                    let unreadMap = {};
                    let unread = 0;
                    let medias = [];
                    for (let chat of chats) {
                        let key = `${chat.conversationId}:${chat.id}`;
                        if (!state.existsMap.has(key)) {
                            commit(chatMutations.ADD_CHAT_EXISTS_RECORD, {key});
                            if (!state.record[chat.conversationId]) {
                                commit(chatMutations.INIT_CONVERSATION, {
                                    conversation: chat.conversationId,
                                });
                            }
                            commit(chatMutations.MODIFY_TEMP_CHAT, {chat});
                            let other = getOtherParticipantID(
                                chat.conversationId,
                                rootState.user.id
                            );
                            let shareKey = getShareKey(
                                rootState.e2ee.publicKeys[other],
                                rootState.e2ee.privateKey,
                                rootState.e2ee.prime
                            );
                            commit(chatMutations.SET_CHAT_SHARE_KEY, {
                                conversation: chat.conversationId,
                                shareKey,
                            });
                            chat = doChatDecrypt(chat, state.shareKeys[chat.conversationId]);
                            commit(chatMutations.ADD_CHAT_RECORD, {chat, isNew});
                            if (
                                (chat.type === chatTypeEnums.VIDEO ||
                                    chat.type === chatTypeEnums.IMAGE ||
                                    chat.type === chatTypeEnums.FILE) &&
                                chat.senderId !== chat.receiverId
                            ) {
                                medias.push(chat.content.id);
                            }
                            count++;
                            if (
                                chat.status === messageStatusEnums.UNREAD &&
                                state.reading !== chat.conversationId &&
                                chat.senderId !== rootState.user.id
                            ) {
                                unread++;
                                if (!unreadMap[chat.conversationId]) {
                                    unreadMap[chat.conversationId] = 1;
                                } else {
                                    unreadMap[chat.conversationId] += 1;
                                }
                                if (isNew) {
                                    commit(chatMutations.ADD_CHAT_ADVICE, {chat});
                                }
                            }
                        }
                    }
                    commit(chatMutations.INCREASE_CHAT_COUNT, {count});
                    commit(chatMutations.INCREASE_CHAT_UNREAD, {unread});
                    Object.keys(unreadMap).forEach((conversation) => {
                        commit(chatMutations.INCREASE_CONVERSATION_UNREAD, {
                            conversation,
                            unread: unreadMap[conversation],
                        });
                    });
                    return {chatList: chats, medias};
                });
            });
        },
        [chatActions.LOAD_CHAT_PAGE](
            {commit, state, dispatch},
            {conversation}
        ) {
            if (!state.record[conversation]) {
                commit(chatMutations.INIT_CONVERSATION, {conversation});
            }
            return getChatHistory(conversation, state.record[conversation].page).then(
                (res) => {
                    if (res.code === 200) {
                        let record = res.data.record;
                        dispatch(chatActions.ADD_NEW_CHAT_RECORD, {
                            chats: record,
                            isNew: false,
                        });
                        commit(chatMutations.INCREASE_CHAT_PAGE, {conversation, page: 1});
                        commit(chatMutations.SET_CHAT_LOAD_COMPLETE, {
                            conversation,
                            bottom: record.length <= 0,
                        });
                    } else {
                        throw new Error(res.message);
                    }
                }
            );
        },
        [chatActions.DELETE_CHAT_RECORD]({commit}, {conversation, id}) {
            commit(chatMutations.DEL_CHAT_RECORD, {conversation, id});
            return markAsDel(id);
        },
        [chatActions.LEAVE_CONVERSATION]({commit, state}, {conversation}) {
            let size = state.record[conversation].messages.length;
            commit(chatMutations.CLEAR_CONVERSATION, {conversation});
            commit(chatMutations.INCREASE_CHAT_COUNT, {count: -size});
            return leaveConv(conversation);
        },
        [chatActions.READ_CONVERSATION](
            {commit, state},
            {conversation, status = true}
        ) {
            if (status && state.record[conversation]) {
                let unread = state.record[conversation].unread;
                commit(chatMutations.SET_CONVERSATION_UNREAD, {
                    conversation,
                    unread: 0,
                });
                commit(chatMutations.INCREASE_CHAT_UNREAD, {unread: -unread});
                commit(chatMutations.SET_CHAT_READING, {reading: conversation});
                if (unread > 0) {
                    return markConversationRead([conversation]);
                }
            } else {
                commit(chatMutations.SET_CHAT_READING, {reading: ""});
            }
        },
    },
};
