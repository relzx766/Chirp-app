<template>

  <div>
    <div v-if="getChat.messages.length>0" style="height: 100vh">
      <div style="display: flex;align-items: center;border-bottom: 1px solid #DCDFE6;padding: 12px">
        <el-avatar :size="36" :src="getChat.user.smallAvatarUrl"/>
        <span style="font-weight: bold;font-size: 16px;margin-left: 12px">
            {{ getChat.user.nickname }}
          </span>
      </div>
      <div class="overflow-y-auto content"
           style="margin-bottom: 180px;height: 70vh;  display: flex;flex-direction: column-reverse;">
        <el-row v-for="(item,index) in getChat.messages" :key="item.id">
          <!--          如果消息间隔相差2分组同时不是第一条（在此为最后一条）-->
          <el-row v-if="index<getChat.messages.length-1&&subtractDates(getChat.messages[index].createTime,getChat.messages[index+1].createTime)>2*60*1000"
                  class=" text-body-tertiary chat-date">
            {{ chatDate(item.createTime) }}
          </el-row>
          <el-row v-if="index===getChat.messages.length-1" class="text-body-tertiary chat-date">
            {{ chatDate(item.createTime) }}
          </el-row>
          <message-card :message="item"
                        :reverse="item.senderId===$store.getters.getUser.id"
                        :user="item.senderId===$store.getters.getUser.id?$store.getters.getUser:getChat.user"/>

        </el-row>

      </div>
    </div>
    <div class="position-fixed bottom-0 end-1"
         style="width: 44%;min-height: 50px;
         background-color: white;
         border-top: 1px solid #DCDFE6;
">
      <send-card :receiver="[getChat.user]" style="border-radius: 12px;margin: 4px 8px 4px 8px;"/>
    </div>
  </div>
</template>
<script>
import MessageCard from "@/views/message/MessageCard.vue";
import SendCard from "@/views/message/SendCard.vue";
import {markConversationRead} from "@/api/advice";
import {subtractDates} from "@/util/tools";
import {chatDate, msgDate} from "../../util/formatter";

export default {
  name: "ChatCard",
  methods: {chatDate, msgDate, subtractDates},
  props: {
    conversation: String
  },
  components: {
    SendCard,
    MessageCard
  },
  computed: {
    getChat() {
      if (this.$store.getters.getChatHistory(this.conversation)) {
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
  created() {
    markConversationRead([this.conversation]);
    this.$store.commit('setConversationUnread', {conversation: this.conversation, count: 0});
    this.$store.commit('setConvReadStatus', {conversation: this.conversation, status: true});
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
  margin-top: -30px;
}

/* 滚动条两端按钮 */
.content::-webkit-scrollbar-button {
}

.chat-date {
  font-size: 14px;
}
</style>
