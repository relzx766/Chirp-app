<template>
  <div>
    <el-row v-if="value.type===chirperTypeEnums.FORWARD"
            style="text-align: left;font-size: 14px;font-weight: bold;color: #909399;margin-bottom: 8px;">
      <el-col :offset=2 :span="21" class="text-dark-emphasis">
        <i class="el-icon-connection fw-bold" style="margin-left: -14px"/><span style="margin-left: 14px">{{ value.nickname }}&nbsp;已转发</span>
      </el-col>
    </el-row>
    <chirper-card v-if="value.type===chirperTypeEnums.FORWARD" :chirper="value.referenced"/>
    <chirper-card v-else-if="value.type===chirperTypeEnums.QUOTE||value.type===chirperTypeEnums.REPLY" :barVisible="false" :chirper="value"
                  :dataVisible="dateVisible" shadow="never"/>
    <el-row v-if="value.type===chirperTypeEnums.QUOTE||value.type===chirperTypeEnums.REPLY">
      <el-col :offset="2" :span="22" style="border: 1px solid #EBEEF5;padding: 1px;zoom: 0.9;border-radius: 12px;">
        <chirper-card :barVisible="false" :chirper="value.referenced" :dataVisible="false"/>
      </el-col>
    </el-row>

    <el-row v-if="barVisible">
      <el-col :offset="2" :span="22">
        <click-bar :value="value" style="margin-left: 10px;"/>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ChirperCard from "./ChirperCard.vue"
import ChirperClickBar from "./ChirperClickBar.vue";
import {chirperTypeEnums} from "@/enums/enums";

export default {
  name: "ReferCard",
  computed: {
    chirperTypeEnums() {
      return chirperTypeEnums
    }
  },
  props: {
    value: {},
    dateVisible: true,
    barVisible: {
      type: Boolean,
      default: true
    }
  },
  components: {
    'chirper-card': ChirperCard,
    'click-bar': ChirperClickBar
  },
}
</script>
<style scoped>
</style>
