import Vuex from 'vuex'
import Vue from "vue";
import websocketLink from '../websocket.config';
import {getToken} from "@/util/auth";
import {getAdviceAudio} from "@/util/adviceUtil";
import {doDecrypt, doEncrypt, getPrivateKey, getPublicKey, getShareKey} from "@/util/encrypt";
import {fetchPublicKey, getChatSetting, getMyChatSetting, getPublicKeys} from "@/api/advice";
import {chatAllowEnum, messageStatusEnums} from "@/enums/enums";
import {Message} from "element-ui";
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        ws: null,
        chat: {
            record: {

                /*{ key:  conversation: "",
                   messages: [],
                   unreadCount: 0,
                   user: {},
                   reading: false,
                   date:timestamp,
                   secretKey:""
                   page:1}*/
            },
            reply:null,
            count: 0,
            unRead: 0,
            filterMap: new Map(),
            //每个发送者都需要存储
            page: new Map(),
            newChatQueue:[],
            keys:{}
        },
        notice: {
            record: {},
            count: 0,
            unRead: 0,
            filterMap: new Map(),
            page: 1
        },
        followingUpdate: {
            record: [],
            count: 0
        },
        user: {},
        encrypt: {
            prime:'',
            generator:'',
            init:false
        },
        setting:{
            chat:{
                pinned:"",
                allow:chatAllowEnum.ANYONE
            }
        }
    },
    getters: {
        getUser: state => {
            return state.user;
        },
        getNotice: state => {
            return state.notice.record;
        },
        getNoticeUnread: state => {
            return state.notice.unRead;
        },
        popFollowingUpdate: state => {
            return state.followingUpdate.record.splice(0, state.followingUpdate.record.length);
        },
        getNoticePage: state => {
            return state.notice.page;
        },
        getChat: state => {
            return state.chat;
        },
        getConv: (state) => (conversationId) => {
            return state.chat.record[conversationId];
        },
        getChatUnread: state => {
            return state.chat.unRead;
        },
        getConvList: state => {
            return state.chat.record.map(obj => obj.conversation);
        },
        popNewChatQueue: state => {
            return state.chat.newChatQueue.pop()
        },
        getChatReply: state => {
            return state.chat.reply;
        },
        getKeys:state => {
            return state.chat.keys
        },
        getEncrypt: state => {
            return state.encrypt
        },
        getSecretKey: state => (key)=>{
            return state.chat.keys[key]
        },
        getSetting:state => {
            return state.setting;
        }
    },
    mutations: {
        websocketInit(state) {
            let url = 'ws://localhost:8080/advice-service/interaction/' + getToken();
            state.ws = new websocketLink(url, {
                onopen: () => {
                    console.log("已与服务器建立websocket连接");
                    Message.success("已连接消息服务");
                },
                onmessage: e => {
                    let messages = JSON.parse(e.data);
                    let notice = messages.NOTICE;
                    let chat = messages.CHAT;
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
                    Message.error("与服务器断开连接")
                },
                onretry:()=>{
                    Message.warning("尝试重新连接服务器");
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
                if (item.event === 'TWEETED') {
                    state.followingUpdate.record.unshift(item);
                    state.followingUpdate.count += 1;
                }else {
                    if (!item.isRead) {
                        state.notice.unRead++;
                    }
                    if (item.entityType === 'CHIRPER' || item.entityType === 'USER') {
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
                                state.notice.record[key] = [];

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
        setNoticeOption(state,{unread,page}){
            if (unread!==undefined){
                state.notice.unRead=unread;
            }
            if (page!==undefined){
                state.notice.page=page;
            }
        },
        addChatRecord(state, {payload, top}) {
            let messages = Array.from(payload);
            for (let i = 0; i < messages.length; i++) {
                let item = messages[i];
                let key = item.conversationId;
                if (state.chat.filterMap.has(item.id)) {
                    continue;
                } else {
                    state.chat.filterMap.set(item.id, 1);
                }
                if (item.tempId && state.chat.record[key] && state.chat.record[key].messages) {
                    let index = state.chat.record[key].messages.findIndex(message =>
                        message.tempId === item.tempId
                    );
                    if (index !== -1) {
                        state.chat.record[key].messages.splice(index, 1);
                    }
                }

                if (!state.chat.record[key]) {
                    state.chat.record[key] = {
                        conversation: key,
                        messages: [],
                        unreadCount: 0,
                        user: {},
                        reading: false,
                        date:new Date(item.createTime).getTime(),
                        page: 1
                    };
                }else {
                    state.chat.record[key].date=Math.max(new Date(item.createTime).getTime(),state.chat.record[key].date);
                }
                let user = state.user;
                switch (user.id) {
                    case item.senderId: {
                        state.chat.record[key].user.id = item.receiverId;
                        state.chat.record[key].user.smallAvatarUrl = item.receiverAvatar;
                        state.chat.record[key].user.nickname = item.receiverName;
                    }
                        break;
                    case item.receiverId: {
                        state.chat.record[key].user.id = item.senderId;
                        state.chat.record[key].user.smallAvatarUrl = item.senderAvatar;
                        state.chat.record[key].user.nickname = item.senderName;
                    }
                        break;
                    default : {
                        state.chat.record[key].user = user;
                    }
                }
                if (!state.chat.keys[key]){
                    state.chat.keys[key]=getShareKey(state.chat.keys[state.chat.record[key].user.id],getPrivateKey(state.user.id),state.encrypt.prime).toString();
                }
                item.content=doDecrypt(state.chat.keys[key],item.content);
                if (item.reference&&item.reference.content){
                    item.reference.content=doDecrypt(state.chat.keys[key],item.reference.content);
                }
                if (messageStatusEnums.FAILED===item.status){
                    Message.error(item.failedMsg);
                }
                if (top) {
                    state.chat.record[key].messages.push(item);
                    if (!state.chat.record[key].reading && item.status === 'UNREAD' && state.user.id !== item.senderId) {
                        state.chat.record[key].unreadCount++;
                        state.chat.unRead++;
                        state.chat.newChatQueue.push(key);
                        getAdviceAudio().play()
                            .catch(e=>{
                                console.log(e)
                            });
                    }

                } else {
                    state.chat.record[key].messages.unshift(item);
                }
            }
            state.chat.count+=messages.length;
        },
        setConvOption(state,{conversation,unread,status,page,user}){
          if (!state.chat.record[conversation]&&user)  {
              state.chat.record[conversation] = {
                  conversation: conversation,
                  messages: [],
                  unreadCount: 0,
                  user: user,
                  reading: false,
                  date:Date.now(),
                  page: 1
              }
          }
          if (state.chat.record[conversation]&&unread!==undefined){
              let count=state.chat.record[conversation].unreadCount;
              state.chat.record[conversation].unreadCount=unread;
              state.chat.unRead+=unread-count;
          }
          if (state.chat.record[conversation]&&status!==undefined){
              state.chat.record[conversation].reading=status;
          }
          if (state.chat.record[conversation]&&page!==undefined){
              state.chat.record[conversation].page=page;
          }
        },
        setChatToReply(state,message){
            state.chat.reply = message;
        },
        delMsg(state, {conversation, messageId}){
            state.chat.record[conversation].messages = state.chat.record[conversation].messages.filter(item=>item.id!==messageId);
        },
        leaveConv(state, conversation){
            let size=state.chat.record[conversation].messages.length;
         delete   state.chat.record[conversation];
         state.chat.count-=size;
        },
        addKey(state,{id,key}){
            state.chat.keys[id]=key;
        },
        setEncrypt(state,{p,g}){
            state.encrypt.prime=p;
            state.encrypt.generator=g;
            state.encrypt.init=true;
        },
        setChatSetting(state,setting){
            if (setting.allow!==undefined){
                state.setting.chat.allow=setting.allow;
            }
            if (setting.pinned!==undefined){
                state.setting.chat.pinned=setting.pinned;
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
        pushMessage({commit}, {payload,top}) {
            let ids =[];
                Array.from(payload).forEach(item=> {
                    ids.push(item.senderId);
                    ids.push(item.receiverId);
                });
        getPublicKeys(ids).then(res=>{
                if (res.code===200){
                    let record = res.data.record;
                    ids.forEach(id=>{
                        commit('addKey',{id,key:record[id]});
                    })
                }
            }).then(()=>{
            commit('addChatRecord', {payload,top});
        })
        },
        initSetting({commit}){
            getMyChatSetting().then(r =>{
                commit('setChatSetting',r.data.record);
            }).catch(e=>{
                let setting={}
                commit('setChatSetting',setting);
                throw new Error(e);
            })
        },
    }
})
export default store;
