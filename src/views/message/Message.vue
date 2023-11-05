<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="9" style="border-left:2px solid #EBEEF5;min-height: 100vh;border-right:2px solid #EBEEF5;">
          <el-row style="text-align: left;margin-bottom: 14px;">
          <span style="font-weight: bold;margin-left: 6px;font-size: 20px">
            私信
          </span>
            <el-tooltip content="新私信">
              <el-button circle
                         icon="el-icon-chat-dot-square" style="float:right;border: none;font-size: 20px;padding: 4px"
                         @click="newChatDialog=true"></el-button>
            </el-tooltip>
            <el-dialog
                :show-close="false"
                :visible.sync="newChatDialog"
                width="36%">
              <new-chat-card style="margin-top: -40px"/>
            </el-dialog>
          </el-row>
          <group-card/>
        </el-col>
        <el-col :span="14" style="min-height: 100vh;border-right:2px solid #EBEEF5;">
          <chat-card v-if="$route.query.conversation" :key="$route.query.conversation"
                     :conversation="$route.query.conversation"
                     style="margin-left: 2px"/>
          <div v-else style="text-align: left;padding-left: 20%;padding-top: 30%" class="">
            <el-row class="fs-2 fw-bold" style="color: #303133">选择一条私信</el-row>
            <el-row class="fs-6" style="color: #606266">从现有的对话中选择，开始新的对话，或者只是继续浏览。</el-row>
            <el-row>
              <el-button round type="primary" @click="newChatDialog=!newChatDialog"
              class="fs-6 fw-bolder mt-4">新私信</el-button>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import MessageGroupCard from "@/views/message/MessageGroupCard.vue";
import ChatCard from "@/views/message/ChatCard.vue";
import FollowerCard from "@/views/profile/FollowerCard.vue";
import NewChatCard from "@/views/message/NewChatCard.vue";

export default {
  name: "Message",
  components: {
    NewChatCard,
    FollowerCard,
    MessageGroupCard,
    'group-card': MessageGroupCard, ChatCard
  },
  data() {
    return {
      newChatDialog: false
    }
  }
}
</script>

<style scoped>

::v-deep .el-dialog__body {
  padding: 0;
}
</style>
