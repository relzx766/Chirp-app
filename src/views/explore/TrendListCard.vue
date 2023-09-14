<template>
  <el-row>
    <el-row v-for="item in trend" style="text-align: left;">
      <el-card shadow="hover" style="background:none;border: none">
        <el-row style="font-size: 16px;font-weight: bold;">{{ item.title }}
        </el-row>
        <el-row style="color: #909399;font-size: 12px;margin-top: 4px">{{ getCount(item.post) }}&nbsp;posts</el-row>
      </el-card>
    </el-row>
    <el-row style="text-align: left;">
      <el-card shadow="hover" style="background:none;border: none">
        <el-row style="font-size: 14px;color: #409EFF">显示更多
        </el-row>
      </el-card>
    </el-row>
  </el-row>
</template>

<script>
import {getCount} from "../../util/tools";

export default {
  name: "TrendList",
  methods: {getCount},
  data() {
    return {
      //title:''
      //post:number
      trend: [
        {
          title: "#这里是展示热门的地方🤩",
          post: 111
        },
        {
          title: "#但是现在还没有实现😥",
          post: 222
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>