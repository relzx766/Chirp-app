<template>
  <div>
    <el-row v-if="value.type==='FORWARD'"
            style="text-align: left;font-size: 14px;font-weight: bold;color: #909399;margin-bottom: 8px;">
      <el-col :offset=2 :span="21">
        <i class="el-icon-connection"/><span>{{ value.nickname }}已转发</span>
      </el-col>
    </el-row>
    <chirper-card v-if="value.type==='FORWARD'" :chirper="getReference"/>
    <chirper-card v-else-if="value.type==='QUOTE'" :barVisible="false" :chirper="value" shadow="never"/>
    <el-row v-if="value.type==='QUOTE'">
      <el-col :offset="2" :span="22" style="border: 1px solid #EBEEF5;padding: 10px;zoom: 0.9;border-radius: 12px;">
        <chirper-card :barVisible="false" :chirper="getReference" :dataVisible="false"/>
      </el-col>
    </el-row>

    <el-row v-if="value.type==='QUOTE'">
      <el-col :offset="2" :span="22">
        <click-bar :value="value" style="margin-left: 10px;"/>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {getShortProfile} from "@/api/user";
import ChirperCard from "./ChirperCard.vue"
import ChirperClickBar from "./ChirperClickBar.vue";

export default {
  name: "ReferCard",
  props: {
    value: {}
  },
  components: {
    'chirper-card': ChirperCard,
    'click-bar': ChirperClickBar
  },
  computed: {
    getReference() {
      let chirper = this.value.referenced;
      getShortProfile([chirper.authorId]).then(res => {
        let user = res.data.record[0];
        chirper.username = user.username;
        chirper.nickname = user.nickname;
        chirper.avatar = user.largeAvatarUrl;

      })
      chirper.mediaKeys = JSON.parse(chirper.mediaKeys);
      return chirper;
    }
  }
}
</script>
<style scoped>
</style>