<template>
  <div>
    <div
        class=" d-flex flex-nowrap align-self-center justify-content-around option-item fw-bold text-dark border-bottom">
      <div v-for="item in switchOptions"
           class="flex-grow-1 pt-3 pb-3 fs-7 text-center position-relative user-select-none finger"
           @click="switchTo(item)">
        <div>{{ item }}</div>
        <div v-if="switchType===item"
             class="w-20 position-absolute bottom-0 start-50 translate-middle-x switch-btn-bottom bg-primary rounded-pill">
        </div>
      </div>
    </div>
    <div>
      <div v-if="switchType===switchOptions.All">
        <el-row v-for="item in notifications" :key="item[0].id" class="border-bottom mt-2">
          <notice-detail v-if="item[0].entity===null||item[0].entity==='null'"
                         :date="item[0].createTime"
                         :name="item[0].senderName"
                         :sonEntity="item[0].sonEntity"
                         :type="item[0].event"
                         :urls="[item.map((i) => i.senderAvatar)][0]"/>
          <notice-detail
              v-for="i in item"
              v-else-if="item[0].entity!==null||item[0].entity!=='null'"
              :key="i.id"
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
      </div>
      <div v-else-if="switchType===switchOptions.Mentioned">
        <el-row v-for="item in notifications" v-if="item[0].event===noticeEventEnums.MENTIONED" :key="item[0].id"
                ref="mentionView"
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
      </div>
    </div>
<!--    <el-tabs :stretch="true" value="all">
      <el-tab-pane name="all">
        <span slot="label" style="font-size: 16px;font-weight: bold">全部</span>
        <el-row v-for="item in notifications" :key="item[0].id" class="border-bottom mt-2">
          <notice-detail v-if="item[0].entity===null||item[0].entity==='null'"
                         :date="item[0].createTime"
                         :name="item[0].senderName"
                         :sonEntity="item[0].sonEntity"
                         :type="item[0].event"
                         :urls="[item.map((i) => i.senderAvatar)][0]"/>
          <notice-detail
              v-for="i in item"
              v-else-if="item[0].entity!==null||item[0].entity!=='null'"
              :key="i.id"
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
        <el-row v-for="item in notifications" v-if="item[0].event===noticeEventEnums.MENTIONED" :key="item[0].id"
                ref="mentionView"
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
    </el-tabs>-->

  </div>
</template>

<script>
import {getMessageDate, getNewMsgCount} from "../../util/tools";
import ChirperCard from "../chirper/ChirperCard.vue";
import NoticeDetail from "./NoticeDetail.vue";
import {getUnreadCount} from "@/api/advice";
import {noticeEventEnums} from "@/enums/enums";
import {mapState} from "vuex";
import {noticeActions} from "@/config/vuex/action-types";
import {log} from "video.js";

export default {
  name: "NoticeCard",
  computed: {
    ...mapState({
      notice: state => state.notice
    }),
    /*    notifications() {
          return Object.values(this.notice.persist.record);
        },*/
    noticeEventEnums() {
      return noticeEventEnums
    },
    mentionEmpty() {
      return !this.notifications.map(item => item[0]).some(item => item.event === noticeEventEnums.MENTIONED);
    },
    switchType(){
      return this.$route.query.type?
        this.$route.query.type:this.switchOptions.All
    }
  },
  components: {
    'chirper-card': ChirperCard,
    'notice-detail': NoticeDetail
  },
  data() {
    return {
      isLoading: false,
      notifications: [],
      switchOptions:{
        All:'All',
        Mentioned:'Mentioned',
      }
    }
  },
  methods: {
    getNewMsgCount, getMessageDate, getUnreadCount,
    scrollPage() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      let bottom = this.notice.persist.bottom;
      if (scrollTop + clientHeight + 10 >= scrollHeight && !bottom && !this.isLoading) {
        this.isLoading = true;
        this.$store.dispatch(`notice/${noticeActions.LOAD_NOTICE_PAGE}`).then(() => {
          this.isLoading = false;
        })
      }
    },
    switchTo(type){
      this.$router.push(`/notice?type=${type}`)
    }
  },
  watch: {
    '$store.state.notice.persist.count': {
      handler() {
        this.notifications.splice(0, this.notifications.length, ...Object.values(this.notice.persist.record));
      },
      immediate: true
    }
  },
  created() {
    window.addEventListener("scroll", this.scrollPage, true);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollPage);
  }
}
</script>

<style scoped>
::v-deep .el-tabs__active-bar {
  background-color: transparent !important;
  background-image: linear-gradient(
      90deg, transparent 0, transparent 40%,
      #409EFF 0, #409EFF 60%,
      transparent 0, transparent
  );
}

.overflow-y-auto ::-webkit-scrollbar {
  display: none;
}
</style>
<style>

</style>
