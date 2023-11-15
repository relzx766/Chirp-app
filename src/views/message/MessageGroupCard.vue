<template>
  <div style="display:flex;overflow-y: auto;flex-direction: column;">
    <el-card v-for="(item, index) in messages" :key="item.messages.length>0?item.messages[item.messages.length-1].id:item.date"
             :style="item.conversation===$route.params.id?focusConversation:'border'" shadow="hover"
             style="border: none;border-radius: 0;cursor: pointer"
             @click.native="$router.push('/message/chat/'+item.conversation)">
      <el-row style="text-align: left">
        <el-col :span="3">
          <el-avatar :src="item.user.smallAvatarUrl"/>
        </el-col>
        <el-col :span="17">
          <el-row style="font-size: 16px;color: #303133;font-weight: 560">{{ item.user.nickname }}</el-row>
          <el-row v-if="item.messages.length>0">
            <span class="text-truncate" style="font-size: 14px;color:#909399;max-width: 90%; display: inline-block">
                  {{ getPlaceholder(item.messages[item.messages.length - 1]) }}
            </span>
          </el-row>
        </el-col>
        <el-col :span="4" style="text-align: right;font-size: 12px">
          <el-row style="color:#909399;margin-bottom: 2px">
            {{ msgDate(item.messages.length>0?item.messages[item.messages.length-1].createTime:item.date) }}
          </el-row>
          <el-row v-if="item.unreadCount>0">
            <el-badge :value="item.unreadCount" :max="99" class="item"/>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import MessageCard from "@/views/message/MessageCard.vue";
import {getDate} from "../../util/tools";
import {msgDate} from "../../util/formatter";
import {getChatIndexPage, getChatUnread} from "@/api/advice";

export default {
  name: "MessageGroupCard",
  components: {
    'message-card': MessageCard
  },
  data() {
    return {
      messages: {},
      focusConversation: {
        borderRight: '2px #409EFF solid',
        backgroundColor: '#ecf4f4'
      }
    }
  },
  methods: {
    msgDate, getDate,
    init() {
    },
    getPlaceholder(message) {
      let placeholder = "";
      switch (message.type) {
        case "IMAGE":
          placeholder = "[图片]";
          break;
        case "VIDEO":
          placeholder = "[视频]";
          break;
        default:
          placeholder = message.content;
      }
      return placeholder;
    }
  },
  watch: {
    '$store.state.chat.count': {
      handler() {
        let messages = this.$store.getters.getChat.record;
        let arr = Object.values(messages).sort((a, b) => {
          return new Date(b.date) - new Date(a.date)
        });
        this.$set(this, 'messages', arr);
      },
      immediate: true
    }
  },
  created() {
      this.init();
  }
}
</script>

<style scoped>
::v-deep .el-timeline-item__node--normal {
  width: 0;
}
</style>
