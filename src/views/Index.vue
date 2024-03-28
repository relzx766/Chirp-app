<template>
  <div class="row ">
    <div class="col-3 vh-100">
      <el-container class="h-100">
        <el-main class="d-flex flex-column justify-content-between">
          <img alt="chirp" src="../assets/logo.svg" style="width: 50px;display: flex;margin-left: 34%;"/>
          <el-menu
              :default-active="routePath"
              :router="true"
              background-color="#ffffff"
              class="nav-menu flex-grow-1"
          >
            <el-menu-item class="nav-item" index="/home">
              <span slot="title" class="user-select-none">
                <i v-show="routePath!=='/home'" class="bi bi-house fw-bold fs-3 text-dark me-2"/>
              <i v-show="routePath==='/home'" class="bi bi-house-fill fw-bold fs-3 text-dark me-2"/>
                主页</span>
            </el-menu-item>
            <el-menu-item class="nav-item" index="/explore">
              <span slot="title" class="user-select-none">
                <i v-show="routePath!=='/explore'" class="bi bi-compass fw-bold fs-3 text-dark me-2"/>
                <i v-show="routePath==='/explore'" class="bi bi-compass-fill fw-bold fs-3 text-dark me-2"/>
                探索</span>
            </el-menu-item>
            <el-menu-item
                :disabled="getToken()===null"
                class="nav-item" index="/notice">
              <div v-show="notice.persist.unread>0&&$route.path!=='/notice'" class="read-point"/>
              <span slot="title" class="user-select-none">
                <i v-show="routePath!=='/notice'" class="bi bi-bell fw-bold fs-3 text-dark me-2"/>
                <i v-show="routePath==='/notice'" class="bi bi-bell-fill fw-bold fs-3 text-dark me-2"/>
                通知</span>
            </el-menu-item>
            <el-menu-item
                :disabled="getToken()===null"
                class="nav-item" index="/message">
              <div v-show="chat.unread>0" class="read-point"/>
              <span slot="title" class="user-select-none">
                 <i v-show="routePath!=='/message'" class="bi bi-envelope fw-bold fs-3 text-dark me-2"/>
                 <i v-show="routePath==='/message'"
                    class="bi bi-envelope-fill fw-bold fs-3 text-dark me-2"/>
                私信</span>
            </el-menu-item>
            <el-menu-item
                :disabled="getToken()===null"
                class="nav-item" index="/community">
              <span slot="title" class="user-select-none">
                   <i v-show="routePath!=='/community'" class="bi bi-people fw-bold fs-3 text-dark me-2"/>
                   <i v-show="routePath==='/community'"
                      class="bi bi-people-fill fw-bold fs-3 text-dark me-2"/>
                社群</span>
            </el-menu-item>
            <el-menu-item :disabled="getToken()===null" :index="`/profile?username=${user.username}`"
                          class="nav-item"
            >
              <span slot="title" class="user-select-none">
                   <i v-show="routePath!=='/profile'" class="bi bi-person fw-bold fs-3 text-dark me-2"/>
                   <i v-show="routePath==='/profile'"
                      class="bi bi-person-fill fw-bold fs-3 text-dark me-2"/>
                个人资料</span>
            </el-menu-item>
            <el-menu-item :disabled="getToken()===null" :index="`/setting`"
                          class="nav-item"
            >
              <span slot="title" class="user-select-none">
                   <i v-show="routePath!=='/setting'" class="bi bi-gear fw-bold fs-3 text-dark me-2"/>
                   <i v-show="routePath==='/setting'"
                      class="bi bi-gear-fill fw-bold fs-3 text-dark me-2"/>
                设置</span>
            </el-menu-item>


          </el-menu>
          <div v-if="getToken()"
               class="rounded-pill w-75  btn btn-outline-light mb-lg-5 align-self-center border-0">
            <el-popover
                :visible-arrow="false"
                placement="top-start"
                popper-class="shadow rounded"
                trigger="click"
                width="auto">
              <div>
                <div class="row">
                  <el-button class="border-0 d-flex justify-content-start text-dark fw-bold"
                             @click="$router.push('/sign')">
                    <i class="bi bi-toggles"/>
                    切换账号
                  </el-button>
                </div>
                <div class="row">
                  <el-button class="border-0 d-flex justify-content-start text-dark fw-bold"
                             @click="signOut">
                    <i class="bi bi-box-arrow-right"/>
                    登出 @{{ user.username }}
                  </el-button>
                </div>
              </div>
              <el-row slot="reference" class="d-flex justify-content-center align-items-center ">
                <el-col :span="5" style="text-align: left">
                  <el-avatar :src="user.smallAvatarUrl" fit="cover" size="large"/>
                </el-col>
                <el-col :span="14" style="text-align: left">
                  <el-row>
                    <el-row class="d-flex flex-column">
                        <span
                            class="d-inline-block text-truncate fw-bold text-dark fs-6 "
                            style="max-width: 96%">
                          {{ user.nickname }}
                        </span>
                      <span class="d-inline-block text-truncate text-secondary " style="max-width: 96%">
                        @{{ user.username }}
                      </span>
                    </el-row>

                  </el-row>
                </el-col>
                <el-col :span="5" style="text-align: center">

                  <i class="el-icon-more text-dark"/>

                </el-col>
              </el-row>

            </el-popover>

          </div>
        </el-main>
      </el-container>
    </div>
    <el-dialog
        :show-close="false"
        :visible.sync="secretKeyDialog"
        custom-class="no-header-dialog"
        width="30%">
      <div class="pt-2 ps-3 pe-3 pb-2">
        <div><img alt="chirp" src="../assets/logo.svg" style="width: 50px;"/></div>
        <div class="mb-2 row mt-3">
          <div class="text-start text-dark fw-bold fs-6">我们已为你生成密钥</div>
          <div class=" mt-2 mb-2 row">
            <div class="col d-flex align-items-center">
              <el-input v-model="e2ee.privateKey" readonly>

                <template slot="append">
                  <el-button circle class="border-0" @click="copy(e2ee.privateKey)"><i class="bi bi-copy  fw-bold "/>
                  </el-button>
                  <el-button circle class="border-0  fw-bold " icon="el-icon-edit"
                             @click="secretKeyDialog=false;$router.push('/message/setting');"></el-button>
                </template>
              </el-input>


            </div>
          </div>

          <div class="text-start">该密钥用于私聊点对点加密，如你原先已拥有密钥，请点击<span class="text-primary finger"
                                                                                          @click="secretKeyDialog=false;$router.push('/message/setting');">这里</span>修改。
          </div>
        </div>
      </div>

    </el-dialog>
    <div class="col vh-100 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script>

import {getToken} from "@/util/auth";
import OriginCard from "@/views/edit/OriginCard.vue";
import {getPrivateKey} from "@/util/encrypt";
import {copy} from "@/util/clipboard";
import {
  chatActions,
  e2eeActions,
  noticeActions,
  settingActions,
  userActions,
  wsActions
} from "@/config/vuex/action-types";
import {mapState} from "vuex";
import {chatMutations} from "@/config/vuex/mutation-types";
import {adviceStrategy, adviceStrategyEnums} from "@/util/adviceUtil";
import {getMsgHit} from "@/util/chatUtil";

export default {
  name: "Index",
  components: {
    OriginCard
  },
  data() {
    return {
      newChatNotice: null,
      secretKeyDialog: false,
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      notice: state => state.notice,
      chat: state => state.chat,
      e2ee: state => state.e2ee
    }),
    routePath() {
      const path = this.$route.matched[1].path;
      const split = path.split("/");
      return '/' + split[1];
    }
  },
  methods: {
    copy,
    getToken,
    to(url) {
      this.$router.push(url)
    },
    async init() {
      if (getToken() != null && getToken().length > 0) {
        try {

          await this.$store.dispatch(`user/${userActions.INIT_USER}`);
          await this.$store.dispatch(`e2ee/${e2eeActions.INIT_E2EE}`);
          await this.$store.dispatch(`ws/${wsActions.INIT_WS}`);
          await this.$store.dispatch(`setting/${settingActions.INIT_SETTING}`);
          await this.$store.dispatch(`chat/${chatActions.INIT_CHAT}`);
          await this.$store.dispatch(`notice/${noticeActions.LOAD_NOTICE_PAGE}`);
          if (!getPrivateKey(this.user.id)) {
            this.secretKeyDialog = true;
          }
        } catch (e) {
          console.log(e);
          this.$message.error(e);
        }
      }
    },
    signOut() {
      this.$store.dispatch(`user/${userActions.LOGOUT}`).then(() => {
        window.location.href = '/sign';
      })
    },
  },
  watch: {
    '$route': {
      handler(nVal, oVal) {
        if ((nVal.matched[1].path === '/message' || (oVal && oVal.matched[1].path === '/message')) && this.newChatNotice) {
          this.newChatNotice.close();
        }
        if (nVal.matched[1].path === '/notice' || (oVal && oVal.matched[1].path === '/notice')) {
          this.$store.dispatch(`notice/${noticeActions.MARK_READ_ALL_NOTICE}`);
        }
        let regex = /^\/message\/chat\/([^\/]+?)(?:\/(?=$))?$/i;
        if (regex.test(this.$route.path)) {
          let conversation = this.$route.params.id;
          this.$store.dispatch(`chat/${chatActions.READ_CONVERSATION}`, {conversation, status: true});
        } else {
          this.$store.dispatch(`chat/${chatActions.READ_CONVERSATION}`, {conversation: '', status: false});
        }
        if (oVal && regex.test(oVal.path)) {
          let conversation = oVal.params.id;
          this.$store.dispatch(`chat/${chatActions.READ_CONVERSATION}`, {conversation, status: false});
        }
      },
      immediate: true
    },
    '$store.state.chat.unread': {
      handler() {
        let advice = this.chat.advice;
        let lastIndex = advice.length - 1;
        const h = this.$createElement;
        let regex = /^\/message.*$/;
        let path = this.$route.path;
        if (!regex.test(path) && advice.length > 0) {
          if (this.newChatNotice) {
            this.newChatNotice.close();
          }
          let message = advice[lastIndex];
          let content = getMsgHit(message);
          this.$store.commit(`chat/${chatMutations.CLEAR_CHAT_ADVICE}`);
          adviceStrategy(adviceStrategyEnums.AUDIO);
          this.newChatNotice = this.$notify({
            position: 'bottom-right',
            onClick: () => {
              this.newChatNotice.close();
              this.$router.push(`/message/chat/${message.conversationId}`);
            },
            duration: 0,
            dangerouslyUseHTMLString: true,
            message: h('div', {
              style: {
                display: "flex", alignItems: "center", cursor: "pointer"
              }
            }, [
              h('el-avatar', {props: {src: message.senderAvatar}}, {}),
              h('span', {
                style: {marginLeft: "12px", width: '150px'},
                class: ['text-truncate', 'd-inline-block']
              }, content),
              h('span', {style: {fontSize: '12px', color: '#909399'}}, `[${this.chat.unread}条未读]`)
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
    setTimeout(() => {
      loading.close();
    }, 3000)
    this.init().then(() => {
      loading.close();
    })
  },
  mounted() {
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
  left: 40%;
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
  border-radius: 50px;

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
