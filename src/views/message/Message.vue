<template>
  <el-container>
    <el-main>
      <el-row style="height: 100vh;">
        <el-col :span="9" class="overflow-y-auto border-start border-end"
                style="height: 98%;">
          <el-row class="text-start mb-3">
          <span class="fs-5" style="font-weight: bold;margin-left: 6px;">
            私信
          </span>
            <el-tooltip :visible-arrow="false"
                        content="新私信">
              <el-button circle
                         class="border-0 fs-6 text-dark p-2 float-end fw-bold"
                         @click="newChatDialog=true">
                <i class="bi bi-envelope-plus"/>
              </el-button>
            </el-tooltip>
            <el-tooltip :visible-arrow="false" content="设置">
              <el-button circle
                         class="border-0 fs-6 text-dark p-2 float-end fw-bold"
                         @click="$router.push('/message/setting')">
                <i class="bi bi-gear"/>
              </el-button>
            </el-tooltip>
            <el-dialog
                :show-close="false"
                :visible.sync="newChatDialog"
                width="36%">
              <new-chat-card/>
            </el-dialog>
          </el-row>
          <group-card/>

        </el-col>
        <el-col :span="14" class="border-end">
          <router-view :key="$route.fullPath" class="container" style="height: 96vh;"/>
          <div v-show="$route.path==='/message'" class="" style="text-align: left;padding-left: 20%;padding-top: 30%">
            <el-row class="fs-2 fw-bold" style="color: #303133">选择一条私信</el-row>
            <el-row class="fs-6" style="color: #606266">从现有的对话中选择，开始新的对话，或者只是继续浏览。</el-row>
            <el-row>
              <el-button class="fs-6 fw-bolder mt-4" round type="primary"
                         @click="newChatDialog=true">新私信
              </el-button>
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
import ChatSetting from "@/views/setting/chat/ChatSetting.vue";

export default {
  name: "Message",
  components: {
    NewChatCard,
    FollowerCard,
    MessageGroupCard,
    'group-card': MessageGroupCard, ChatCard, ChatSetting
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

.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

html, body {
  overflow-y: hidden;
}
</style>
