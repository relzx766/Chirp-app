<template>

  <div>
    <div  style="height: 100vh">
      <div class="row ">
        <div class="col d-flex align-items-center justify-content-start p-3 ps-4">
          <el-avatar :size="36" :src="getChat.user.smallAvatarUrl"/>
          <span style="font-weight: bold;font-size: 16px;margin-left: 12px">
            {{ getChat.user.nickname }}
          </span>
        </div>
        <div class="col-1 p-3 pe-5">
          <el-button icon="el-icon-setting" class="border border-0 p-1  fs-5" circle @click="infoDrawer=true"/>
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
           style="height: 90%;  padding-bottom: 24px;padding-top: 24px"
           @scroll="loadMore">
        <div  style="height: 104%;">
          <el-row v-for="(item,index) in getChat.messages" :key="item.id" >
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
    </div>
    <div class="position-fixed bottom-0 end-1"
         style="width: 44%;min-height: 50px;
         background-color: white;border-right:  1px solid #DCDFE6;
         border-top: 1px solid #DCDFE6;
">
      <send-card :receiver="[getChat.user]" :reply="true" style="border-radius: 12px;margin: 0px 8px 4px 0px;"/>
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

export default {
  name: "ChatCard",

  props: {
    conversation: String
  },
  components: {
    ConversationInfo,
    SendCard,
    MessageCard
  },
  data() {
    return {
      isBottom: false,
      isLoading: false,
      infoDrawer:false
    }
  },
  computed: {
    getChat() {
      if (this.$store.getters.getChatHistory(this.conversation)) {
        console.log(this.$store.getters.getChatHistory(this.conversation))
        return this.$store.getters.getChatHistory(this.conversation);
      } else {
        return {
          conversation: "",
          messages: [],
          unreadCount: 0,
          user: {}
        };
      }
    }
  },
  methods: {
    chatDate, msgDate, subtractDates,
    loadMore() {
      const scrollTop = this.$refs.content.scrollTop
      if (scrollTop <=0 && !this.isBottom && !this.isLoading) {
        this.isLoading = true;
        let page = this.getChat.page;
        getChatHistory(this.getChat.user.id, page).then(res => {
          if (res.data.record.length <= 0) {
            this.isBottom = true;
          } else {
            this.$store.commit('addPrivateMessage', {
              payload: res.data.record,
              top: false
            });
            this.$store.commit('setConvPage', {
              conversation: this.getChat.conversation,
              page: page + 1
            });
            this.isLoading = false;
          }
        });
      }
    }
  },
  created() {
    markConversationRead([this.conversation]);
    this.$store.commit('setConversationUnread', {conversation: this.conversation, count: 0});
    this.$store.commit('setConvReadStatus', {conversation: this.conversation, status: true});
  },
  mounted() {
    if (this.getChat.messages.length>0)
    document.getElementById(this.getChat.messages[this.getChat.messages.length - 1].id).scrollIntoView({behavior: 'smooth'})
  },
  destroyed() {
    this.$store.commit('setConvReadStatus', {conversation: this.conversation, status: false})
  }

}
</script>
<style scoped>

/* 滚动条整体 */
.content::-webkit-scrollbar {
  width: 4px;
}

/* 滚动条滑块 */
.content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #909399;
}

/* 滚动条轨道 */
.content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
  margin-bottom: 10px;
}

/* 滚动条两端按钮 */
.content::-webkit-scrollbar-button {
}

.chat-date {
  font-size: 14px;
}
</style>
