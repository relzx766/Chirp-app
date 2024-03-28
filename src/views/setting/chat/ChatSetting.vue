<template>
  <div class="container">
    <div class="p-2" style="display: flex;flex-direction: column;">
      <div class="fw-bold fs-5 text-start align-items-center" style="height: 70px;align-self: start">
        <el-button circle
                   class="p-1 fs-5"
                   icon="el-icon-back"
                   style="border: none;font-weight: bold"
                   @click="$router.back()"></el-button>
        <span class="ms-2">私信</span>
      </div>
      <div class="border-bottom">
        <div class="row">
          <div class="col text-start d-flex align-items-center ">你的密钥</div>
          <div class="col text-end">
            <el-button circle class="float-end  border-0" icon="el-icon-edit"
                       @click="editable=!editable"/>
            <el-button circle class="float-end ms-3 border-0" icon="el-icon-document-copy"
                       @click="copy(e2ee.privateKey)"/>
            <div v-if="!editable" class="row bg-body-secondary text-center float-end rounded-pill d-flex align-items-center "
                 style="width: 50%;">
              <div class="col-7">
                <span v-if="keyVisible" class="m-2">{{ e2ee.privateKey }}</span>
                <span v-else class="m-2 fs-5">******</span>
              </div>
              <div class="col-1">
                <el-button circle class="border border-0 bg-body-secondary" icon="el-icon-view"
                           @click="keyVisible=!keyVisible"/>
              </div>

            </div>
            <div v-else class="float-end" style="width: 50%">
              <el-input v-model="key" show-password
                        @keyup.enter.native="saveKeys"/>
            </div>
          </div>
        </div>
        <div class="row text-start text-body-secondary mb-2" style="font-size: 12px">
          <span>密钥用于私信点对点加密,如已有密钥，请更改，否则请勿更改。</span>
          <br>
          <span>密钥不会存储于服务器，请注意保存，若更换设备或浏览器，请及时修改。</span>
        </div>
      </div>
      <div class="text-start mt-2 mb-2">
        <div class="fs-6 fw-bold">允许来自以下用户的私信请求</div>
        <div class="text-body-secondary" style="font-size: 12px">你关注的用户始终可以给你发送私信。</div>
        <div class="fs-6 d-flex align-items-center text-start row">
          <div class="col text-start">
            每个人
          </div>
          <div class="col text-end">
            <el-button v-show="setting.chat.allow!==chatAllowEnum.ANYONE" circle class="border-2 border-dark-subtle "
                       size="medium" @click="doChatPmChange"></el-button>
            <el-button v-show="setting.chat.allow===chatAllowEnum.ANYONE" circle class="border-2  p-1"
                       icon="el-icon-check"
                       size="small"
                       style="border-color: #409EFF;color: white;background-color: #409EFF"></el-button>
          </div>
        </div>
        <div class=" d-flex align-items-center text-start row">
          <div class="col text-start">
            没有人
          </div>
          <div class="col text-end">
            <el-button v-show="setting.chat.allow!==chatAllowEnum.NOBODY" circle class="border-2 border-dark-subtle "
                       size="medium"
                       @click="doChatPmChange"></el-button>
            <el-button v-show="setting.chat.allow===chatAllowEnum.NOBODY" circle class="border-2  p-1" icon="el-icon-check"
                       size="small"
                       style="border-color: #409EFF;color: white;background-color: #409EFF"></el-button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {copy} from "@/util/clipboard";
import {chatAllowEnum} from "@/enums/enums";
import {mapState} from "vuex";
import {e2eeActions, settingActions} from "@/config/vuex/action-types";

export default {
  name: "Setting",
  computed: {
    chatAllowEnum() {
      return chatAllowEnum
    },
    ...mapState({
      user: state => state.user,
      setting: state => state.setting,
      e2ee: state => state.e2ee
    })
  },
  data() {
    return {
      editable: false,
      keyVisible: false,
      key: ''
    }
  },
  methods: {
    copy,

    saveKeys() {
      this.$store.dispatch(`e2ee/${e2eeActions.SET_PRIVATE_KEY}`, {privateKey: this.key}).then(() => {
        this.$message.success("已更新密钥");
      });
    },
    doChatPmChange() {
      switch (this.setting.chat.allow) {
        case chatAllowEnum.ANYONE:
          this.$store.dispatch(`setting/${settingActions.UPDATE_CHAT_SETTING_ALLOW}`, {allow: chatAllowEnum.NOBODY});
          break;
        case chatAllowEnum.NOBODY:
          this.$store.dispatch(`setting/${settingActions.UPDATE_CHAT_SETTING_ALLOW}`, {allow: chatAllowEnum.ANYONE});
          break;
        default:
          this.$store.dispatch(`setting/${settingActions.UPDATE_CHAT_SETTING_ALLOW}`, {allow: chatAllowEnum.ANYONE});
      }
    }
  },
  mounted() {
    this.key = this.e2ee.privateKey;
  }
}
</script>
<style scoped>

</style>
