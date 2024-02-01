import {chatAllowEnum} from "@/enums/enums";
import {settingMutations} from "@/config/vuex/mutation-types";
import {settingActions} from "@/config/vuex/action-types";
import {getMyChatSetting, updateAllow} from "@/api/advice";

export default {
    namespaced: true,
    state: {
        chat: {
            pinned: "",
            allow: chatAllowEnum.ANYONE
        }
    },
    mutations: {
        [settingMutations.SET_CHAT_PINNED](state, {pinned}) {
            state.chat.pinned = pinned;
        },
        [settingMutations.SET_CHAT_ALLOW](state, {allow}) {
            state.chat.allow = allow;
        }
    },
    actions: {
        [settingActions.INIT_SETTING]({dispatch}) {
            return dispatch(settingActions.INIT_CHAT_SETTING);
        },
        [settingActions.INIT_CHAT_SETTING]({commit}) {
            return getMyChatSetting().then(res => {
                if (res.code === 200) {
                    let pinned = res.data.record.pinned;
                    let allow = res.data.record.allow;
                    commit(settingMutations.SET_CHAT_PINNED, {pinned});
                    commit(settingMutations.SET_CHAT_ALLOW, {allow});
                } else {
                    throw new Error(res.message);
                }
            });
        },
        [settingActions.UPDATE_CHAT_SETTING_ALLOW]({commit},{allow}){
            commit(settingMutations.SET_CHAT_ALLOW, {allow});
            return  updateAllow(allow);
        }
    }
}