<template>
  <div>
    <el-row v-for="item in messages">
      <message-card style="cursor: pointer;margin-top: 4px" :message="item" :num="1"></message-card>
    </el-row>
  </div>
</template>

<script>
import MessageCard from "@/views/message/MessageCard.vue";

export default {
  name: "MessageGroupCard",
  components: {
    'message-card': MessageCard
  },
  data() {
    return {
      messages: [{
        "id": 1693668101475852289,
        "senderId": 2,
        "senderAvatar": "https://dogefs.s3.ladydaily.com/~/source/wallhaven/small/rr/rr793m.jpg?w=400&h=200&fmt=webp",
        "senderName": "大大大",
        "targetId": 1690692477446590465,
        "receiverId": 1,
        "text": 'hello',
        "createTime": "2023-08-21T16:55:17.000+00:00",
        "type": "LIKE"
      }, {
        "id": 1693669990120562690,
        "senderId": 1,
        "senderAvatar": "https://dogefs.s3.ladydaily.com/~/source/wallhaven/small/rr/rr793m.jpg?w=400&h=200&fmt=webp",
        "senderName": "blush",
        "targetId": 1690692477446590465,
        "receiverId": 1,
        "text": 'world',
        "createTime": "2023-08-21T17:02:47.000+00:00",
        "type": "LIKE"
      }]
    }
  }
}
</script>

<style scoped>

</style>