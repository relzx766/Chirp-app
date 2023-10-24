<template>
  <div>
    <el-card v-for="(item, index) in messages" :key="item.messages[0].id"
             :style="item.conversation===$route.query.conversation?focusConversation:''" shadow="hover" style="border: none;border-radius: 0;cursor: pointer"
             @click.native="$router.push('/message?conversation='+item.conversation)">
      <el-row style="text-align: left">
        <el-col :span="3">
          <el-avatar :src="item.user.smallAvatarUrl"/>
        </el-col>
        <el-col :span="18">
          <el-row style="font-size: 16px;color: #303133;font-weight: 560">{{ item.user.nickname }}</el-row>
          <el-row class="text-truncate" style="font-size: 14px;color:#909399;max-width: 90%; display: inline-block">
            {{ item.messages[0].content }}
          </el-row>
        </el-col>
        <el-col :span="3" style="text-align: right;font-size: 12px">
          <el-row style="color:#909399;margin-bottom: 2px">{{ msgDate(item.messages[0].createTime) }}</el-row>
          <el-row v-if="item.unreadCount>0">
            <el-badge :value="item.unreadCount<=99?item.unreadCount:99" class="item"/>
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
import {getChatIndexPage} from "@/api/advice";

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
      getChatIndexPage(1).then(res => {

        this.$store.commit('initChatIndex', res.data.record);
        console.log(res.data.record)
      })
    }
  },
  watch: {
    '$store.state.message.count': {
      handler() {
        let messages = this.$store.getters.getPrivateMessage.record;
        let arr = Object.values(messages).sort((a, b) => {
          return new Date(b.messages[b.messages.length - 1].createTime) - new Date(a.messages[a.messages.length - 1].createTime)
        })
        this.$set(this, 'messages', arr);
      },
      immediate: true
    }
  },
  created() {
    if (Object.keys(this.$store.getters.getPrivateMessage.record).length === 0) {
      this.init();
    }
  }
}
</script>

<style scoped>
::v-deep .el-timeline-item__node--normal {
  width: 0;
}
</style>
