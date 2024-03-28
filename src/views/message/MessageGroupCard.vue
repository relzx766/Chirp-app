<template>
  <div style="display: flex; overflow-y: auto; flex-direction: column">
    <el-card
        v-for="item in messages"
        :key="
        item.messages.length > 0
          ? item.messages[item.messages.length - 1].id
          : item.date
      "
        :class="chatStyle(item.conversation)"
        shadow="hover"
        style="border: none; border-radius: 0; cursor: pointer"
        @click.native="$router.push('/message/chat/' + item.conversation)"
    >
      <conversation-card :conversation="item"/>
    </el-card>
    <div v-if="messages.length <= 0" class="p-5">
      <div class="fw-bold fs-3 text-dark text-start">欢迎来到你的收件箱！</div>
      <div class="text-start text-secondary fs-7">
        在Chirp上和别人进行私密对话,大家互发私信,分享帖子等。
      </div>
      <div class="text-start">
        <el-button
            class="fs-6 fw-bolder mt-4"
            round
            type="primary"
            @click="newChatDialog = true"
        >写一封私信
        </el-button
        >
      </div>
      <el-dialog :show-close="false" :visible.sync="newChatDialog" width="36%">
        <new-chat-card/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import MessageCard from "@/views/message/MessageCard.vue";
import ConversationCard from "@/views/message/ConversationCard.vue";
import NewChatCard from "@/views/message/NewChatCard.vue";
import {mapState} from "vuex";

export default {
  name: "MessageGroupCard",
  components: {
    NewChatCard,
    "message-card": MessageCard,
    ConversationCard,
  },
  data() {
    return {
      messages: [],
      newChatDialog: false,
    };
  },
  computed: {
    ...mapState({
      setting: (state) => state.setting,
      chat: (state) => state.chat,
    }),
    pinned() {
      return this.setting.chat.pinned;
    },
  },
  methods: {
    init() {
    },
    doChatSort() {
      let messages = this.chat.record;
      let temp = [];
      let pinnes = this.pinned;
      let arr = [];
      Object.values(messages).forEach((msg) => {
        if (pinnes.includes(msg.conversation)) {
          temp.push(msg);
        } else {
          arr.push(msg);
        }
      });
      arr = arr.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      if (temp.length > 0) {
        temp = temp.sort((a, b) => {
          return (
              pinnes.indexOf(a.conversation) - pinnes.indexOf(b.conversation)
          );
        });
        arr.unshift(...temp);
      }
      this.$set(this, "messages", arr);
    },
    chatStyle(conversation) {
      let classes = [];
      if (conversation === this.$route.params.id) {
        classes.push("border-2", "border-end", "border-primary", "bg-focus-1");
      }
      if (this.pinned.includes(conversation)) {
        classes.push("bg-light");
      }
      return classes;
    },
  },
  watch: {
    "$store.state.chat.count": {
      handler() {
        this.doChatSort();
      },
      immediate: true,
    },
    pinned: {
      handler() {
        this.doChatSort();
      },
      immediate: true,
      deep: true,
    },
  },
  /*  watch: {
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
  },*/
  created() {
    this.init();
  },
  mounted() {
  },
};
</script>

<style scoped>
::v-deep .el-timeline-item__node--normal {
  width: 0;
}

.conversation-more-button {
}
</style>
