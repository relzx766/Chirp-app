<template>
  <div class="row">
    <div class="col-3">
      <el-container>
        <el-main>
          <img src="../assets/logo.svg" style="width: 50px;display: flex;margin-left: 34%;"/>
          <el-menu
              :default-active="$route.matched[1].path"
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
              <div v-show="$store.getters.getNoticeUnread>0&&$route.path!=='/notice'" class="read-point"/>
              <span slot="title">通知</span>
            </el-menu-item>
            <el-menu-item
                :disabled="getToken()===null"
                class="nav-item" index="/message">

              <img class="nav-icon" src="../assets/mail.svg"/>
              <div v-show="$store.getters.getChatUnread>0" class="read-point"/>
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
          <el-row v-if="getToken()"
                  style="margin-left: 30%;margin-top: 70%;font-size: 14px">
            <el-col :span="5" style="text-align: left">
              <el-avatar :src="$store.getters.getUser.smallAvatarUrl" fit="cover" size="large"/>
            </el-col>
            <el-col :span="12" style="text-align: left">
              <el-row>
                <el-row>
                  <el-link :href="'/profile?id='+$store.getters.getUser.id" class="d-inline-block text-truncate"
                           style="font-size: 16px;font-weight: bold;max-width: 96%">
                    {{ $store.getters.getUser.nickname }}
                  </el-link>
                </el-row>
                <el-row class="d-inline-block text-truncate" style="color:#909399;max-width: 96%">
                  @{{ $store.getters.getUser.username }}
                </el-row>
              </el-row>
            </el-col>
            <el-col :span="5" style="text-align: left">
              <el-button circle icon="el-icon-switch-button" style="border: none;font-size: 20px"
                         @click="signOut"></el-button>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <el-dialog
          :visible.sync="secretKeyDialog"
          width="26%"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="false"
          @close="saveKeys"
      >
        <div class="p-4">
          <p class="text-start">你的密钥为：</p>
          <div class="row d-flex align-items-center">
            <div class="col-7">
              <el-input v-if="editable" v-model="secretKey" show-password
                        @keyup.enter.native="saveKeys"
                        @input="secretKey=secretKey.replace(/\D/g,'')"/>
              <div v-else style="width:100%"
                   class="row bg-body-secondary ms-1 p-1 text-center float-start rounded-pill d-flex align-items-center ">
                <div class="col-7">
                  <span v-show="!keyVisible">******</span>
                  <span v-show="keyVisible">{{ secretKey }}</span>
                </div>
                <div class="col text-end">
                  <el-button icon="el-icon-view" circle class="border-0 bg-body-secondary"
                             @click="keyVisible=!keyVisible"/>
                </div>
              </div>
            </div>
            <div class="col">
              <el-button circle class="border border-0 fs-6 p-2" icon="el-icon-document-copy"
                         @click="copy(secretKey)"/>
              <el-popconfirm
                  title="若非已拥有密钥，否则请勿修改!"
                  icon="el-icon-warning"
                  icon-color="#F56C6C"
                  @confirm="editable=true"
              >
                <el-button slot="reference" circle class="border border-0 fs-6 p-2" icon="el-icon-edit"/>
              </el-popconfirm>

            </div>
          </div>
          <p class="text-start mt-2">该密钥用于点对点加密，如若更改将导致无法解密聊天记录，请妥善保管，勿泄露给他人。</p>
          <el-button round type="danger" style="width: 90%" @click="secretKeyDialog=false;">确定</el-button>
        </div>

      </el-dialog>
    </div>
    <div class="col-9">
      <router-view/>
    </div>
  </div>
</template>

<script>

import {getToken, removeToken} from "@/util/auth";
import {load} from "@/api/user";
import OriginCard from "@/views/edit/OriginCard.vue";
import {getChatIndexPage, getChatUnread, getKeyPair, getPage, savePublicKey} from "@/api/advice";
import {generateKey, getPrivateKey, mathPublicKey, setPrivateKey, setPublicKey} from "@/util/encrypt";
import {copy} from "@/util/clipboard";

export default {
  name: "Index",
  components: {
    OriginCard
  },
  data() {
    return {
      newChatNotice: null,
      secretKey: "",
      secretKeyDialog: false,
      editable: false,
      keyVisible: false
    }
  },
  methods: {
    getPrivateKey,
    copy,
    getToken,
    to(url) {
      this.$router.push(url)
    },
    async init() {
      if (getToken() != null && getToken().length > 0) {
        await this.loadUser();
        await this.initSecretKey();
        await this.$store.dispatch('wsInit').then(() => {
          this.loadNotice();
          this.loadChat();
        })
      }
    },
    signOut() {
      removeToken();
      window.location.href = "/home";
    },
    async loadUser() {
      await load(getToken()).then(r => {
        this.$store.commit("setUser", r.data.record);
      })
    },
    async loadNotice() {
      await getPage(this.$store.getters.getNoticePage).then(res => {
        this.$store.commit('setNoticeOption', {
          page: this.$store.getters.getNoticePage + 1
        })
        this.$store.commit('addNotice', {
          payload: res.data.record,
          top: false
        });
      })
    },
    async loadChat() {
      let messages;
      let unreadMap;
      await getChatIndexPage().then(res => {
        messages = res.data.record;
        this.$store.dispatch('pushMessage', {
          payload: messages,
          top: false
        });
      }).then(() => {
        getChatUnread(messages.map(msg => msg.conversationId)).then(res => {
          unreadMap = res.data.record;
          Object.keys(unreadMap).forEach(key => {
            this.$store.commit('setConvOption', {
              conversation: key,
              unread: unreadMap[key]
            })
          })
        });
      })
    },
    async initSecretKey() {
      if (!getPrivateKey(this.$store.getters.getUser.id)) {
        this.secretKey = generateKey();
        this.secretKeyDialog = true;
      } else {
        this.secretKey = getPrivateKey(this.$store.getters.getUser.id);
      }
      await getKeyPair().then(({data}) => {
        let keyPair = data.record;
        this.$store.commit('setEncrypt', {
          p: keyPair[0],
          g: keyPair[1]
        })
      });
      await this.saveKeys();
    },
    async saveKeys() {
      setPrivateKey(this.$store.getters.getUser.id, this.secretKey);
      let keyPair = this.$store.getters.getEncrypt;
      let publicKey = mathPublicKey(keyPair.generator, this.secretKey, keyPair.prime);
      setPublicKey(this.$store.getters.getUser.id, publicKey);
      await savePublicKey(publicKey);
    },
  },
  watch: {
    '$route': {
      handler(to, from) {
        if (to.path === '/notice') {
          this.$store.commit('setNoticeOption', {unread: 0});
        } else if ((to.path === '/message' || (from && from.path === '/message')) && this.newChatNotice) {
          this.newChatNotice.close()
        }
      },
      immediate: true
    },
    '$store.state.chat.unRead': {
      handler() {
        let conversation = this.$store.getters.popNewChatQueue;
        let record = this.$store.getters.getConv(conversation);
        const h = this.$createElement;
        let regex = /^\/message.*$/;
        let path = this.$route.path;
        if (!regex.test(path) && conversation && record.messages.length > 0) {
          if (this.newChatNotice) {
            this.newChatNotice.close();
          }
          let message = record.messages[record.messages.length - 1]
          this.newChatNotice = this.$notify({
            position: 'bottom-right',
            onClick: () => {
              this.newChatNotice.close();
              this.$router.push('/message?conversation=' + conversation)
            },
            duration: 0,
            dangerouslyUseHTMLString: true,
            message: h('div', {
              style: {
                display: "flex", alignItems: "center", cursor: "pointer"
              }
            }, [
              h('el-avatar', {props: {src: message.senderAvatar}}, {}),
              h('span', {style: {marginLeft: "12px"}}, message.content),
              h('span', {style: {fontSize: '12px', color: '#909399'}}, `[${record.unreadCount}条未读]`)
            ])
          })
        }
      }
    }
  },
  created() {
    document.documentElement.scrollTop = 0;
    const loading = this.$loading({
      lock: true,
      text: '',
      spinner: '',
      background: '#ffffff',
      fullscreen: true
    });
    setTimeout(() =>{
      loading.close();
    },3000)
    this.init().then(() => {
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

::v-deep .el-dialog__header {
  padding: 0;
}

::v-deep .el-dialog__body {
  padding: 0;
}

</style>
<style>
.el-loading-spinner .circular {
  width: 42px;
  height: 42px;
  animation: loading-rotate 2s linear infinite;
  display: none;
}

.el-loading-spinner {

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
