<template>
  <div>
    <ul>
      <li style="width: 20%;position: fixed">
        <img src="../assets/logo.svg" style="width: 50px;display: flex;margin-left: 34%;"/>
        <el-menu
            :default-active="$route.path"
            :router="true"
            active-text-color="#409EFF"
            background-color="#ffffff"
            class="nav-menu"
        >
          <el-menu-item class="nav-item" index="/home">
            <img class="nav-icon" src="../assets/homepage.svg"/>
            <span>主页</span>
          </el-menu-item>
          <el-menu-item class="nav-item" index="/explore">
            <img class="nav-icon" src="../assets/explore.svg"/>
            <span slot="title">探索</span>
          </el-menu-item>
          <el-menu-item
              :disabled="getToken()===null"
              class="nav-item" index="/notice">
            <img class="nav-icon" src="../assets/notice.svg"/>
            <div v-show="$store.getters.getUnReadNoticeCount>0&&$route.path!=='/notice'" class="read-point"/>
            <span slot="title">通知</span>
          </el-menu-item>
          <el-menu-item
              :disabled="getToken()===null"
              class="nav-item" index="/message">

            <img class="nav-icon" src="../assets/mail.svg"/>
            <div v-show="$store.getters.getChatUnreadCount>0" class="read-point"/>
            <span slot="title">私信</span>
          </el-menu-item>
          <el-menu-item
              :disabled="getToken()===null"
              class="nav-item" index="/community">
            <img class="nav-icon" src="../assets/user-group.svg"/>
            <span slot="title">社群</span>
          </el-menu-item>
          <el-menu-item :disabled="getToken()===null" class="nav-item"
                        index="/profile"
          >
            <img class="nav-icon" src="../assets/profile.svg"/>
            <span slot="title">个人资料</span>
          </el-menu-item>
        </el-menu>
        <el-row v-if="getToken()!=null&&getToken().length>0"
                style="margin-left: 30%;margin-top: 70%;font-size: 14px">
          <el-col :span="5" style="text-align: left">
            <el-avatar :src="$store.getters.getUser.smallAvatarUrl" fit="cover" size="large"/>
          </el-col>
          <el-col :span="12" style="text-align: left">
            <el-row>
              <el-row>
                <el-link :href="'/profile?id='+$store.getters.getUser.id" class="d-inline-block text-truncate" style="font-size: 16px;font-weight: bold;max-width: 96%">
                  {{ $store.getters.getUser.nickname }}
                </el-link>
              </el-row>
              <el-row class="d-inline-block text-truncate" style="color:#909399;max-width: 96%">@{{ $store.getters.getUser.username }}</el-row>
            </el-row>
          </el-col>
          <el-col :span="5" style="text-align: left">
            <el-button circle icon="el-icon-switch-button" style="border: none;font-size: 20px"
                       @click="signOut"></el-button>
          </el-col>
        </el-row>
      </li>
      <li style="width: 80%;margin-left: 20%">
        <router-view/>
      </li>
    </ul>
  </div>
</template>

<script>

import {getToken} from "@/util/tools";
import {getDetailProfile} from "@/api/user";
import OriginCard from "@/views/edit/OriginCard.vue";
import {getChatIndexPage, getChatUnread, getPage} from "@/api/advice";
import {h} from "vue";

export default {
  name: "Index",
  components: {
    OriginCard
  },
  data() {
    return {
      newChatNotice:null
    }
  },
  methods: {
    getToken,
    to(url) {
      this.$router.push(url)
    },
   async init(){
     if (getToken() != null && getToken().length > 0) {
   await    this.loadUser();
   await this.$store.dispatch('wsInit').then(()=>{
         this.loadNotice();
         this.loadChat();
       })
     }
    },
    signOut() {
      this.$store.commit("websocketClose")
      localStorage.clear();
      this.$store.commit("setUser", {});
      window.location.href = "/home";
    },
    loadUser() {
      getDetailProfile(localStorage.getItem("id")).then(r => {
        this.$store.commit("setUser", r.data.record);
      })
    },
    loadNotice(){
      getPage(this.$store.getters.getNoticePage).then(res => {
        this.$store.commit('incrementNoticePage')
        this.$store.commit('addNotice', {
          payload: res.data.record,
          top: false
        });
      })
    },
    loadChat(){
      let messages;
      let unreadMap;
      getChatIndexPage().then(res => {
        messages = res.data.record;
        this.$store.commit('addPrivateMessage', {
          payload: messages,
          top: false
        });
      }).then(() => {
        getChatUnread(messages.map(msg => msg.conversationId)).then(res => {
          unreadMap = res.data.record;
          Object.keys(unreadMap).forEach(key=>{
            this.$store.commit('setConversationUnread',{
              conversation:key,
              count:unreadMap[key]
            })
          })
        });
      })
    }
  },
  watch: {
    '$route': {
      handler(to, form) {
        if (to.path === '/notice') {
          this.$store.commit('readAllNotice')
        }
      },
      immediate: true
    },
    '$store.state.message.unRead': {
      handler() {
        let conversation=this.$store.getters.popNewChatQueue;
        let record=this.$store.getters.getChatHistory(conversation);
        const h = this.$createElement;
        if (this.$route.path!=='/message'&&conversation&&record.messages.length>0) {
          if (this.newChatNotice){
            this.newChatNotice.close();
          }
         let message=record.messages[record.messages.length-1]
          this.newChatNotice= this.$notify({
            position:'bottom-right',
           onClick:()=>{this.newChatNotice.close();this.$router.push('/message?conversation=' + conversation)},
            duration:0,
            dangerouslyUseHTMLString: true,
            message: h('div', {
              style: {
                display: "flex", alignItems: "center",cursor:"pointer"
              }
            }, [
              h('el-avatar', {props: {src: message.senderAvatar}}, {}),
              h('span', {style:{marginLeft:"12px"}}, message.content),
                h('span',{style:{fontSize:'12px',color:'#909399'}},`[${record.unreadCount}条未读]`)
            ])
          })
        }
      }
    }
  },
  created() {
    const loading = this.$loading({
      lock: true,
      text: '',
      spinner: '',
      background: '#ffffff'
    });
    this.init().then(()=>{
      loading.close();
    })
  }
}
</script>

<style scoped>
.read-point {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #F56C6C;
  position: absolute;
  left: 36%;
  top: 10%;
}

li {
  list-style-type: none;
  float: left;
}

.nav-menu {
  border-right: none;
}

.nav-icon {
  height: 50%;
  margin-right: 14px;
}

.nav-item {
  font-size: 20px;
  display: flex;
  align-items: center;
  margin-left: 30%;
}

</style>
<style>
.el-loading-spinner .circular{
  width: 42px;
  height: 42px;
  animation: loading-rotate 2s linear infinite;
  display: none;
}
.el-loading-spinner{

  /* 图片替换为你自定义的即可 */
  background: url(../assets/logo.svg) no-repeat;

  background-size: 48px 48px;
  width: 100%;
  height: 100%;
  position: relative;
  top: 50%;
  left: 50%;
}
</style>
