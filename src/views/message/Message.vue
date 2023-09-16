<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="8" style="border-left:2px solid #EBEEF5;min-height: 100vh;border-right:2px solid #EBEEF5;">
          <el-row style="text-align: left;margin-bottom: 14px;">
          <span style="font-weight: bold;margin-left: 6px;font-size: 20px">
            私信
          </span>
            <el-tooltip content="新私信">
              <el-button circle
                         icon="el-icon-chat-dot-square" style="float:right;border: none;font-size: 20px;padding: 4px"></el-button>
            </el-tooltip>
          </el-row>
          <group-card/>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import MessageGroupCard from "@/views/message/MessageGroupCard.vue";

export default {
  name: "Message",
  components: {
    MessageGroupCard,
    'group-card': MessageGroupCard
  }
}
</script>

<style scoped>

</style>