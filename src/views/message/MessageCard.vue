<template>
  <div>
    <div style="text-align: left;padding: 6px">
      <el-row>
        <el-col :span="4">
          <el-avatar :src="message.senderAvatar" fit="cover"/>
        </el-col>
        <el-col :span="20">
          <el-row>
            <span style="font-size: 14px">{{message.senderName}}</span>
            <span style="font-size: 10px;float: right">{{getMessageDate(message.createTime)}}</span>
          </el-row>
          <el-row>
            <span style="font-size: 14px">{{message.text}}</span>
            <span v-if="num>0" class="red-point">{{getNewMsgCount(num)}}</span>
          </el-row>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import {getDate, getMessageDate, getNewMsgCount} from "../../util/tools";

export default {
  name: "MessageCard",
  methods: {getNewMsgCount, getMessageDate, getDate},
  props: {
    message: {},
    num: 0
  }
}
</script>

<style scoped>
.red-point {
  width: 12px;
  font-size: 8px;
  float: right;
  background-color: #ff4d4f;
  border-radius: 100%;
  padding: 2px;
  text-align: center;
  color: #FFFFFF;
}
</style>