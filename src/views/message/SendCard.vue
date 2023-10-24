<template>
  <el-row style="background-color: #ecf4f4">
    <el-col :span="2">
      <el-upload
          :auto-upload="false"
          :limit="1"
          :show-file-list="false"
          action="#"
          multiple
          style="display: inline-block">
        <el-button circle class="edit-btn" size="small">
          <img alt="文件" class="bt-icon" src="../../assets/image.svg">
        </el-button>
      </el-upload>
    </el-col>
    <el-col :span="20">
      <el-input
          v-model="message.content"
          :autosize="{minRows:1}"
          maxlength="500"
          placeholder="发送一条私信"
          style="font-weight: bold;font-size: 18px;  text-align: left;"
          type="textarea"
          @input="inputLimit()"
          @keyup.enter.native="doEnter">
      </el-input>
    </el-col>
    <el-col :span="2">
      <el-button :disabled="message.content.length<=0" circle class="btn-send " size="medium" type="primary"
                 @click="send">
        <svg v-if="message.content.length<=0" class="icon" height="20" p-id="2591" t="1698149230119"
             version="1.1" viewBox="0 0 1024 1024"
             width="20" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M243.029333 512L98.133333 139.605333c-10.069333-25.941333 15.189333-50.730667 40.192-41.898666l3.968 1.706666 768 384a32 32 0 0 1 4.138667 54.741334l-4.138667 2.474666-768 384c-24.874667 12.416-51.925333-10.453333-45.44-36.138666l1.28-4.096L243.029333 512 98.133333 139.605333 243.029333 512zM187.904 193.706667l111.317333 286.293333h282.794667a32 32 0 0 1 31.701333 27.648l0.298667 4.352a32 32 0 0 1-27.690667 31.701333l-4.309333 0.298667H299.221333l-111.317333 286.293333L824.490667 512 187.861333 193.706667z"
              fill="rgba(64, 158, 255,0.5)" p-id="2592"></path>
        </svg>
        <svg v-if="message.content.length>0" class="icon" height="20" p-id="2591" t="1698149230119"
             version="1.1" viewBox="0 0 1024 1024"
             width="20" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M243.029333 512L98.133333 139.605333c-10.069333-25.941333 15.189333-50.730667 40.192-41.898666l3.968 1.706666 768 384a32 32 0 0 1 4.138667 54.741334l-4.138667 2.474666-768 384c-24.874667 12.416-51.925333-10.453333-45.44-36.138666l1.28-4.096L243.029333 512 98.133333 139.605333 243.029333 512zM187.904 193.706667l111.317333 286.293333h282.794667a32 32 0 0 1 31.701333 27.648l0.298667 4.352a32 32 0 0 1-27.690667 31.701333l-4.309333 0.298667H299.221333l-111.317333 286.293333L824.490667 512 187.861333 193.706667z"
              fill="rgba(64, 158, 255)" p-id="2592"></path>
        </svg>

      </el-button>

    </el-col>
  </el-row>

</template>
<script>

export default {
  name: "SendCard",
  props: {
    receiver: Array
  },
  data() {
    return {
      message: {
        content: "",
        type: "TEXT"
      },
      postBtnDisabled: true
    }
  },
  methods: {
    inputLimit() {
      this.postBtnDisabled = this.message.content.length <= 0;
    },
    doEnter(e) {
      if (e.ctrlKey && e.keyCode === 13) {   //用户点击了ctrl+enter触发
        this.message.content = this.message.content + '\u200B' + '\n';
      } else { //用户点击了enter触发
        this.send();
      }
    },
    send() {
      console.log(this.receiver)
      if (this.message.content.length > 0) {
        let user = this.$store.getters.getUser;
        let messages = [];
        this.receiver.forEach(receiver => {
          let conversation = Math.min(receiver.id, user.id) + "_" + Math.max(receiver.id, user.id);
          let id = Date.now();
          let message = {
            content: this.message.content,
            type: this.message.type,
            conversationId: conversation,
            senderId: user.id,
            senderName: user.nickname,
            senderAvatar: user.smallAvatarUrl,
            receiverId: receiver.id,
            receiverName: receiver.nickname,
            receiverAvatar: receiver.smallAvatarUrl,
            id: id,
            tempId: `${id}`,
            isSending: true,
            createTime: id
          };
          messages.push(message);
        })
        this.$store.commit('addPrivateMessage', {
          payload: messages,
          top: true
        });
        messages.forEach(msg => {
          this.$store.commit('wsSend', JSON.stringify(msg));
        })
        this.message.content = "";
      }
    }
  }
}
</script>
<style scoped>
::v-deep .el-textarea__inner {
  border: none;
  background-color: #ecf4f4;
  resize: none;
}


.bt-icon {
  width: 20px;
}

.edit-btn {
  border: none;
  background-color: #ecf4f4
}

.btn-send {
  border: none;
  color: #409EFF !important;
  background-color: #ecf4f4 !important;

}
</style>
