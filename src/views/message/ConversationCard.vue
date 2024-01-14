<template>
  <el-row style="text-align: left">
    <el-col :span="3">
      <el-avatar :src="conversation.user.smallAvatarUrl"/>
    </el-col>
    <el-col :span="17">
      <el-row style="font-size:14px;color: #303133;font-weight: 560">
        <el-breadcrumb separator="·">
          <el-breadcrumb-item>{{ conversation.user.nickname }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ msgDate(conversation.messages.length>0?conversation.messages[conversation.messages.length-1].createTime:conversation.date) }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="conversation.unreadCount>0"> <span class="badge bg-danger  rounded-pill">{{conversation.unreadCount<99?conversation.unreadCount:99}}</span></el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
      <el-row v-if="conversation.messages.length>0">
            <span class="text-truncate" style="font-size: 14px;color:#909399;max-width: 90%; display: inline-block">
                  {{ getPlaceholder(conversation.messages[conversation.messages.length - 1]) }}
            </span>
      </el-row>
    </el-col>
    <el-col :span="4" style="text-align: right;font-size: 12px;">
      <el-popover
          placement="right"
          width="auto"
          :visible-arrow="false"
          trigger="click"
      >
        <div>
          <el-row>
            <el-button style="width: 100%" icon="el-icon-collection-tag"
                       class="border-0 border-bottom fw-bold text-black"
                       @click="setPinned">置顶对话</el-button>
          </el-row>
          <el-row>
            <el-button
                style="width: 100%"
                icon="el-icon-delete"
                class="border-0 fw-bold text-black "
                @click="doDelete"
               >删除会话</el-button>
          </el-row>

        </div>
        <el-button slot="reference"
                   icon="el-icon-more" circle class="border-0"
                   :class="pinned?['bg-light']:[]"
                   @click.stop
                   :style="conversation.conversation===$route.params.id&&!pinned?{backgroundColor:'#ecf4f4'}:{}"></el-button>
      </el-popover>
    </el-col>
  </el-row>
</template>
<script>
import {msgDate} from "@/util/formatter";
import {getDate} from "@/util/tools";
import {leaveConv, updatePinned} from "@/api/advice";

export default {
  name: "ConversationCard",
  props:{
    conversation:Object,
    pinned:Boolean
  },
  data() {
    return {
      focusConversation: {
        borderRight: '2px #409EFF solid',
        backgroundColor: '#ecf4f4'
      }
    }
  },
  methods:{   msgDate, getDate,
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
    },
    setPinned(){
    this.$store.commit('setChatSetting',{
      pinned:this.conversation.conversation
    });
    updatePinned(this.conversation.conversation);
    },
    doDelete() {
      this.$store.commit('leaveConv',this.conversation.conversation);
      leaveConv(this.conversation.conversation);
      this.$router.push('/message')
    }
  }
}
</script>
<style scoped>

</style>