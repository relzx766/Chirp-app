<template>
  <div>
    <el-tabs :stretch="true" value="all">
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
              v-else-if="item[0].entity!==null||item[0].entity!=='null'"
              v-for="i in item"
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
        <el-row v-for="item in notifications" v-if="item[0].event===noticeEventEnums.MENTIONED"
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
import {noticeEventEnums} from "@/enums/enums";
import {mapState} from "vuex";
import {noticeActions} from "@/config/vuex/action-types";

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
    mentionEmpty(){
      const regex = /MENTIONED/;
      return !Object.keys(this.notifications).some(key => regex.test(key));
    }
  },
  components: {
    'chirper-card': ChirperCard,
    'notice-detail': NoticeDetail
  },
  data() {
    return {
      isLoading: false,
      notifications:[]
    }
  },
  methods: {
    getNewMsgCount, getMessageDate, getUnreadCount,
        scrollPage() {
          const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          const clientHeight = document.documentElement.clientHeight
          const scrollHeight = document.documentElement.scrollHeight
          let bottom=this.notice.persist.bottom;
          if (scrollTop + clientHeight + 10 >= scrollHeight && !bottom && !this.isLoading) {
            this.isLoading=true;
            this.$store.dispatch(`notice/${noticeActions.LOAD_NOTICE_PAGE}`).then(()=>{
              this.isLoading=false;
            })
          }
        }
  },
  watch:{
    '$store.state.notice.persist.count':{
      handler(){
        this.notifications.splice(0,this.notifications.length,...Object.values(this.notice.persist.record));
      },
      immediate:true
    }
  },
    created() {
      this.$store.dispatch(`notice/${noticeActions.MARK_READ_ALL_NOTICE}`);
      window.addEventListener("scroll", this.scrollPage, true);
    },
    destroyed() {
      window.removeEventListener("scroll", this.scrollPage);
      this.$store.dispatch(`notice/${noticeActions.MARK_READ_ALL_NOTICE}`);
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
