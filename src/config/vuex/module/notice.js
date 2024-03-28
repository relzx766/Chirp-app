import {noticeEventEnums, noticeStatusEnums} from "@/enums/enums";
import {entityParse, generateUniqueKey, isChirpInteraction, isPersistNotice} from "@/util/noticeUtil";
import {noticeMutations} from "@/config/vuex/mutation-types";
import {noticeActions} from "@/config/vuex/action-types";
import {getPage, markAsRead} from "@/api/advice";

export default {
    namespaced: true,
    state: {
        //在线才会接收到的通知
        online: {
            TWEETED: [],
            counter: 0
        },
        //会被持久化的通知，即会在“通知”页显示
        persist: {
            record: {},
            count: 0,
            unread: 0,
            page: 1,
            bottom: false
        },
        existsMap: new Map()
    },
    mutations: {
        [noticeMutations.ADD_CHIRPER_NOTICE](state, {notice, isNew}) {
            let key = `${notice.sonEntity.id}:${notice.event}:${state.persist.page}`;
            console.log(key)
            if (!state.persist.record[key]) {
                state.persist.record[key] = [];
            }
            if (isNew) {
                state.persist.record[key].unshift(notice);
                let temp = {[key]:state.persist.record[key]};
                delete state.persist.record[key];
                state.persist.record = Object.assign(temp,state.persist.record)
            } else {
                state.persist.record[key].push(notice);
            }

        },
        [noticeMutations.ADD_TWEETED](state, {notice}) {
            if (!state.online.TWEETED) {
                state.online.TWEETED = [];
            }
            state.online.TWEETED.unshift(notice);
        },
        [noticeMutations.ADD_FOLLOW](state, {notice, isNew}) {
            let key;
            if (isNew) {
                key = `${notice.event}:${notice.id}`;
                let temp = {[key]: notice};
                state.persist.record[key] = {temp, ...state.persist.record}
            } else {
                key = `${notice.event}:${notice.receiverId}:${state.persist.page}`;
                if (!state.persist.record[key]) {
                    state.persist.record[key] = [notice];
                } else {
                    state.persist.record[key].push(notice);
                }
            }
        },
        [noticeMutations.INCREASE_NOTICE_COUNT](state, {count}) {
            state.persist.count += count;
        },
        [noticeMutations.INCREASE_NOTICE_UNREAD](state, {unread}) {
            state.persist.unread += unread;
        },
        [noticeMutations.INCREASE_NOTICE_PAGE](state, {page}) {
            state.persist.page += page;
        },
        [noticeMutations.ADD_EXISTS_NOTICE_RECORD](state, {key}) {
            state.existsMap.set(key, 1);
        },
        [noticeMutations.CLEAR_TWEETED_NOTICE](state) {
            state.online.TWEETED.splice(0, state.online.TWEETED.length);
        },
        [noticeMutations.SET_NOTICE_BOTTOM](state, {bottom}) {
            state.persist.bottom = bottom;
        },
        [noticeMutations.INCREASE_NOTICE_ONLINE_COUNT](state) {
            state.online.counter++;
        }
    },
    actions: {
        [noticeActions.LOAD_NOTICE_PAGE]({commit, dispatch, state}) {
            if (!state.persist.bottom) {
                let page = state.persist.page;
                return getPage(page).then(res => {
                    if (res.code === 200) {
                        return dispatch(noticeActions.ADD_NEW_NOTICE_RECORD, {notices: res.data.record}).then(() => {
                            commit(noticeMutations.INCREASE_NOTICE_PAGE, {page: 1});
                            commit(noticeMutations.SET_NOTICE_BOTTOM, {bottom: res.data.record.length <= 0});
                        })

                    } else {
                        throw new Error(res.message);
                    }
                });
            }
        },
        [noticeActions.ADD_NEW_NOTICE_RECORD]({commit, state}, {notices, isNew = false}) {
            let count = 0;
            let unread = 0;
            for (let i = 0; i < notices.length; i++) {
                let notice = notices[i];
                notice = entityParse(notice);
                let key = generateUniqueKey(notice);
                if (state.existsMap.has(key)) {
                    continue;
                }
                commit(noticeMutations.ADD_EXISTS_NOTICE_RECORD, {key});
                if (isChirpInteraction(notice.event)) {
                    commit(noticeMutations.ADD_CHIRPER_NOTICE, {notice, isNew});
                } else if (notice.event === noticeEventEnums.TWEETED) {
                    commit(noticeMutations.ADD_TWEETED, {notice, isNew});
                    commit(noticeMutations.INCREASE_NOTICE_ONLINE_COUNT);
                } else if (notice.event === noticeEventEnums.FOLLOW) {
                    commit(noticeMutations.ADD_FOLLOW, {notice, isNew});
                }
                if (isPersistNotice(notice)) {
                    count++;
                    if (notice.status === noticeStatusEnums.UNREAD) {
                        unread++;
                    }
                }
            }
            commit(noticeMutations.INCREASE_NOTICE_COUNT, {count});
            commit(noticeMutations.INCREASE_NOTICE_UNREAD, {unread});
        },
        [noticeActions.MARK_READ_ALL_NOTICE]({commit, state}) {
            let unread = -state.persist.unread;
            commit(noticeMutations.INCREASE_NOTICE_UNREAD, {unread});
            if (unread < 0) {
                return markAsRead();
            }
        }
    }
}