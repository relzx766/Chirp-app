<template>
  <el-row>

    <el-row v-for="item in Object.keys(trend)" style="text-align: left;">
      <el-card shadow="hover" style="background:none;border: none"
               @click.native="$router.push('/search?keyword='+encodeURIComponent(item))">
        <el-row style="font-size: 16px;font-weight: bold;cursor: pointer">{{ item }}
        </el-row>
        <el-row style="color: #909399;font-size: 12px;margin-top: 4px">
          {{ getCount(trend[item].post) }}&nbsp;posts
        </el-row>
      </el-card>
    </el-row>
    <el-row v-if="isLoading" style="text-align: center">
      <div class="loading-box">
        <div class="loading"/>
      </div>
    </el-row>
    <el-row style="text-align: left;">
      <el-card v-if="!isBottom" shadow="hover" style="background:none;border: none">
        <el-row style="font-size: 14px;color: #409EFF;cursor: pointer;" @click.native="loadTrend">显示更多
        </el-row>
      </el-card>
    </el-row>
  </el-row>
</template>

<script>
import {getCount} from "../../util/tools";
import {getTrend} from "@/api/chirper";

export default {
  name: "TrendList",
  data() {
    return {
      page: 1,
      isBottom: false,
      //title:''
      //post:number
      trend: {},
      isLoading: true
    }
  },
  methods: {
    getCount,

    loadTrend() {
      this.isLoading = true;
      if (!this.isBottom) {
        getTrend(this.page, "hot").then(res => {
          if (Object.keys(res.data.record).length > 0) {
            this.trend = Object.assign(this.trend, res.data.record);
            this.page++;
          } else {
            this.isBottom = true;
          }
          this.isLoading = false;

        })
      }
    },
  },
  created() {
    this.loadTrend();
  }
}
</script>

<style scoped>
.loading {
  display: inline-flex;
  width: 16px;
  height: 16px;
  border: 2px solid #409EFF;
  border-top-color: transparent;
  border-radius: 100%;
  margin-top: 6px;
  animation: circle infinite 0.75s linear;
}

.loading-box {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 100%;
}

@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
