<template>
  <div class="container p-0">
    <div
        v-if="currentChat"
        style="height: 100%; display: flex; flex-direction: column"
    >
      <div class="row" style="height: 70px">
        <div
            class="col d-flex align-items-center justify-content-start ps-4"
            @click="infoDrawer = true"
        >
          <el-avatar :size="36" :src="participant.smallAvatarUrl"/>
          <span style="font-weight: bold; font-size: 16px; margin-left: 12px">
            {{ participant.nickname }}
          </span>
        </div>
        <div class="col d-flex align-items-center justify-content-end pe-4">
          <el-button
              circle
              class="border border-0 p-2 fs-5"
              icon="el-icon-more"
              @click="infoDrawer = true"
          />
        </div>
        <el-drawer
            :append-to-body="true"
            :visible.sync="infoDrawer"
            :with-header="false"
        >
          <el-row class="fs-5 m-2" style="text-align: left; color: #303133">
            <el-button
                circle
                class="p-1 fs-5 fw-bold border-0"
                icon="el-icon-back"
                @click="infoDrawer = false"
            />
            <span class="ms-3 fw-bold">对话信息</span>
          </el-row>
          <conversation-info
              :conversation="currentChat.conversation"
              :user-id="participant.id"
              class="overflow-x-hidden"
          />
        </el-drawer>
      </div>
      <div
          ref="content"
          class="overflow-y-scroll content"
          style="flex: 1"
          @scroll="scrollE"
      >
        <div>
          <infinite-loading :distance="10" direction="top" @infinite="loadMore">
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
          <el-button
              v-show="backToBottom"
              class="fs-6 shadow-lg border-0 mb-4"
              icon="el-icon-bottom"
              round
              size="small"
              style="
              position: fixed;
              right: 5%;
              bottom: 10%;
              z-index: 999;
              color: #409eff;
            "
              @click="backBottom"
          ></el-button>
          <el-row v-for="(item, index) in currentChat.messages" :key="item.id">
            <!--          如果消息间隔相差2分组同时不是第一条-->
            <el-row
                v-if="
                index > 0 &&
                subtractDates(
                  currentChat.messages[index].createTime,
                  currentChat.messages[index - 1].createTime
                ) >
                  2 * 60 * 1000
              "
                class="text-body-tertiary chat-date"
            >
              {{ chatDate(item.createTime) }}
            </el-row>
            <el-row v-if="index === 0" class="text-body-tertiary chat-date">
              {{ chatDate(item.createTime) }}
            </el-row>
            <message-card
                :id="item.id"
                :class="
                index === currentChat.messages.length - 1 ? 'mb-4' : 'mb-2'
              "
                :media-list="mediaList"
                :message="item"
                :reverse="item.senderId === user.id"
                :user="item.senderId === user.id ? user : participant"
                class="mt-2 mb-2"
            />
          </el-row>
        </div>
      </div>
      <div
          class="align-self-end w-100 overflow-hidden bg-white border-top"
          style="min-height: 50px"
      >
        <send-card
            :receiver="[participant]"
            :reply="true"
            style="border-radius: 12px"
        />
      </div>
    </div>
  </div>
</template>
<script>
import MessageCard from "@/views/message/MessageCard.vue";
import SendCard from "@/views/message/SendCard.vue";
import {subtractDates} from "@/util/tools";
import {chatDate, msgDate} from "@/util/formatter";
import ConversationInfo from "@/views/message/ConversationInfo.vue";
import InfiniteLoading from "vue-infinite-loading";
import {mapState} from "vuex";
import {getOtherParticipantID} from "@/util/chatUtil";
import {chatActions} from "@/config/vuex/action-types";
import {chatTypeEnums} from "@/enums/enums";

export default {
  name: "ChatCard",

  props: {},
  components: {
    ConversationInfo,
    SendCard,
    MessageCard,
    InfiniteLoading,
  },
  data() {
    return {
      isBottom: false,
      isLoading: false,
      infoDrawer: false,
      backToBottom: false,
      currentChat: [],
    };
  },
  computed: {
    ...mapState({
      chat: (state) => state.chat,
      user: (state) => state.user,
    }),
    participant() {
      let participantID = getOtherParticipantID(
          this.conversation,
          this.user.id
      );
      return this.user.userList[participantID];
    },
    conversation() {
      return this.$route.params.id;
    },
    mediaList() {
      let i = 0;
      return this.currentChat.messages
          .filter(
              (msg) =>
                  msg.type === chatTypeEnums.IMAGE || msg.type === chatTypeEnums.VIDEO
          )
          .map((msg) => {
            msg.content.index = i;
            i++;
            return msg.content;
          });
    },
  },
  methods: {
    chatDate,
    msgDate,
    subtractDates,
    loadMore($state) {
      this.$store
          .dispatch(`chat/${chatActions.LOAD_CHAT_PAGE}`, {
            conversation: this.conversation,
          })
          .then(() => {
            if (this.currentChat.bottom) {
              $state.complete();
            } else {
              $state.loaded();
            }
          })
          .catch((e) => {
            $state.complete();
            this.$message.error(e.message);
          });
    },
    scrollE(e) {
      this.backToBottom =
          e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight >
          e.target.clientHeight;
    },
    backBottom() {
      if (this.$refs.content) {
        this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
      }
    },
  },
  watch: {
    "$store.state.chat.count": {
      handler() {
        this.currentChat = this.chat.record[this.conversation];
        this.$store.dispatch(`chat/${chatActions.READ_CONVERSATION}`, {
          conversation: this.conversation,
          status: true,
        });
      },
      immediate: true,
    },
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.backBottom();
    });
  },
  destroyed() {
  },
};
</script>
<style scoped>
/* 滚动条整体 */
.content::-webkit-scrollbar {
  display: none;
}

.chat-date {
  font-size: 14px;
}
</style>
