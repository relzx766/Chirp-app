<template>
  <div>
    <el-card :shadow="shadow" style="border: none;
     border-bottom-right-radius: 0;border-bottom-left-radius: 0;">
      <!--  type为list-->
      <el-row v-if="type==='list'||type==='short'" style="margin-top: 14px">
        <el-col :span="2" style="text-align: left;">
          <el-avatar  style="  cursor: pointer;"  :src="chirper.avatar" fit="cover" size="large" @click.native="$router.push('/profile?id='+chirper.authorId)"/>
        </el-col>
        <el-col :span="21" style="text-align: left;margin-left: 10px">
          <el-row >
            <el-col :span="16">
              <el-link :href="'/profile?id='+chirper.authorId" style="font-size: 16px;font-weight: bold">{{ chirper.nickname }}</el-link>
              <span
                  style="color:#909399;margin-left: 10px">@{{ chirper.username }}&nbsp;·&nbsp;{{ getDate(new Date(chirper.createTime)) }}</span>
            </el-col>
            <el-col :span="8" style="text-align: right">
            </el-col>
          </el-row>
          <el-row style="cursor: pointer;"  @click.native="()=>{$router.push('/chirper/detail?id='+chirper.id)}">
            <el-row style="font-size: 14px;cursor: pointer;margin-top: 12px"
            >{{ chirper.text }}</el-row>
            <div id="media" ref="media" v-if="chirper.mediaKeys&&chirper.mediaKeys.length>0">
              <MediaCard :media="chirper.mediaKeys"/>
            </div>
          </el-row>
          <el-row>
            <click-bar v-if="type!=='short'"
                       :value="chirper" type="list"/>
          </el-row>
        </el-col>
      </el-row>
      <!-- type为detail-->
      <el-row v-if="type==='detail'" style="margin-top: 14px">
        <el-row>
          <el-col :span="2" style="text-align: left">
            <el-avatar style="  cursor: pointer;" :src="chirper.avatar" fit="cover" size="large" @click.native="$router.push('/profile?id='+chirper.authorId)"/>
          </el-col>
          <el-col :span="20" style="text-align: left;margin-left: 6px">
            <el-row v-if="type==='detail'">
              <el-row>
                <el-link :href="'/profile?id='+chirper.authorId" style="font-size: 16px;font-weight: bold">{{ chirper.nickname }}</el-link>
              </el-row>
              <el-row style="color:#909399;font-size: 12px">@{{ chirper.username }}</el-row>
            </el-row>
          </el-col>
        </el-row>

        <el-row style="text-align: left;padding-left: 4%;">
          <el-row>
            <p style="font-size: 14px">{{ chirper.text }}</p>
            <div id="media" ref="media" v-if="chirper.mediaKeys&&chirper.mediaKeys.length>0">
              <MediaCard :media="chirper.mediaKeys"/>
            </div>
          </el-row>
            <el-row style="color: #606266;font-size: 14px;">
              {{ formatDate(chirper.createTime) }}
            </el-row>
            <el-row>
              <click-bar :value="chirper" type="detail"/>
            </el-row>
        </el-row>
      </el-row>
    </el-card>

  </div>
</template>

<script>
import {getDate} from "../../util/tools";
import ChirperClickBar from "@/views/chirper/ChirperClickBar.vue";

import moment from "moment";
import MediaCard from "@/views/media/MediaCard.vue";

export default {
  name: "ChirperCard",
  props: {
    shadow: {
      type: String,
      default: "hover"
    },
    chirper: {},
    //detail  list  short
    type: String,
    media: true
  },
  methods: {
    getDate,
    formatDate(timestamp) {
      let date = moment(new Date(timestamp));
      let format;
      if (date.hours() < 12) {
        format = "上午hh:mm · YYYY年MM月DD日";
      } else {
        format = "下午hh:mm · YYYY年MM月DD日";
      }
      return date.format(format);
    }

  },
  components: {
    'click-bar': ChirperClickBar,MediaCard
  },
  mounted() {

  }
}
</script>

<style scoped>
li{
  list-style-type: none;
  float: left;
}
.media-wall{
  display: inline-block;
  width: 32%;

}
.btn-more{
  border: none;
}
/deep/ .el-card__body {
  padding: 0 !important;
}
</style>