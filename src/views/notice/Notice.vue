<template>
  <el-container>
    <el-main>
      <div class="row">
        <div class="col border-start border-end">
          <el-container>
            <el-main style="padding: 0">
              <el-row style="text-align: left;margin-bottom: 16px">
             <span style="font-weight: bold;font-size: 20px">
            通知
          </span>
              </el-row>
              <el-row class="overflow-y-auto">
                <notice-card class="overflow-y-auto" style="height: 90vh;margin-bottom: 40px"/>
              </el-row>
            </el-main>
          </el-container>
        </div>
        <div class="col">

          <div v-if="getToken()!=null&&getToken().length>0">
            <input-card class="mt-2"/>
            <trend-list class="bg-light rounded-4 bg-info-2 mt-4"/>
          </div>
          <div v-if="getToken()==null||!getToken().length>0"
               class=" d-flex justify-content-center h-100 w-100">
            <div class="align-self-center  w-75">
              <login-card/>
            </div>
          </div>
        </div>
      </div>

    </el-main>
  </el-container>
</template>

<script>
import NoticeCard from "@/views/notice/NoticeCard.vue";
import TrendListCard from "@/views/explore/TrendListCard.vue";
import TrendList from "@/views/explore/TrendListCard.vue";
import InputCard from "@/views/search/InputCard.vue";
import LoginCard from "@/views/sign/LoginCard.vue";
import {getToken} from "@/util/auth";


export default {
  name: "Notice",
  methods: {getToken},
  components: {
    TrendList, LoginCard,
    'notice-card': NoticeCard,
    'trend-card': TrendListCard,
    'input-card': InputCard
  },
  created() {
  },
  mounted() {
    /* this.$store.commit('readAllNotice');*/

  }
}
</script>

<style scoped>
.overflow-y-auto ::-webkit-scrollbar {
  display: none;
}
</style>
