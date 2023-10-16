<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="15" style="border-left:2px solid #EBEEF5;min-height: 100vh;border-right:2px solid #EBEEF5;">
          <el-container>
            <el-main>
              <el-row style="text-align: left;margin-bottom: 16px">
             <span style="font-weight: bold;font-size: 20px">
            通知
          </span>
              </el-row>
              <el-row>
                <notice-card/>
              </el-row>
            </el-main>
          </el-container>

        </el-col>
        <el-col :span="9">
          <el-container>
            <el-main>
              <input-card/>
              <trend-card style="margin-top: 8%;background-color:#EBEEF5;border-radius: 10px"/>
            </el-main>
          </el-container>
        </el-col>
      </el-row>
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

</style>
