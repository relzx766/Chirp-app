<template>
  <div>
    <div v-if="!reverse" style="text-align: left;padding: 6px">
      <div class="container text-center">
        <div class="row">
          <div class="col-1" style="text-align: left">
            <el-avatar :src="user.smallAvatarUrl" fit="cover" style="cursor: pointer"
                       @click.native="$router.push('/profile?id='+user.id)"/>
          </div>
          <div class="col-10" style="text-align: left">
            <el-row v-if="message.type==='TEXT'">
              <span class="text_chat_msg shadow p-3 mb-5  rounded-end rounded-bottom"
                    v-html="formatText( message.content)"></span>
            </el-row>
            <el-row v-else>
              <span class="text_chat_msg shadow p-3 mb-5  rounded-end rounded-bottom">&nbsp;</span>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div v-if="reverse" style="padding: 6px;text-align: right">
      <div class="container text-center">
        <div class="row">
          <div class="col-1"></div>
          <div class="col-10" style="text-align: left">
            <el-row v-if="message.type==='TEXT'" style="text-align: right">
              <div v-if="message.isSending" class="loading" style="margin-right: 2px"/>
              <span class="text_chat_msg shadow p-3 mb-5 bs-primary
              rounded-start rounded-bottom " style="background-color:#409EFF;color: white;text-align: left"
                    v-html="formatText( message.content)"></span>
            </el-row>
          </div>
          <div class="col-1" style="text-align: right">
            <el-avatar :src="user.smallAvatarUrl" fit="cover" style="cursor: pointer"
                       @click.native="$router.push('/profile?id='+user.id)"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatText, getDate, getMessageDate, getNewMsgCount} from "../../util/tools";
import {msgDate} from "../../util/formatter";

export default {
  name: "MessageCard",
  methods: {formatText, msgDate, getNewMsgCount, getMessageDate, getDate},
  props: {
    message: {},
    user: {},
    reverse: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style scoped>
.text_chat_msg {
  display: inline-grid;
}

.loading {
  display: inline-flex;
  width: 16px;
  height: 16px;
  border: 2px solid #409EFF;
  border-top-color: transparent;
  border-radius: 100%;
  margin-top: 6px;
  animation: circle infinite 0.75s linear;
}

.loading-box {
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background-color: #FFFFFF;
}

@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
