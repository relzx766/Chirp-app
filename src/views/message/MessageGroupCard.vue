<template>
  <div style="display:flex;overflow-y: auto;flex-direction: column;">
    <el-card

        v-for="(item) in messages" :key="item.messages.length>0?item.messages[item.messages.length-1].id:item.date"
             :style="item.conversation===$route.params.id?focusConversation:'border'" shadow="hover"
             style="border: none;border-radius: 0;cursor: pointer"
             :class="pinned===item.conversation?['bg-light']:[]"
             @click.native="$router.push('/message/chat/'+item.conversation)">
      <conversation-card :conversation="item"
                         :pinned="pinned===item.conversation"
      />
    </el-card>
  </div>
</template>

<script>
import MessageCard from "@/views/message/MessageCard.vue";
import ConversationCard from "@/views/message/ConversationCard.vue";

export default {
  name: "MessageGroupCard",
  components: {
    'message-card': MessageCard,
    ConversationCard
  },
  data() {
    return {
      messages: {},
      pinnedConv:{},
      focusConversation: {
        borderRight: '2px #409EFF solid',
        backgroundColor: '#ecf4f4'
      }
    }
  },
  computed:{
    pinned(){
      return this.$store.getters.getSetting.chat.pinned;
    }
  },
  methods: {
    init() {
    },
    doChatSort(){
      let messages = this.$store.getters.getChat.record;
      let temp=messages[this.pinned];
      let arr = Object.values(messages)
          .filter(msg=>msg.conversation!==this.pinned)
          .sort((a, b) => {
            return new Date(b.date) - new Date(a.date)
          });
      if (temp) {
        arr.unshift(temp);
      }
      this.$set(this, 'messages', arr);
    }
  },
  watch: {
    '$store.state.chat.count': {
      handler() {
        this.doChatSort();
      },
      immediate: true
    },
    '$store.state.setting.chat':{
      handler(){
        this.doChatSort();
      },
      immediate:true,
      deep:true
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
.conversation-more-button{

}
</style>
