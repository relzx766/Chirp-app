<template>
  <div style="padding: 0 4px">
    <div v-if="reply&&currentToReply" class="text-start p-2 row mb-2 "
         style="font-size: 12px;font-weight: 600;border-left: 4px solid;background-color: #f0f0f0">
      <div class="col-11">
        <div class="row">
          <div class="col-auto d-grid align-items-center" >
            <div>
              <el-row>{{ currentToReply.senderName }}</el-row>
              <el-row v-if="currentToReply.type==='TEXT'">
                <i class="el-icon-document fw-bold"/><span>文本</span>
              </el-row>
              <el-row v-else-if="currentToReply.type==='IMAGE'">
                <i class="el-icon-camera fw-bold"/><span>图像</span>
              </el-row>
            </div>
          </div>

          <el-row v-if="currentToReply.type==='TEXT'"
                  style="width: 100%">
              <v-clamp autoresize :max-lines="2"
             style="cursor: pointer"  @click.native="showRefer(currentToReply.content)">
                {{ currentToReply.content }}
              </v-clamp>
          </el-row>

          <div class="col">
            <el-row v-if="currentToReply.type==='IMAGE'" class="text-end">
              <el-image :src="currentToReply.content" fit="cover"
                        :preview-src-list="[currentToReply.content]"
                        style="height: 60px;border-radius: 8px"
              />
            </el-row>
          </div>
        </div>
      </div>
      <div class="col-1 d-flex align-items-center">
        <el-button icon="el-icon-close" class="p-1 fs-4" style="border: none;color: #212121;background-color: #ecf4f4"
                   circle
                   @click="doCancelReply"/>
      </div>
    </div>
    <div style="padding:2px 18px">
      <el-row c style="background-color: #f0f0f0;border-radius: 12px">
        <el-col :span="4">
          <el-upload
              :before-upload="beforeUpload"
              :http-request="doUpload"
              :show-file-list="false"
              action="#"
              style="display: inline-block">
            <el-button circle class="edit-btn" size="small">
              <img alt="文件" class="bt-icon" src="../../assets/image.svg">
            </el-button>
          </el-upload>
          <el-popover
              :placement="emojiPos"
              trigger="click"
              width="auto"
          >
            <VEmojiPicker @select="selectEmoji"/>
            <el-button slot="reference" circle class="edit-btn" size="small">
              <img alt="emoji" class="bt-icon" src="../../assets/emoji.svg">
            </el-button>
          </el-popover>

        </el-col>
        <el-col :span="18">
          <el-input
              id="input-chat"
              v-model="message.content"
              :autosize="{minRows:1,maxRows:5}"
              maxlength="500"
              placeholder="发送一条私信"
              style="font-weight: bold;font-size: 18px;  text-align: left;"
              type="textarea"
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
    </div>
  </div>


</template>
<script>

import ChunkUpload from "@/util/upload";
import {VEmojiPicker} from "v-emoji-picker";
import VClamp from "vue-clamp";

export default {
  name: "SendCard",
  props: {
    receiver: Array,
    emojiPos: {
      type: String,
      default: "top-start"
    },
    reply: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VClamp,
    VEmojiPicker
  },
  data() {
    return {
      message: {
        content: "",
        type: "TEXT"
      },
      file: null,
      fileUrl: ""
    }
  },
  computed: {
    currentToReply() {
      return this.$store.getters.getChatToReply;
    }
  },
  methods: {
    init() {
      this.message = {
        content: "",
        type: "TEXT"
      };
      this.file = null;
      this.fileUrl = "";
    },
    doEnter(e) {
      if (e.ctrlKey && e.keyCode === 13) {   //用户点击了ctrl+enter触发
        this.message.content = this.message.content + '\u200B' + '\n';
      } else { //用户点击了enter触发
        this.send();
      }
    },
    doCancelReply() {
      this.$store.commit('setChatToReply', null)
    },
    selectEmoji(emoji) {
      let input = document.getElementById("input-chat")
      let startPos = input.selectionStart;
      let endPos = input.selectionEnd;
      let resultText = this.message.content.substring(0, startPos) + emoji.data + this.message.content.substring(endPos)
      input.focus()
      input.selectionStart = startPos + emoji.data.length
      input.selectionEnd = startPos + emoji.data.length
      this.message.content = resultText
    },
    beforeUpload(file) {
      this.file = file;
      this.fileUrl = URL.createObjectURL(this.file);
      this.message.type = file.type.split('/').shift().toUpperCase();
    },
    doUpload() {
      let id = Date.now();
      let messages = this.generateMessage(id);
      this.$store.commit('addPrivateMessage', {
        payload: messages,
        top: true
      });
      let upload = new ChunkUpload(this.file, {
        onSuccess: (res) => {
          upload.stop();
          this.fileUrl = res.data.record.url;
          this.message.type = res.data.record.category.toUpperCase();
          messages = this.generateMessage(id);
          messages.forEach(msg => {
            this.$store.commit('wsSend', JSON.stringify(msg));
          });
          this.doCancelReply();
          this.init();
        },
        onError: (res) => {
          this.$message.error("文件上传失败\n" + res.message);
        }
      });
      upload.start();
    },
    generateMessage(tempId) {
      let user = this.$store.getters.getUser;
      let messages = [];
      let content = this.message.type === 'TEXT' ? this.message.content : this.fileUrl;
      this.receiver.forEach(receiver => {
        let id = tempId ? tempId : Math.round(Date.now());
        let conversation = Math.min(receiver.id, user.id) + "_" + Math.max(receiver.id, user.id);
        let message = {
          content: content,
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
          reference: this.currentToReply,
          createTime: Date.now()
        };
        messages.push(message);
      });
      return messages;
    },
    send() {
      if (this.message.content.length > 0) {
        let messages = this.generateMessage();
        this.$store.commit('addPrivateMessage', {
          payload: messages,
          top: true
        });
        messages.forEach(msg => {
          this.$store.commit('wsSend', JSON.stringify(msg));
        });
        this.doCancelReply();
        this.init();
      }
    },
    showRefer(content){
      this.$confirm(content,'',{
        showCancelButton:false,
        showConfirmButton:false,
        showClose:false
      }).catch(e=>{
        console.log(e)
      })
    }
  },
  destroyed() {
    this.doCancelReply();
  }
}
</script>
<style scoped>
::v-deep .el-textarea__inner {
  border: none;
  background-color: #f0f0f0;
  resize: none;
}


.bt-icon {
  width: 20px;
}

.edit-btn {
  border: none;
  background-color: #f0f0f0
}

.btn-send {
  border: none;
  color: #409EFF !important;
  background-color: #f0f0f0 !important;

}
</style>
