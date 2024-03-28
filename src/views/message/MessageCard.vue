<template>
  <div>
    <div style="text-align: left; padding: 6px">
      <div class="container text-center">
        <div
            :class="reverse ? ['flex-row-reverse'] : ['flex-row']"
            class="justify-content-start d-flex w-100"
        >
          <el-avatar
              :src="user.smallAvatarUrl"
              fit="cover"
              style="cursor: pointer"
              @click.native="$router.push('/profile?id=' + user.id)"
          />
          <div
              :class="reverse ? ['flex-row-reverse'] : []"
              class="d-flex align-items-center ms-2 me-2 text-start w-75 justify-content-start"
              style="overflow-wrap: break-word"
          >
            <span
                v-if="message.type === chatTypeEnums.TEXT"
                :class="
                reverse
                  ? ['bg-primary', 'text-white', ' rounded-start-3']
                  : ['bg-body-tertiary', 'rounded-end-3']
              "
                class="shadow-sm p-2 text-wrap rounded-bottom-3"
                style="max-width: 80%"
                v-html="formatText(message.content)"
            ></span>
            <div v-else-if="message.type === chatTypeEnums.IMAGE">
              <file-card
                  :index="message.content.index"
                  :preview-list="mediaList"
                  :url="message.content.url"
                  class="rounded-3 overflow-hidden"
                  style="max-width: 300px"
              />
            </div>
            <file-card
                v-else-if="message.type === chatTypeEnums.VIDEO"
                :index="message.content.index"
                :preview-list="mediaList"
                :type="message.content.type"
                :url="message.content.url"
                class="rounded-3 overflow-hidden"
                style="width: 300px; height: 300px"
            />
            <file-card
                v-else
                :size="message.content.size"
                :url="message.content.url"
            />
            <div
                v-if="message.status === messageStatusEnums.SENDING"
                class="spinner-border spinner-border-sm text-primary me-1 align-self-center"
                role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <div
                v-else-if="message.status === messageStatusEnums.FAILED"
                class="me-1"
            >
              <i class="bi bi-exclamation-circle-fill text-danger"/>
            </div>
            <div v-else class="ms-2 me-2 align-self-center">
              <el-popover :visible-arrow="false" trigger="click" width="auto">
                <el-row>
                  <el-button
                      class="border border-0 fw-bold text-black"
                      @click="doReply"
                  >
                    <i class="bi bi-reply"/>
                    回复
                  </el-button>
                </el-row>
                <el-row>
                  <el-button
                      class="border border-0 fw-bold text-black"
                      @click="copy(message.content)"
                  >
                    <i class="bi bi-copy"/> 复制
                  </el-button>
                </el-row>
                <el-row>
                  <el-button
                      class="border border-0 fw-bold text-black"
                      @click="doDelete"
                  >
                    <i class="bi bi-trash3"/>
                    删除
                  </el-button>
                </el-row>
                <el-button
                    slot="reference"
                    circle
                    icon="el-icon-more"
                    style="border: none"
                ></el-button>
              </el-popover>
            </div>
          </div>
        </div>
        <div
            v-if="message.reference && message.reference.id"
            :class="
            reverse
              ? ['justify-content-end', 'me-5']
              : ['justify-content-start', 'ms-5']
          "
            class="d-flex align-items-center"
        >
          <div
              v-if="
              message.reference.status === messageStatusEnums.DELETE ||
              message.reference.status === currentUser.id ||
              message.reference.conversationId !== message.conversationId
            "
              class="bg-dark-subtle m-1 shadow-sm p-2 rounded text-secondary"
              style="font-size: 12px; overflow-wrap: break-word"
          >
            消息已删除或不可用
          </div>
          <div v-else style="max-width: 80%; text-align: left">
            <div
                class="text_chat_msg bg-dark-subtle m-1 shadow-sm p-2 rounded"
                style="font-size: 12px"
            >
              <span>{{ message.reference.senderName }}:</span>
              <v-clamp
                  v-if="message.reference.type === chatTypeEnums.TEXT"
                  :max-lines="2"
                  autoresize
                  style="cursor: pointer"
                  @click.native="showRefer(message.reference.content)"
              >{{ message.reference.content }}
              </v-clamp>
              <el-image
                  v-else-if="message.reference.type === chatTypeEnums.IMAGE"
                  :preview-src-list="[message.reference.content.url]"
                  :src="message.reference.content.url"
                  fit="container"
                  style="max-height: 60px; border-radius: 8px"
              />
              <div
                  v-else-if="message.reference.type === chatTypeEnums.VIDEO"
                  style="max-width: 300px"
              >
                <file-card :url="message.reference.content.url"/>
              </div>
              <file-card v-else :url="message.reference.content.url"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatText, getDate, getMessageDate, getNewMsgCount,} from "@/util/tools";
import {msgDate} from "@/util/formatter";
import VClamp from "vue-clamp";
import {copy} from "@/util/clipboard";
import {chatTypeEnums, messageStatusEnums} from "@/enums/enums";
import FileCard from "@/views/media/FileCard.vue";
import {mapState} from "vuex";
import {chatMutations} from "@/config/vuex/mutation-types";
import {chatActions} from "@/config/vuex/action-types";

export default {
  name: "MessageCard",
  computed: {
    chatTypeEnums() {
      return chatTypeEnums;
    },
    messageStatusEnums() {
      return messageStatusEnums;
    },
    ...mapState({
      currentUser: (state) => state.user,
    }),
  },
  components: {
    FileCard,
    VClamp,
  },
  props: {
    message: {},
    user: {},
    reverse: {
      type: Boolean,
      default: false,
    },
    mediaList: Array,
    showAvatar: true,
    showNickname: false,
    showPopover: true,
  },
  methods: {
    copy,
    formatText,
    msgDate,
    getNewMsgCount,
    getMessageDate,
    getDate,
    doReply() {
      this.$store.commit(`chat/${chatMutations.SET_CHAT_REPLY}`, {
        message: this.message,
      });
    },
    doDelete() {
      this.$store.dispatch(`chat/${chatActions.DELETE_CHAT_RECORD}`, {
        conversation: this.message.conversationId,
        id: this.message.id,
      });
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
  created() {
  },
};
</script>

<style scoped>
.text_chat_msg {
  display: inline-grid;
}

.loading {
  margin-right: 2px;
  display: inline-flex;
  width: 16px;
  height: 16px;
  border: 2px solid #409eff;
  border-top-color: transparent;
  border-radius: 100%;
  animation: circle infinite 0.75s linear;
}

.loading-box {
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background-color: #ffffff;
}

@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
<style>
.bottom-msg {
  background-color: #409eff !important;
  color: white;
  min-width: 10px !important;
  padding: 12px;
  font-size: 14px;
}
</style>
