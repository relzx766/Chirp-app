<template>
  <el-container>
    <el-main>
      <div class="row">
        <div class="col-7 border-start border-end p-2"
             style="height: 100vh;">
          <el-container>
            <el-main class="p-0">
              <input-card/>
              <el-tabs :stretch="true" value="recommend">
                <el-tab-pane name="recommend">
                  <span slot="label" style="font-size: 16px;font-weight: bold">为你推荐</span>

                </el-tab-pane>
                <el-tab-pane name="trend">
                  <span slot="label" style="font-size: 16px;font-weight: bold">当前趋势</span>
                  <div>
                    <el-row v-for="(item,index) in Object.keys(realTimeTrend)" style="text-align: left;">
                      <el-card shadow="hover" style="background:none;border: none"
                               @click.native="$router.push('/search?keyword='+encodeURIComponent(item))">
                        <el-row style="color: #909399;font-size: 14px;margin-bottom: 4px">
                          {{ index + 1 }}·{{ getCount(realTimeTrend[item].score) }} hot
                        </el-row>
                        <el-row style="font-size: 16px;font-weight: bold;cursor: pointer">{{ item }}
                        </el-row>
                        <el-row style="color: #909399;font-size: 12px;margin-top: 4px">
                          {{ getCount(realTimeTrend[item].post) }}&nbsp;posts
                        </el-row>
                      </el-card>
                    </el-row>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-main>
          </el-container>
        </div>
        <div class="col-5">
          <el-row class="h-100 w-100">
            <el-col v-if="getToken()!=null&&getToken().length>0" :span="20">
              <div style="text-align: left;background-color:#EBEEF5;border-radius: 10px">
                <el-row style="font-weight: bold;font-size: 18px">你可能感兴趣的用户</el-row>

              </div>
            </el-col>
            <el-col v-if="getToken()==null||!getToken().length>0" :span="20" class=" d-flex justify-content-center h-100 w-100">
              <div class="align-self-center  w-75">
                <login-card />
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
  data() {
    return {
      realTimeTrend: {},
      recommendTrend: {}
    }
  },
  methods: {
    getToken,
    getCount,
    loadTimeTrend() {
      for (let i = 1; i < 4; i++) {
        getTrend(i, "hot").then(res => {
          if (Object.keys(res.data.record).length > 0) {
            Object.assign(this.realTimeTrend, res.data.record);
            this.$forceUpdate()
          } else {
            i = 4;
          }
        })
      }
    }
  },
  created() {
    this.loadTimeTrend();
  }
}
</script>
<style scoped>
::v-deep .el-tabs__active-bar {
  background-color: transparent !important;
  background-image: linear-gradient(
      90deg, transparent 0, transparent 32%,
      #409EFF  0,  #409EFF  68%,
      transparent 0, transparent
  );
}
</style>
