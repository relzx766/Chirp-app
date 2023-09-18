<template>
  <div>
    <el-row v-for="item in notifications" style="border-bottom:1px solid #F2F6FC;margin-top: 12px;">
      <notice-detail :chirper="item[0].entity"
                     :date="item[0].createTime"
                     :name="item[0].senderName"
                     :type="item[0].event"
                     :urls="[item.map((i) => i.senderAvatar)][0]"/>
    </el-row>
    <el-row v-if="notifications.length<=0" style="margin-left: 16%;">
      <el-row style="font-size: 28px;font-weight: bold;text-align: left;color: black;">这里暂时没有内容</el-row>
      <el-row style="text-align: left;color: #909399;">从点赞到转贴等等，所有的互动都在这里进行</el-row>
    </el-row>
  </div>
</template>

<script>
import {bigNumberToString, getMessageDate, getNewMsgCount} from "../../util/tools";
import ChirperCard from "../chirper/ChirperCard.vue";
import NoticeDetail from "./NoticeDetail.vue";

export default {
  name: "NoticeCard",
  components: {
    'chirper-card': ChirperCard,
    'notice-detail': NoticeDetail
  },
  data() {
    return {
      notifications: []
    }
  },
  methods: {
    getNewMsgCount, getMessageDate
  },
  watch: {
    '$store.state.msgCount': {
      handler() {
        let messages = this.$store.getters.getMessage;
        if (messages && messages.length > 0) {


          //根据推文或接收者id分类
          let classifyById = messages.reduce((arr, item) => {
            let id;
            id = item.entityType === 'CHIRPER' ? id = item.entity.id : id = item.receiverId;
            id = bigNumberToString(id);
            if (arr[id]) {
              arr[id].push(item);
            } else {
              arr[id] = [item];
            }
            return arr;
          }, {});
          let classifyByEvent = {};
          Object.keys(classifyById).forEach(key => {
            let eventMap = classifyById[key].reduce((arr, item) => {
              let event = item.event;
              if (arr[event]) {
                arr[event].push(item);
              } else {
                arr[event] = [item];
              }
              return arr;
            }, []);
            classifyByEvent[key] = eventMap;
          });
          Object.values(classifyByEvent).forEach(classify => {
            Object.values(classify).forEach(messageArr => {
              this.notifications.push(messageArr);
            })
          });
          this.notifications.sort((last, next) => {
            let message1 = last[last.length - 1];
            let message2 = next[next.length - 1];
            return Date.parse(message2.createTime) - Date.parse(message1.createTime);
          })
        }
      },
      immediate: true
    }
  },
}
</script>

<style scoped>

</style>