<template>

  <div class="container p-0">
    <div style="height: 100%;display: flex;flex-direction: column;" v-if="currentChat">
      <div class="row " style="height: 70px;">
        <div class="col d-flex align-items-center justify-content-start p-3 ps-4">
          <el-avatar :size="36" :src="participant.smallAvatarUrl"/>
          <span style="font-weight: bold;font-size: 16px;margin-left: 12px">
            {{ participant.nickname }}
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
              :user-id="participant.id"
              :conversation="currentChat.conversation"/>
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
                     class="fs-6 shadow-lg  border-0 mb-4"></el-button>
          <el-row v-for="(item,index) in currentChat.messages" :key="item.id">
            <!--          如果消息间隔相差2分组同时不是第一条-->
            <el-row
                v-if="index>0&&subtractDates(currentChat.messages[index].createTime,currentChat.messages[index-1].createTime)>2*60*1000"
                class=" text-body-tertiary chat-date">
              {{ chatDate(item.createTime) }}
            </el-row>
            <el-row v-if="index===0" class="text-body-tertiary chat-date">
              {{ chatDate(item.createTime) }}
            </el-row>
            <message-card :id="item.id"
                          :class="index===currentChat.messages.length-1?'mb-4':'mb-2'"
                          :message="item"
                          :reverse="item.senderId===user.id"
                          :user="item.senderId===user.id?user:participant"
                          :media-list="currentChat.messages.filter(msg=>msg.type==='IMAGE').map(msg=>msg.content)"
                          class="mt-2 mb-2"/>

          </el-row>

        </div>

      </div>
      <div
          class="align-self-end w-100 overflow-hidden bg-white border-top"
          style="min-height: 50px;">
        <send-card :receiver="[participant]" :reply="true" style="border-radius: 12px;"/>
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
import {mapState} from "vuex";
import {getOtherParticipantID} from "@/util/chatUtil";
import {chatActions} from "@/config/vuex/action-types";

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
      isBottom: false,
      isLoading: false,
      infoDrawer: false,
      backToBottom: false,
    }
  },
  computed: {
    ...mapState({
      chat:state => state.chat,
      user:state => state.user
    }),
    currentChat(){
      return this.chat.record[this.conversation];
    },
    participant() {
      let participantID = getOtherParticipantID(this.conversation,this.user.id);
      return this.user.userList[participantID];
    },
    conversation(){
     return  this.$route.params.id;
    },
  },
  methods: {
    chatDate, msgDate, subtractDates,
  loadMore($state) {
      this.$store.dispatch(`chat/${chatActions.LOAD_CHAT_PAGE}`,{conversation:this.conversation}).then(()=>{
        if (this.currentChat.bottom){
          $state.complete();
        }else {
          $state.loaded();
        }
      }).catch(e=>{
        $state.complete();
        this.$message.error(e.message);
      })
    },
    scrollE(e) {
      this.backToBottom =  e.target.scrollHeight-e.target.scrollTop-e.target.clientHeight > e.target.clientHeight;
    },
    backBottom() {
      this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
    }
  },
  created() {
this.$store.dispatch(`chat/${chatActions.READ_CONVERSATION}`,{conversation:this.conversation,status:true});
  },
  mounted() {
    this.backBottom();
  },
  destroyed() {
    if (this.conversation){
      this.$store.dispatch(`chat/${chatActions.READ_CONVERSATION}`,{conversation:this.conversation,status:false});
    }
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
