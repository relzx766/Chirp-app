<template>
  <div>
    <ul>
      <li style="width: 20%;position: fixed">
        <img src="../assets/logo.svg" style="width: 50px;display: flex;margin-left: 34%;"/>
        <el-menu
            active-text-color="#409EFF"
            background-color="#ffffff"
            class="nav-menu"
            default-active="home"
        >
          <el-menu-item class="nav-item" index="home" @click="to('/home')">
            <img class="nav-icon" src="../assets/homepage.svg"/>
            <span>主页</span>
          </el-menu-item>
          <el-menu-item class="nav-item" index="explore">
            <img class="nav-icon" src="../assets/explore.svg"/>
            <span slot="title">探索</span>
          </el-menu-item>
          <el-menu-item
          :disabled="getToken()===null"
          class="nav-item" index="notifications"
          @click="()=>{$router.push('/notice')}">
            <img class="nav-icon" src="../assets/notice.svg"/>
            <span slot="title">通知</span>
          </el-menu-item>
          <el-menu-item
          :disabled="getToken()===null"
          class="nav-item" index="messages"
          @click="()=>{$router.push('/message')}">
            <img class="nav-icon" src="../assets/mail.svg"/>
            <span slot="title">私信</span>
          </el-menu-item>
          <el-menu-item
          :disabled="getToken()===null"
          class="nav-item" index="community">
            <img class="nav-icon" src="../assets/user-group.svg"/>
            <span slot="title">社区</span>
          </el-menu-item>
          <el-menu-item class="nav-item" index="profile"
                        :disabled="getToken()===null"
          @click="$router.push('/profile?id='+$store.getters.getUser.id)">
            <img class="nav-icon" src="../assets/profile.svg"/>
            <span slot="title">个人资料</span>
          </el-menu-item>
        </el-menu>

        <el-button
            round
            style="width: 60%;height: 50px;font-size: 16px;font-weight: bold;
           text-align: center;margin-left: 18%;margin-top: 14%" type="primary">发帖
        </el-button>
        <el-row v-if="getToken()!=null&&getToken().length>0"
                style="margin-left: 30%;margin-top: 40%">
          <el-col :span="5" style="text-align: left">
            <el-avatar :src="$store.getters.getUser.smallAvatarUrl" fit="cover" size="large"/>
          </el-col>
          <el-col :span="12" style="text-align: left">
            <el-row>
              <el-row>
                <el-link style="font-size: 16px;font-weight: bold">{{ $store.getters.getUser.nickname }}</el-link>
              </el-row>
              <el-row style="color:#909399;">@{{ $store.getters.getUser.username }}</el-row>
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

export default {
  name: "Index",
  data() {
    return {
      socket:null,
      url:'ws://localhost:8080/advice-service/interaction/',
      reconnect:{
        count:0,
        lock:false
      }
    }
  },
  methods: {
    getToken,
    to(url) {
      this.$router.push(url)
    },
    signOut() {
      localStorage.clear();
      this.$store.commit("setUser",{});
      window.location.href="/home";
    },
    loadUser(){
      getDetailProfile(localStorage.getItem("id")).then(r=>{
        this.$store.commit("setUser",r.data.record);
      })
    },
    classifyMessage(messages){
   return  messages.reduce((arr, item) => {
     Object.keys(item).forEach(k=>{
       item[k]=item[k].toString();
     })
        if (arr[item.type]) {
          arr[item.type].push(item);
        } else {
          arr[item.type] = [item];
        }
        return arr;
      }, {});
    },
    socketConnect() {
      let url = this.url+getToken();
      let socket = new WebSocket(url);
      socket.onopen=(()=>{
        this.$store.commit("clearMessage")
        this.reconnect.count=0;
        console.log("建立websocket连接");
      });
      socket.onmessage=((e)=>{
        let messages =this.classifyMessage(JSON.parse(e.data));
        Object.keys(messages).forEach(type=>{
        this.$store.commit("pushNotice", {notice:messages[type], type:type});
        })
      });
      this.socket=socket;
    },
    doReconnect(){
      if (!this.reconnect.lock&&!this.reconnect.count>20){
        this.reconnect.lock=true;
        setTimeout(()=>{
          this.socketConnect();
          this.reconnect.lock=false;
          this.reconnect.count++;
        },5000)
      }
    }
  },

  created() {
    console.log(getToken())
    if (getToken()!=null&&getToken().length>0){
      this.loadUser();
    }
    },
  mounted() {
    if (getToken()!=null&&getToken().length>0){
      this.socketConnect();
    }
  },
  destroyed() {
    console.log("asdasdasdasdsd")
    this.reconnect.lock=true;
    if (this.socket) {
      this.socket.close();
    }
  }
}
</script>

<style scoped>
li{
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