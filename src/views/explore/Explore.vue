<template>
  <el-container>
    <el-main>
      <div class="row">
        <div class="col-7 border-start border-end p-2"
             style="height: 100vh;">
          <el-container>
            <el-main class="p-0">
              <input-card/>
              <div
                  class=" d-flex flex-nowrap align-self-center justify-content-around option-item fw-bold text-dark border-bottom">
                <div v-for="item in switchOptions"
                     class="flex-grow-1 pt-3 pb-3 fs-7 text-center position-relative user-select-none finger"
                     @click="switchTo(item)">
                  <div>{{ item }}</div>
                  <div v-if="switchType===item"
                       class="w-25 position-absolute bottom-0 start-50 translate-middle-x switch-btn-bottom bg-primary rounded-pill">
                  </div>
                </div>
              </div>
              <div>
                <el-empty v-if="Object.keys(trends[switchType]).length===0"/>
                <div v-for="(item,index) in Object.keys(trends[switchType])" class="text-start">

                  <el-card shadow="hover" style="background:none;border: none"
                           @click.native="$router.push('/search?keyword='+encodeURIComponent(item))">
                    <el-row style="color: #909399;font-size: 14px;margin-bottom: 4px">
                      {{ index + 1 }}·{{ getCount(trends[switchType][item].score) }} hot
                    </el-row>
                    <el-row style="font-size: 16px;font-weight: bold;cursor: pointer">{{ item }}
                    </el-row>
                    <el-row style="color: #909399;font-size: 12px;margin-top: 4px">
                      {{ getCount(trends[switchType][item].post) }}&nbsp;posts
                    </el-row>
                  </el-card>
                </div>
              </div>
            </el-main>
          </el-container>
        </div>
        <div class="col-5">
          <el-row class="h-100 w-100">
            <el-col v-if="getToken()!=null&&getToken().length>0" :span="20">
              <div style="text-align: left;background-color:#EBEEF5;border-radius: 10px">
<!--                <el-row style="font-weight: bold;font-size: 18px">你可能感兴趣的用户</el-row>-->

              </div>
            </el-col>
            <el-col v-if="getToken()==null||!getToken().length>0" :span="20"
                    class=" d-flex justify-content-center h-100 w-100">
              <div class="align-self-center  w-75">
                <login-card/>
              </div>
            </el-col>

          </el-row>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import InputCard from "@/views/search/InputCard.vue";
import TrendListCard from "@/views/explore/TrendListCard.vue";
import {getTrend} from "@/api/chirper";
import {getCount} from "@/util/tools";
import {getToken} from "@/util/auth";
import LoginCard from "@/views/sign/LoginCard.vue";

export default {
  name: "Explore",
  components: {
    LoginCard,
    'input-card': InputCard,
    'trend-list': TrendListCard
  },
  computed:{
    switchType(){
      return this.$route.query.type?this.$route.query.type:this.switchOptions.Hot;
    }
  },
  data() {
    return {
      realTimeTrend: {},
      recommendTrend: {},
      switchOptions:{
        Recommend:'Recommend',
        Hot:'Hot'
      },
      trends:{
        Recommend:{},
        Hot:{}
      }
    }
  },
  methods: {
    getToken,
    getCount,
    loadHotTrend() {
      for (let i = 1; i < 4; i++) {
        getTrend(i, this.switchOptions.Hot).then(res => {
          if (Object.keys(res.data.record).length > 0) {
            Object.assign(this.trends.Hot, res.data.record);
            this.$forceUpdate()
          } else {
            i = 4;
          }
        })
      }
    },
    switchTo(type){
      this.$router.push(`/explore?type=${type}`);
    }
  },
  created() {
    this.loadHotTrend();
  }
}
</script>
<style scoped>
::v-deep .el-tabs__active-bar {
  background-color: transparent !important;
  background-image: linear-gradient(
      90deg, transparent 0, transparent 32%,
      #409EFF 0, #409EFF 68%,
      transparent 0, transparent
  );
}
</style>
