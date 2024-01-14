<template>

  <div class="container p-0">
    <div style="height: 100%;display: flex;flex-direction: column;" v-if="getChat">
      <div class="row " style="height: 70px;">
        <div class="col d-flex align-items-center justify-content-start p-3 ps-4">
          <el-avatar :size="36" :src="getChat.user.smallAvatarUrl"/>
          <span style="font-weight: bold;font-size: 16px;margin-left: 12px">
            {{ getChat.user.nickname }}
          </span>
        </div>
        <div class="col-1 p-3 pe-5">
          <el-button icon="el-icon-more" class="border border-0 p-1  fs-5" circle @click="infoDrawer=true"/>
        </div>
        <el-drawer
            :visible.sync="infoDrawer"
            :with-header="false"
            :append-to-body="true">
          <el-row class="fs-5 m-2" style="text-align: left;color: #303133">
            <el-button class="p-1 fs-5 fw-bold border-0 " circle icon="el-icon-back" @click="infoDrawer=false"/>
            <span class="ms-3 fw-bold">对话信息</span>
          </el-row>
          <conversation-info
              class="overflow-x-hidden"
              :user-id="getChat.user.id"
              :conversation="getChat.conversation"/>
        </el-drawer>
      </div>
      <div ref="content" class="overflow-y-scroll content"
           style="flex: 1" @scroll="scrollE">
        <div>
          <infinite-loading
              direction="top"
              :distance="10"
              @infinite="loadMore">
            <div slot="no-more"></div>
            <div slot="no-results"></div>

          </infinite-loading>
          <el-button v-show="backToBottom"
                     size="small"
                     style="position:fixed;right: 5%;bottom: 10%;z-index: 999;color:#409EFF;"
                     icon="el-icon-bottom"
                     round
                     @click="backBottom"
                     class="fs-6 shadow-lg  border-0"></el-button>
          <el-row v-for="(item,index) in getChat.messages" :key="item.id">
            <!--          如果消息间隔相差2分组同时不是第一条-->
            <el-row
                v-if="index>0&&subtractDates(getChat.messages[index].createTime,getChat.messages[index-1].createTime)>2*60*1000"
                class=" text-body-tertiary chat-date">
              {{ chatDate(item.createTime) }}
            </el-row>
            <el-row v-if="index===0" class="text-body-tertiary chat-date">
              {{ chatDate(item.createTime) }}
            </el-row>
            <message-card :id="item.id"
                          :class="index===getChat.messages.length-1?'mb-4':'mb-2'"
                          :message="item"
                          :reverse="item.senderId===$store.getters.getUser.id"
                          :user="item.senderId===$store.getters.getUser.id?$store.getters.getUser:getChat.user"
                          :media-list="getChat.messages.filter(msg=>msg.type==='IMAGE').map(msg=>msg.content)"
                          class="mt-2 mb-2"/>

          </el-row>

        </div>

      </div>
      <div style="min-height: 50px;align-self: flex-end;width: 100%;overflow: hidden;
         background-color: white;
         border-top: 1px solid #DCDFE6;">
        <send-card :receiver="[getChat.user]" :reply="true" style="border-radius: 12px;"/>
      </div>
    </div>


  </div>
</template>
<script>
import MessageCard from "@/views/message/MessageCard.vue";
import SendCard from "@/views/message/SendCard.vue";
import {getChatHistory, markConversationRead} from "@/api/advice";
import {subtractDates} from "@/util/tools";
import {chatDate, msgDate} from "@/util/formatter";
import ConversationInfo from "@/views/message/ConversationInfo.vue";
import InfiniteLoading from "vue-infinite-loading";

export default {
  name: "ChatCard",

  props: {},
  components: {
    ConversationInfo,
    SendCard,
    MessageCard,
    InfiniteLoading
  },
  data() {
    return {
      conversation: '',
      isBottom: false,
      isLoading: false,
      infoDrawer: false,
      backToBottom: false,
    }
  },
  computed: {
    getChat() {
      return this.$store.getters.getConv(this.conversation);
    }
  },
  methods: {
    chatDate, msgDate, subtractDates,
    loadMore($state) {
      if (Object.values(this.getChat.user).length > 0) {
        let page = this.getChat.page;
        getChatHistory(this.getChat.user.id, page).then(res => {
          if (res.data.record.length <= 0) {
            $state.complete();
          } else {
            this.$store.dispatch('pushMessage', {
              payload: res.data.record,
              top: false
            });
            this.$store.commit('setConvOption', {
              conversation: this.getChat.conversation,
              page: page + 1
            });
            $state.loaded();
          }
        });
      }
    },
    scrollE(e) {
      this.backToBottom = e.target.scrollTop - e.target.clientHeight < -200;
    },
    backBottom() {
      this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
    }
  },
  created() {
    this.conversation = this.$route.params.id;
    markConversationRead([this.conversation]);
    this.$store.commit('setConvOption', {conversation: this.conversation, unread: 0, status: true});
  },
  mounted() {
    this.backBottom();
  },
  destroyed() {
    markConversationRead([this.conversation])
    this.$store.commit('setConvOption', {conversation: this.conversation, status: false, unread: 0});
  }

}
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
