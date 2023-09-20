<template>
  <div>
    <el-card :shadow="shadow" style="border: none;padding: 4px;border-radius: 12px;">
      <el-row>
        <el-col :span="2" style="text-align: left;">
          <el-avatar :src="chirper.avatar" fit="cover" size="large" style="  cursor: pointer;"
                     @click.native="$router.push('/profile?id='+chirper.authorId)"/>
        </el-col>
        <el-col :span="21" style="text-align: left;margin-left: 10px">
          <el-row v-if="straight">
            <el-col :span="16">
              <el-link :href="'/profile?id='+chirper.authorId" style="font-size: 16px;font-weight: bold">{{
                  chirper.nickname
                }}
              </el-link>
              <span
                  style="color:#909399;margin-left: 10px">@{{ chirper.username }}</span>
              <span v-if="dataVisible" style="color: #909399;margin-left: 10px;font-size: 14px;">{{
                  getDate(new Date(chirper.createTime))
                }}</span>
            </el-col>
            <el-col :span="8" style="text-align: right">
            </el-col>
          </el-row>
          <el-row v-if="!straight">
            <el-row>
              <el-link :href="'/profile?id='+chirper.authorId" style="font-size: 16px;font-weight: bold">{{
                  chirper.nickname
                }}
              </el-link>
            </el-row>
            <el-row style="color:#909399;font-size: 12px">@{{ chirper.username }}</el-row>
          </el-row>
          <el-row style="cursor: pointer;"
                  @click.native="()=>{if (clickEvent) {$router.push('/chirper/detail?id='+chirper.id)}}">
            <el-row style="font-size: 14px;cursor: pointer;margin-top: 12px"
                    v-html="chirper.text?formatText(chirper.text):chirper.text"></el-row>

            <div v-if="mediaVisible&&chirper.mediaKeys&&chirper.mediaKeys.length>0" id="media" ref="media">
              <MediaCard :media="chirper.mediaKeys"/>
            </div>
          </el-row>
          <el-row v-if="!straight" style="text-align: left;font-size: 14px;color: #909399;margin-top: 12px;">{{
              getDate(new Date(chirper.createTime))
            }}
          </el-row>
          <el-row>
            <click-bar v-if="barVisible"
                       :value="chirper"/>
          </el-row>
        </el-col>
      </el-row>

    </el-card>

  </div>
</template>

<script>
import {formatText, getDate} from "../../util/tools";
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
    clickEvent: {
      type: Boolean,
      default: true
    },
    barVisible: {
      type: Boolean,
      default: true
    },
    mediaVisible: {
      type: Boolean,
      default: true
    },
    //时间等信息是否与昵称在同一直线
    straight: {
      type: Boolean,
      default: true
    },
    dataVisible: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getDate, formatText,
    formatDate(timestamp) {
      let date = moment(new Date(timestamp));
      let format;
      if (date.hours() < 12) {
        format = "上午hh:mm · YYYY年MM月DD日";
      } else {
        format = "下午hh:mm · YYYY年MM月DD日";
      }
      return date.format(format);
    },
    init() {

    }

  },
  components: {
    'click-bar': ChirperClickBar, MediaCard
  },
  mounted() {

  }
}
</script>

<style scoped>
li {
  list-style-type: none;
  float: left;
}

.media-wall {
  display: inline-block;
  width: 32%;

}

.btn-more {
  border: none;
}

/deep/ .el-card__body {
  padding: 0 !important;
}

</style>