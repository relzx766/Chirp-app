<template>
  <el-container>
    <el-main>
      <div class="row">
        <div class="col-7"
             style="border-left:2px solid #EBEEF5;height: 100vh;
             border-right:2px solid #EBEEF5;">
          <el-container>
            <el-main style="padding: 0;">
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
          <el-container>
            <el-main>
              <div style="text-align: left;background-color:#EBEEF5;border-radius: 10px">
                <el-row style="font-weight: bold;font-size: 18px">你可能感兴趣的用户</el-row>

              </div>
            </el-main>
          </el-container>
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

export default {
  name: "Explore",
  components: {
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
