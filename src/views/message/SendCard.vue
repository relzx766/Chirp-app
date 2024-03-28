<template>
  <div>
    <div
        v-if="reply && currentToReply"
        class="text-start row mb-2 bg-info-1 border-start border-3 border-dark fs-8 ms-0"
        style="font-weight: 600"
    >
      <div class="col-11">
        <div class="row">
          <div class="col-auto d-grid align-items-center">
            <div>
              <el-row>{{ currentToReply.senderName }}</el-row>
              <el-row v-if="currentToReply.type === chatTypeEnums.TEXT">
                <i class="el-icon-document fw-bold"/><span>文本</span>
              </el-row>
              <el-row v-else-if="currentToReply.type === chatTypeEnums.IMAGE">
                <i class="el-icon-camera fw-bold"/><span>图像</span>
              </el-row>
              <el-row v-else-if="currentToReply.type === chatTypeEnums.VIDEO">
                <i class="bi bi-play-circle"/><span>视频</span>
              </el-row>

              <el-row v-else-if="currentToReply.type === chatTypeEnums.FILE">
                <i class="bi bi-file-earmark"/><span>文件</span>
              </el-row>
            </div>
          </div>

          <div
              v-if="currentToReply.type === chatTypeEnums.TEXT"
              class="row w-100"
          >
            <v-clamp
                :max-lines="2"
                autoresize
                class="finger"
                @click.native="showRefer(currentToReply.content)"
            >
              {{ currentToReply.content }}
            </v-clamp>
          </div>

          <div
              v-else-if="currentToReply.type === chatTypeEnums.IMAGE"
              class="col"
          >
            <el-row class="text-end">
              <el-image
                  :preview-src-list="[currentToReply.content.url]"
                  :src="currentToReply.content.url"
                  fit="cover"
                  style="height: 60px; border-radius: 8px"
              />
            </el-row>
          </div>
          <div
              v-else-if="currentToReply.type === chatTypeEnums.VIDEO"
              class="col d-flex justify-content-end"
          >
            <div style="height: 60px; width: 60px">
              <file-card :url="currentToReply.content.url" class="w-100 h-100"/>
            </div>
          </div>
          <div
              v-else-if="currentToReply.type === chatTypeEnums.FILE"
              class="row w-100"
          >
            <v-clamp :max-lines="1" autoresize>
              {{ currentToReply.content.url }}
            </v-clamp>
          </div>
        </div>
      </div>
      <div class="col-1 d-flex align-items-center">
        <el-button
            circle
            class="p-1 fs-4 bg-info-1 border-0"
            icon="el-icon-close"
            style="color: #212121"
            @click="doCancelReply"
        />
      </div>
    </div>
    <div>
      <el-row
          class="d-flex align-items-center m-2 bg-info-1"
          style="border-radius: 12px"
      >
        <el-col :span="3" class="text-start">
          <el-upload
              :before-upload="beforeUpload"
              :http-request="doUpload"
              :show-file-list="false"
              action="#"
              style="display: inline-block"
          >
            <el-button circle class="edit-btn" size="small">
              <i class="bi bi-image fs-6 text-primary"/>
            </el-button>
          </el-upload>
          <el-popover :placement="emojiPos" trigger="click" width="auto">
            <VEmojiPicker @select="selectEmoji"/>
            <el-button slot="reference" circle class="edit-btn" size="small">
              <i class="bi bi-emoji-smile fs-6 text-primary"/>
            </el-button>
          </el-popover>
        </el-col>
        <el-col :span="19">
          <!-- 这个el-input真的卡的离谱 -->
          <el-input
              id="input-chat"
              v-model="message.content"
              :autosize="{ minRows: 1, maxRows: 5 }"
              class="fs-6 fw-bold text-start"
              maxlength="1000"
              placeholder="发送一条私信"
              type="textarea"
              @keyup.enter.native="doEnter"
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button
              :disabled="message.content.length <= 0"
              circle
              class="btn-send"
              size="medium"
              type="primary"
              @click="send"
          >
            <svg
                v-if="message.content.length <= 0"
                class="icon"
                height="20"
                p-id="2591"
                t="1698149230119"
                version="1.1"
                viewBox="0 0 1024 1024"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  d="M243.029333 512L98.133333 139.605333c-10.069333-25.941333 15.189333-50.730667 40.192-41.898666l3.968 1.706666 768 384a32 32 0 0 1 4.138667 54.741334l-4.138667 2.474666-768 384c-24.874667 12.416-51.925333-10.453333-45.44-36.138666l1.28-4.096L243.029333 512 98.133333 139.605333 243.029333 512zM187.904 193.706667l111.317333 286.293333h282.794667a32 32 0 0 1 31.701333 27.648l0.298667 4.352a32 32 0 0 1-27.690667 31.701333l-4.309333 0.298667H299.221333l-111.317333 286.293333L824.490667 512 187.861333 193.706667z"
                  fill="rgba(64, 158, 255,0.5)"
                  p-id="2592"
              ></path>
            </svg>
            <svg
                v-if="message.content.length > 0"
                class="icon"
                height="20"
                p-id="2591"
                t="1698149230119"
                version="1.1"
                viewBox="0 0 1024 1024"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  d="M243.029333 512L98.133333 139.605333c-10.069333-25.941333 15.189333-50.730667 40.192-41.898666l3.968 1.706666 768 384a32 32 0 0 1 4.138667 54.741334l-4.138667 2.474666-768 384c-24.874667 12.416-51.925333-10.453333-45.44-36.138666l1.28-4.096L243.029333 512 98.133333 139.605333 243.029333 512zM187.904 193.706667l111.317333 286.293333h282.794667a32 32 0 0 1 31.701333 27.648l0.298667 4.352a32 32 0 0 1-27.690667 31.701333l-4.309333 0.298667H299.221333l-111.317333 286.293333L824.490667 512 187.861333 193.706667z"
                  fill="rgba(64, 158, 255)"
                  p-id="2592"
              ></path>
            </svg>
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {VEmojiPicker} from "v-emoji-picker";
import VClamp from "vue-clamp";
import {doEncrypt, generateIv, getShareKey} from "@/util/encrypt";
import {chatTypeEnums, messageStatusEnums} from "@/enums/enums";
import FileCard from "@/views/media/FileCard.vue";
import {mapState} from "vuex";
import {chatMutations} from "@/config/vuex/mutation-types";
import {chatActions, e2eeActions, wsActions,} from "@/config/vuex/action-types";
import {getOtherParticipantID} from "@/util/chatUtil";
import ChunkFile from "@/util/uploadUtil";
import {getCategory} from "@/util/tools";

export default {
  name: "SendCard",
  props: {
    receiver: Array,
    emojiPos: {
      type: String,
      default: "top-start",
    },
    reply: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VClamp,
    VEmojiPicker,
    FileCard,
  },
  data() {
    return {
      message: {
        content: "",
        type: chatTypeEnums.TEXT,
      },
      media: {
        id: "",
        size: "",
        type: "",
        url: "",
      },
      file: null,
      fileUrl: "",
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
      chat: (state) => state.chat,
      e2ee: (state) => state.e2ee,
    }),
    chatTypeEnums() {
      return chatTypeEnums;
    },
    messageStatusEnums() {
      return messageStatusEnums;
    },
    currentToReply() {
      return this.chat.reply;
    },
  },
  methods: {
    init() {
      this.message = {
        content: "",
        type: chatTypeEnums.TEXT,
      };
      this.file = null;
      this.fileUrl = "";
    },
    doEnter(e) {
      if (e.ctrlKey && e.keyCode === 13) {
        //用户点击了ctrl+enter触发
        this.message.content = this.message.content + "\u200B" + "\n";
      } else {
        //用户点击了enter触发
        this.send();
      }
    },
    doCancelReply() {
      this.$store.commit(`chat/${chatMutations.SET_CHAT_REPLY}`, {
        message: null,
      });
    },
    selectEmoji(emoji) {
      let input = document.getElementById("input-chat");
      let startPos = input.selectionStart;
      let endPos = input.selectionEnd;
      let resultText =
          this.message.content.substring(0, startPos) +
          emoji.data +
          this.message.content.substring(endPos);
      input.focus();
      input.selectionStart = startPos + emoji.data.length;
      input.selectionEnd = startPos + emoji.data.length;
      this.message.content = resultText;
    },
    beforeUpload(file) {
      this.file = file;
      this.media = {
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      };
      let extension = file.name.split(".").pop();
      this.message.type = getCategory(extension)
          ? getCategory(extension)
          : chatTypeEnums.FILE;
    },
    doUpload() {
      let id = Date.now();
      this.generateMessage(id)
          .then((messages) => {
            return this.$store.dispatch(
                `chat/${chatActions.ADD_NEW_CHAT_RECORD}`,
                {chats: messages, isNew: true}
            );
          })
          .then(() => {
            let that = this;
            let upload = new ChunkFile(this.file, {
              onsuccess: (res) => {
                that.media = res.data.record;
                that.message.type = getCategory(that.media.url.split(".").pop());
                that
                    .generateMessage(id)
                    .then((messages) => {
                      let dispatchPromises = messages.map((msg) => {
                        return that.$store.dispatch(
                            `ws/${wsActions.COMMIT_MESSAGE}`,
                            {message: JSON.stringify(msg)}
                        );
                      });
                      return Promise.all(dispatchPromises);
                    })
                    .then(() => {
                      that.doCancelReply();
                      that.init();
                    });
              },
              onerror: (res) => {
                this.$message.error("文件上传失败\n" + res.message);
              },
            });
            upload.start();
          })
          .catch((e) => {
            this.$message.error(`发送消息失败==>${e}`);
          });
    },
    generateMessage(tempId) {
      let content =
          this.message.type === chatTypeEnums.TEXT
              ? this.message.content
              : JSON.stringify(this.media);
      let shareKeys = this.chat.shareKeys;
      //已初始化过密钥的对话
      let existsShareKeyConv = Object.keys(shareKeys);
      //要生成的全部对话
      let conversations = this.receiver.map(
          (receiver) =>
              Math.min(receiver.id, this.user.id) +
              "_" +
              Math.max(receiver.id, this.user.id)
      );
      //未初始化过密钥的对话
      let unInitConv = conversations.filter(
          (con) => !existsShareKeyConv.includes(con)
      );
      let receiverIds = this.receiver.map((receiver) => receiver.id);
      //未拉取过公钥的用户
      let unFetchKeyUsers = receiverIds.filter(
          (id) => !this.e2ee.publicKeys[id]
      );
      return this.$store
          .dispatch(`e2ee/${e2eeActions.FETCH_PUBLIC_KEY}`, {
            userIds: unFetchKeyUsers,
          })
          .then(() => {
            unInitConv.forEach((con) => {
              let receiverId = getOtherParticipantID(con, this.user.id);
              let shareKey = getShareKey(
                  this.e2ee.publicKeys[receiverId],
                  this.e2ee.privateKey,
                  this.e2ee.prime
              );
              this.$store.commit(`chat/${chatMutations.SET_CHAT_SHARE_KEY}`, {
                conversation: con,
                shareKey: shareKey,
              });
            });
          })
          .then(async () => {
            return await Promise.all(
                this.receiver.map(async (receiver) => {
                  let id = tempId ? tempId : Math.round(Date.now());
                  let conversation = Math.min(receiver.id, this.user.id) + "_" + Math.max(receiver.id, this.user.id);
                  let key = this.chat.shareKeys[conversation];
                  let iv = generateIv();
                  content = await doEncrypt(key, content, iv);
                  let reference = this.reply ? this.currentToReply : null;
                  if (reference) {
                    reference.content =
                        reference.type === chatTypeEnums.TEXT
                            ? reference.content
                            : JSON.stringify(reference.content);
                    reference.reference = null;
                  }
                  let message = {
                    content: content,
                    iv: iv,
                    type: this.message.type,
                    conversationId: conversation,
                    senderId: this.user.id,
                    senderName: this.user.nickname,
                    senderAvatar: this.user.smallAvatarUrl,
                    receiverId: receiver.id,
                    receiverName: receiver.nickname,
                    receiverAvatar: receiver.smallAvatarUrl,
                    id: id,
                    //这里必须让tempId为字符串，因为后端以string接收
                    tempId: `${id}`,
                    reference: reference,
                    createTime: Date.now(),
                    status: messageStatusEnums.SENDING,
                  };
                  if (message.reference) {
                    message.reference.content = await doEncrypt(
                        key,
                        message.reference.content,
                        message.reference.iv
                    );
                  }
                  return message;
                })
            );
          });
    },
    send() {
      if (this.message.content.length > 0) {
        this.generateMessage(Date.now())
            .then((messages) => {
              let clone = structuredClone(messages);
              return this.$store
                  .dispatch(`chat/${chatActions.ADD_NEW_CHAT_RECORD}`, {
                    chats: clone,
                    isNew: true,
                  })
                  .then(() => messages);
            })
            .then((messages) => {
              const dispatchPromises = messages.map((msg) => {
                return this.$store.dispatch(`ws/${wsActions.COMMIT_MESSAGE}`, {
                  message: JSON.stringify(msg),
                });
              });
              return Promise.all(dispatchPromises);
            })
            .then(() => {
              this.doCancelReply();
              this.init();
            })
            .catch((e) => {
              console.log(e);
              this.$message.error(`发送消息失败==>${e}`);
            });
      }
    },
    showRefer(content) {
      this.$confirm(content, "", {
        showCancelButton: false,
        showConfirmButton: false,
        showClose: false,
      }).catch((e) => {
        console.log(e);
      });
    },
  },
  destroyed() {
    this.doCancelReply();
  },
};
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
  background-color: #f0f0f0;
}

.btn-send {
  border: none;
  color: #409eff !important;
  background-color: #f0f0f0 !important;
}
</style>
