<template>
<div class="container">
<div style="display: flex;flex-direction: column;" class="p-2">
  <div class="fw-bold fs-5 text-start align-items-center" style="height: 70px;align-self: start">
    <el-button icon="el-icon-back"
               circle
               class="p-1 fs-5"
               style="border: none;font-weight: bold"
    @click="$router.back()"></el-button>
    <span class="ms-2">私信</span>
  </div>
  <div class="border-bottom">
    <div class="row">
      <div class="col text-start d-flex align-items-center ">你的密钥</div>
      <div class="col text-end">
        <el-button circle icon="el-icon-edit" class="float-end  border-0"
                   @click="editable=!editable"/>
        <el-button circle icon="el-icon-document-copy"  class="float-end ms-3 border-0"
                   @click="copy(getPrivateKey($store.getters.getUser.id))"/>
        <div v-if="!editable" style="width: 50%;" class="row bg-body-secondary text-center float-end rounded-pill d-flex align-items-center ">
          <div class="col-7" >
            <span class="m-2" v-if="keyVisible">{{getPrivateKey($store.getters.getUser.id)}}</span>
            <span class="m-2 fs-5" v-else>******</span>
          </div>
          <div class="col-1">
            <el-button icon="el-icon-view" class="border border-0 bg-body-secondary" circle
                       @click="keyVisible=!keyVisible"/>
          </div>

        </div>
        <div v-else style="width: 50%" class="float-end">
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
  <div class="fs-6 d-flex align-items-center text-start row" >
    <div class="col text-start">
      每个人
    </div>
  <div class="col text-end">
    <el-button v-show="setting.allow!==chatAllowEnum.ANYONE" class="border-2 border-dark-subtle " circle size="medium" @click="doChatPmChange"></el-button>
    <el-button v-show="setting.allow===chatAllowEnum.ANYONE" class="border-2  p-1" icon="el-icon-check" circle size="small"
    style="border-color: #409EFF;color: white;background-color: #409EFF"></el-button>
  </div>
  </div>
  <div class=" d-flex align-items-center text-start row" >
    <div class="col text-start">
      没有人
    </div>
    <div class="col text-end">
      <el-button v-show="setting.allow!==chatAllowEnum.NOBODY" class="border-2 border-dark-subtle " circle size="medium"
                 @click="doChatPmChange"></el-button>
      <el-button v-show="setting.allow===chatAllowEnum.NOBODY" class="border-2  p-1" circle size="small" icon="el-icon-check"
                 style="border-color: #409EFF;color: white;background-color: #409EFF"></el-button>

    </div>
  </div>
</div>
</div>
</div>
</template>
<script>
import {getPrivateKey, mathPublicKey, setPrivateKey, setPublicKey} from "@/util/encrypt";
import {copy} from "@/util/clipboard";
import {savePublicKey, updateAllow} from "@/api/advice";
import {chatAllowEnum} from "@/enums/enums";

export default {
  name: "Setting",
  computed: {
    chatAllowEnum() {
      return chatAllowEnum
    },
    setting(){
      return this.$store.getters.getSetting.chat;
    }
  },
  data(){
    return{
    editable:false,
      keyVisible:false,
      key:getPrivateKey(this.$store.getters.getUser.id),
      chatPermission:'all'
    }
  },
  methods: {copy, getPrivateKey,
    async saveKeys() {
      setPrivateKey(this.$store.getters.getUser.id, this.key);
      let keyPair = this.$store.getters.getEncrypt;
      let publicKey = mathPublicKey(keyPair.generator, getPrivateKey(this.$store.getters.getUser.id), keyPair.prime);
      setPublicKey(this.$store.getters.getUser.id, publicKey);
      await savePublicKey(publicKey);
      this.$message.success("已更新密钥")
    },
    doChatPmChange(){
    switch (this.setting.allow) {
      case chatAllowEnum.ANYONE:
        this.$store.commit('setChatSetting',{allow:chatAllowEnum.NOBODY});
        updateAllow(chatAllowEnum.NOBODY);
        break;
      case chatAllowEnum.NOBODY:
        this.$store.commit('setChatSetting',{allow:chatAllowEnum.ANYONE});
        updateAllow(chatAllowEnum.ANYONE);
        break;
      default:
        this.$store.commit('setChatSetting',{allow:chatAllowEnum.ANYONE});
        updateAllow(chatAllowEnum.ANYONE);
    }
    }
  },
  created() {
  }
}
</script>
<style scoped>

</style>
