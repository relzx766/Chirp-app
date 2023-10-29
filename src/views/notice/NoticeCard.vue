<template>
  <div>
    <el-tabs :stretch="true" value="all">
      <el-tab-pane name="all">
        <span slot="label" style="font-size: 16px;font-weight: bold">全部</span>
        <el-row v-for="item in notifications" :key="item[0].id"
                style="border-bottom:1px solid #F2F6FC;margin-top: 12px;">

          <notice-detail v-if="item[0].entity===null||item[0].entity==='null'" :date="item[0].createTime"
                         :name="item[0].senderName"
                         :sonEntity="item[0].sonEntity"
                         :type="item[0].event"
                         :urls="[item.map((i) => i.senderAvatar)][0]"/>
          <notice-detail v-for="i in item" v-else-if="item[0].entity!==null||item[0].entity!=='null'"
                         :date="i.createTime"
                         :entity="i.entity"
                         :name="i.senderName"
                         :sonEntity="i.sonEntity"
                         :type="i.event"
                         :urls="[i.senderAvatar]"
                         style="border-bottom:1px solid #F2F6FC;margin-top: 12px;"/>
        </el-row>
        <el-row v-if="notifications.length<=0" style="margin-left: 16%;">
          <el-row style="font-size: 28px;font-weight: bold;text-align: left;color: black;">这里暂时没有内容</el-row>
          <el-row style="text-align: left;color: #6c7c84;">从点赞到转贴等等，所有的互动都在这里进行。</el-row>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="mentions">
        <span slot="label" style="font-size: 16px;font-weight: bold">提及</span>
        <el-row v-for="item in notifications" v-if="item[0].event==='MENTIONED'"
                style="border-bottom:1px solid #F2F6FC;margin-top: 12px;">
          <notice-detail v-if="item[0].entity==='null'" :date="item[0].createTime"
                         :name="item[0].senderName"
                         :sonEntity="item[0].sonEntity"
                         :type="item[0].event"
                         :urls="[item[0].senderAvatar]"/>
        </el-row>
        <el-row v-if="mentionEmpty" style="margin-left: 16%;">
          <el-row style="font-size: 28px;font-weight: bold;text-align: left;color: black;">这里暂时没有内容</el-row>
          <el-row style="text-align: left;color: #6c7c84;">当有人提及你时，你会在这里找到它。</el-row>
        </el-row>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import {getMessageDate, getNewMsgCount} from "../../util/tools";
import ChirperCard from "../chirper/ChirperCard.vue";
import NoticeDetail from "./NoticeDetail.vue";
import {getPage, getUnreadCount, markAsRead} from "@/api/advice";

export default {
  name: "NoticeCard",
  components: {
    'chirper-card': ChirperCard,
    'notice-detail': NoticeDetail
  },
  data() {
    return {
      notifications: [],
      mentionEmpty: true,
      isLoading: false,
      isBottom: false,
      loading: null
    }
  },
  methods: {
    getNewMsgCount, getMessageDate, getUnreadCount,
    loadMore(page) {
      this.isLoading = true;
      getPage(page).then(res => {
        this.$store.commit('incrementNoticePage')
        this.isBottom = res.data.record.length <= 0;
        this.$store.commit('addNotice', {
          payload: res.data.record,
          top: false
        });
        this.isLoading = false;
        if (this.loading !== null) {
          this.loading.close()
        }
      })
    },
    scrollPage() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight + 10 >= scrollHeight && !this.isBottom && !this.isLoading) {
        this.loadMore(this.$store.getters.getNoticePage);
      }
    }
  },
  watch: {
    '$store.state.notice.count': {
      handler() {
        let messages = structuredClone(this.$store.getters.getNotice);
        if (messages && Object.entries(messages).length > 0) {
          this.notifications = [];
          Object.values(messages).forEach(classify => {
            this.mentionEmpty = !this.mentionEmpty ? false : classify[0].event !== 'MENTIONED';
            this.notifications.push(classify);
          });
        }
      },
      immediate: true
    }
  },
  created() {
    this.loadMore(this.$store.getters.getNoticePage)
    this.getUnreadCount().then(res => {
      this.$store.commit('setNoticeUnread', res.data.record.count);
    })
    window.addEventListener("scroll", this.scrollPage, true);
  },
  destroyed() {
    this.$store.commit('setNoticeUnread', 0);
    let unread = this.$store.getters.getUnreadNoticeRecord;
    if (unread.length > 0) {
      markAsRead().then(() => {
        this.$store.commit('clearUnreadNotice');
      }).catch(e => {
        console.log(e);
        this.$store.commit('clearUnreadNotice');
      })
    }
    window.removeEventListener("scroll", this.scrollPage);
  }
}
</script>

<style scoped>
::v-deep .el-tabs__active-bar {
  background-color: transparent !important;
  background-image: linear-gradient(
      90deg, transparent 0, transparent 40%,
      #4d72f6 0, #4d72f6 60%,
      transparent 0, transparent
  );
}
</style>
<style>

</style>
