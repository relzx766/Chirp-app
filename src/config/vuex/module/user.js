import {getToken, removeToken, setToken} from "@/util/auth";
import {getProfile, load} from "@/api/user";
import {signIn} from "@/api/sign";
import {accountTypeEnums} from "@/enums/enums";
import {userMutations} from "@/config/vuex/mutation-types";
import {userActions} from "@/config/vuex/action-types";

export default {
    namespaced: true,
    state: {
            id: '',
            username: '',
            password: '',
            nickname: '',
            email: '',
            birthday: '',
            gender: '',
            createTime: '',
            description: '',
            profileBackUrl: '',
            smallAvatarUrl: '',
            mediumAvatarUrl: '',
            largeAvatarUrl: '',
            followNum: '',
            followingNum: '',
            status: 1,
            relation: '',
        userList:{}
    },
    mutations: {
        [userMutations.SET_USER](state, {user}) {
            Object.assign(state,user);
        },
        [userMutations.CLEAR_USER](state) {
            state = {};
        },
        [userMutations.SET_USER_LIST](state,{userList}){
            state.userList=userList;
        },
        [userMutations.SET_USER_TO_LIST](state,{user}){
            state.userList[user.id]=user;
        },
        [userMutations.CLEAR_USER_LIST](state){
            state.userList=[];
        }
    },
    actions: {
        [userActions.LOGIN]({commit, state}, {account, password, accountType = accountTypeEnums.USERNAME}) {
            return signIn(account, password, accountType).then(res => {
                if (res.code === 200) {
                    let token = res.data.record.token;
                    setToken(token);
                    return token;
                } else {
                    throw new Error(res.message);
                }
            }).then(token => {
                load(token).then(r => {
                    if (r.code === 200) {
                        commit(userMutations.SET_USER, {user:r.data.record});
                    } else {
                        throw new Error(r.message);
                    }
                })
            });
        },
        [userActions.LOGOUT]({commit}) {
            removeToken();
            commit(userMutations.CLEAR_USER);
        },
        [userActions.INIT_USER]({commit,state}) {
            let token = getToken();
            if (token) {
                load(token).then(r => {
                    if (r.code === 200) {
                        commit(userMutations.SET_USER, {user:r.data.record});
                    }else {
                        throw new Error(r.message);
                    }
                })
            }else {
                throw new Error("未登录")
            }
        },
        [userActions.FETCH_USER]({commit}, {userIds}){
            userIds=Array.from(userIds);
            if (userIds.length>0){
                return getProfile(JSON.stringify(userIds)).then(res=>{
                    if(res.code===200){
                        for (let i = 0; i < res.data.record.length; i++) {
                            let user=res.data.record[i];
                            commit(userMutations.SET_USER_TO_LIST,{user});
                        }
                    }else {
                        throw new Error(res.message);
                    }
                });
            }
        }
    },
}