<template>
  <el-row>
    <el-col :span="2">
      <i v-if="type==='REPLY'" class="el-icon-chat-dot-square" style="color: #909399;font-size: 30px;"/>
      <i v-if="type==='QUOTE'" class="el-icon-edit" style="color: #fdd835;font-size: 30px;"/>
      <i v-if="type==='LIKE'" class="el-icon-star-on" style="color:#F56C6C;font-size: 30px"/>
      <i v-if="type==='FORWARD'" class="el-icon-connection" style="color:#67C23A;font-size: 30px"/>
      <i v-if="type==='FOLLOW'" class="el-icon-user-solid" style="color: #409EFF;font-size: 30px "/>
    </el-col>
    <el-col v-if="!entity&&type!=='MENTIONED'" :span="22" style="text-align: left;">
      <el-row>
        <el-col :span="20">
          <el-avatar v-for="index in urls.length>8?8:urls.length" :src="urls[index-1]"
                     style="margin-right: 4px;"></el-avatar>
        </el-col>
        <el-col :span="4" style="text-align: right;">
          <span style="font-size: 12px;color: #909399;">{{ yearMonthDay(new Date(date)) }}</span>
        </el-col>
      </el-row>
      <el-row style="font-size: 14px;margin-bottom: 8px">
        <span style="font-weight: bold;">{{ name }}</span>
        <span v-if="urls.length>1">等{{ urls.length }}人</span>
        <span>{{ getEvent }}了</span>
        <span v-if="sonEntity">{{ chirperTypeConvert }}</span>
        <span v-if="type==='FOLLOW'">你</span>
      </el-row>
      <el-row v-if="sonEntity"
              style="zoom: 0.92;border-radius: 12px;border: 1px solid #EBEEF5;margin-bottom: 8px;">
        <chirper-card :bar-visible="false" :chirper="sonEntity" :data-visible="false"/>
      </el-row>
    </el-col>
    <el-col v-if="entity" :span="22" style="text-align: left;">
      <refer-card :barVisible="false" :value="combineChirper" style="margin-bottom: 8px;"/>
    </el-col>
    <el-col v-if="type==='MENTIONED'" :span="22"
            style="text-align: left;padding: 6px;">
      <span style="margin-left: 10%;color: #303133;font-size: 14px;font-weight: bold;">提到了你</span>
      <chirper-card :chirper="sonEntity" style="margin-bottom: 8px;"/>
    </el-col>
  </el-row>
</template>
<script>
import {getDate} from '@/util/tools';
import ChirperCard from '../chirper/ChirperCard.vue';
import ReferCard from '../chirper/ReferCard.vue';
import {yearMonthDay} from "../../util/formatter";


export default {
  name: "NoticeDetail",
  components: {
    'chirper-card': ChirperCard,
    'refer-card': ReferCard
  },
  props: {
    type: '',
    urls: [],
    name: '',
    entity: {},
    sonEntity: {},
    date: ""
  },
  methods: {
    yearMonthDay,
    getDate
  },
  computed: {
    combineChirper() {
      let chirper = this.entity;
      chirper.referenced = this.sonEntity;
      return chirper;
    },
    getEvent() {
      let event;
      switch (this.type) {
        case 'LIKE':
          event = "赞";
          break;
        case 'FORWARD':
          event = '转发';
          break;
        case 'REPLY':
          event = '评论';
          break;
        case 'QUOTE':
          event = '引用';
          break;
        case 'FOLLOW':
          event = '关注';
          break;
        default:
          break;
      }
      return event;
    },
    chirperTypeConvert() {
      let item;
      switch (this.sonEntity.type) {
        case "ORIGIN":
          item = "推文";
          break;
        case "REPLY":
          item = "回复";
          break;
        case "QUOTE":
          item = "引用";
          break;
        default:
          item = "推文";
          break;
      }
      return item;
    }
  },
  created() {
    if (this.type === 'FOLLOW') {
      console.log(this.urls)
    }
  }
}
</script>
