<template>
  <el-container>
    <el-main>
      <div class="row">
        <div class="col-7"
             style="border-left:2px solid #EBEEF5;border-right:2px solid #EBEEF5;">
          <el-container>
            <el-main style="padding: 0">
              <el-row style="text-align: left;margin-bottom: 16px">
             <span style="font-weight: bold;font-size: 20px">
            通知
          </span>
              </el-row>
              <el-row class="overflow-y-auto">
                <notice-card class="overflow-y-auto" style="max-height: 90vh;margin-bottom: 40px"/>
              </el-row>
            </el-main>
          </el-container>
        </div>
        <div class="col-5">
          <el-container>
            <el-main>
              <el-row>
                <el-col :span="20">
                  <input-card/>
                  <trend-card style="margin-top: 8%;background-color:#EBEEF5;border-radius: 10px"/>
                </el-col>
              </el-row>
              </el-main>
          </el-container>
        </div>
      </div>

    </el-main>
  </el-container>
</template>

<script>
import NoticeCard from "@/views/notice/NoticeCard.vue";
import TrendListCard from "@/views/explore/TrendListCard.vue";
import InputCard from "@/views/search/InputCard.vue";


export default {
  name: "Notice",
  components: {
    'notice-card': NoticeCard,
    'trend-card': TrendListCard,
    'input-card': InputCard
  },
  created() {
  },
  mounted() {
    this.$store.commit('readAllNotice');

  }
}
</script>

<style scoped>
.overflow-y-auto ::-webkit-scrollbar{
  display: none;
}
</style>
