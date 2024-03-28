<template>
  <div>
    <el-card v-if="chirper" :shadow="shadow" class="border-0 p-1" style="border-radius: 12px;">
      <div class="row">
        <div :class="clickEvent?['finger']:[]" class="col-1"
             style="text-align: left;"
             @click="()=>{if (clickEvent) {$router.push('/chirper/detail?id='+chirper.id)}}">
          <el-avatar :src="chirper.avatar" fit="cover" size="large" style="  cursor: pointer;"
                     @click.native="$router.push('/profile?username='+chirper.username)"/>
        </div>
        <div class="col-sm" style="text-align: left;">
          <div v-if="straight" class="row">
            <div class="col-8">
              <el-link class="fs-6 fw-bold" @click="$router.push('/profile?username='+chirper.username)">{{
                  chirper.nickname
                }}
              </el-link>
              <span class="text-secondary ms-2 fs-6">@{{ chirper.username }}</span>
              <span v-if="dataVisible" class="fs-5 text-secondary"> · </span>
              <span v-if="dataVisible" class="text-secondary fs-6">{{
                  yMdHm(new Date(chirper.createTime))
                }}</span>
            </div>
            <div class="col" style="text-align: right">
            </div>
          </div>
          <div v-if="!straight" class="row">
            <div>
              <el-link class="fs-6 fw-bold" @click="$router.push('/profile?username='+chirper.username)">{{
                  chirper.nickname
                }}
              </el-link>
            </div>
            <div class="text-secondary fs-8">@{{ chirper.username }}</div>
          </div>
          <div class="row">
            <div
                class="fs-7  mt-3"
                v-html="chirper.text?formatChirper(chirper.text):chirper.text"></div>

            <div v-if="mediaVisible&&chirper.mediaKeys&&chirper.mediaKeys.length>0" id="media" ref="media" class="w-94">
              <MediaCard :media="chirper.mediaKeys"/>
            </div>
          </div>
          <div v-if="!straight" class="text-start fs-7 mt-3 text-secondary">{{
              yMdHm(new Date(chirper.createTime))
            }}
          </div>
          <el-row>
            <click-bar v-if="barVisible"
                       :value="chirper"/>
          </el-row>
        </div>
      </div>

    </el-card>

  </div>
</template>

<script>
import {bigNumberToString, getDate} from "@/util/tools";
import ChirperClickBar from "@/views/chirper/ChirperClickBar.vue";

import moment from "moment";
import MediaCard from "@/views/media/MediaCard.vue";
import {formatChirper, yMdHm} from "@/util/formatter";

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
    },
    replyVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    yMdHm,
    bigNumberToString,
    getDate, formatChirper,
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
  created() {
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

::v-deep .el-card__body {
  padding: 0 !important;
}

</style>
