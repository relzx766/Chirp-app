<template>
  <div>
    <el-row style="text-align: left">
      <el-col :span="3">
        <el-avatar :src="participant.smallAvatarUrl"/>
      </el-col>
      <el-col :span="17">
        <div style="font-size: 14px; color: #303133; font-weight: 560">
          <el-breadcrumb separator="·">
            <el-breadcrumb-item>{{ participant.nickname }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{
                msgDate(
                    conversation.messages.length > 0
                        ? conversation.messages[conversation.messages.length - 1]
                            .createTime
                        : conversation.date
                )
              }}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="conversation.unread > 0">
              <span class="badge bg-danger rounded-circle">{{
                  conversation.unread < 99 ? conversation.unread : 99
                }}</span></el-breadcrumb-item
            >
          </el-breadcrumb>
        </div>
        <div v-if="conversation.messages.length > 0" class="pt-1">
          <span
              class="text-truncate"
              style="
              font-size: 14px;
              color: #909399;
              max-width: 90%;
              display: inline-block;
            "
          >
            <i
                v-if="
                conversation.messages[conversation.messages.length - 1]
                  .status === messageStatusEnums.FAILED
              "
                class="bi bi-exclamation-circle-fill text-danger"
            />
            <span
                v-if="
                conversation.messages[conversation.messages.length - 1]
                  .status === messageStatusEnums.SENDING
              "
                class="spinner-border spinner-border-sm text-primary"
                role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </span>
            {{
              getMsgHit(
                  conversation.messages[conversation.messages.length - 1]
              )
            }}
          </span>
        </div>
      </el-col>
      <el-col :span="4" style="text-align: right; font-size: 12px">
        <el-popover
            :visible-arrow="false"
            placement="right"
            trigger="click"
            width="auto"
        >
          <div>
            <el-row>
              <el-button
                  v-if="!isPinned"
                  class="border-0 border-bottom fw-bold text-black"
                  style="width: 100%"
                  @click="setPinned"
              >
                <i class="bi bi-bookmark-star"/>
                置顶对话
              </el-button
              >
              <el-button
                  v-if="isPinned"
                  class="border-0 border-bottom fw-bold text-black"
                  style="width: 100%"
                  @click="setPinned"
              >
                <i class="bi bi-bookmark-x"/>
                取消置顶
              </el-button
              >
            </el-row>
            <el-row>
              <el-button
                  class="border-0 fw-bold text-black"
                  icon="el-icon-delete"
                  style="width: 100%"
                  @click="doDelete"
              >删除会话
              </el-button
              >
            </el-row>
          </div>
          <el-button
              slot="reference"
              :class="cardClasses"
              circle
              class="border-0"
              icon="el-icon-more"
              @click.stop
          ></el-button>
        </el-popover>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {msgDate} from "@/util/formatter";
import {getDate} from "@/util/tools";
import {leaveConv, updatePinned} from "@/api/advice";
import {messageStatusEnums} from "@/enums/enums";
import {mapState} from "vuex";
import {getMsgHit, getOtherParticipantID} from "@/util/chatUtil";
import {settingMutations} from "@/config/vuex/mutation-types";
import {chatActions} from "@/config/vuex/action-types";

export default {
  name: "ConversationCard",
  computed: {
    messageStatusEnums() {
      return messageStatusEnums;
    },
    ...mapState({
      user: (state) => state.user,
      pinnes: (state) => state.setting.chat.pinned,
    }),
    participant() {
      let otherParticipantID = getOtherParticipantID(
          this.conversation.conversation,
          this.user.id
      );
      return this.user.userList[otherParticipantID];
    },
    cardClasses() {
      let c = [];
      if (this.isPinned) {
        c.push("bg-light");
      } else {
        if (this.conversation.conversation === this.$route.params.id) {
          c.push("bg-focus-1");
        }
      }
      return c;
    },
    isPinned() {
      let conv = this.conversation.conversation;
      return this.pinnes.includes(conv);
    },
  },
  props: {
    conversation: Object,
    pinned: Boolean,
  },
  data() {
    return {
      focusConversation: {
        borderRight: "2px #409EFF solid",
        backgroundColor: "#ecf4f4",
      },
    };
  },
  methods: {
    getMsgHit,
    msgDate,
    getDate,

    getTextClass(message) {
      if (message.status === messageStatusEnums.SENDING) {
        return ["text-primary"];
      } else if (message.status === messageStatusEnums.FAILED) {
        return ["text-danger"];
      } else {
        return [];
      }
    },
    setPinned() {
      let conversation = this.conversation.conversation;
      if (!this.isPinned) {
        this.$store.commit(`setting/${settingMutations.ADD_CHAT_PINNED}`, {
          pinned: conversation,
        });
      } else {
        let index = this.pinnes.indexOf(conversation);
        this.$store.commit(`setting/${settingMutations.SLICE_CHAT_PINNED}`, {
          index,
        });
      }
      updatePinned(this.pinnes);
    },
    doDelete() {
     this.$store.dispatch(`chat/${chatActions.LEAVE_CONVERSATION}`,{conversation:this.conversation.conversation})
      this.$router.push("/message");
    },
  },
  mounted() {
  },
};
</script>
<style scoped>
.loading {
  display: inline-block;
  animation: turn infinite 0.75s linear;
}

@keyframes turn {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
