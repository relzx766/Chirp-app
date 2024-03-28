<template>
  <div>
    <div class="d-flex align-items-center flex-nowrap justify-content-between">
      <div>
        <el-avatar :src="user.smallAvatarUrl" fit="cover"/>
      </div>
      <div class="text-start flex-grow-1 ps-2">
        <div class="text-dark fw-bold">{{ user.nickname }}</div>
        <div class="text-secondary">@{{ user.username }}</div>
        <div class="fs-7">{{ description }}</div>
      </div>
      <div class="text-end">
        <div v-if="status===approveStatusEnums.PENDING.value">
          <el-button :disabled="disable" round size="small" type="primary" @click="accept">同意</el-button>
          <el-button :disabled="disable" round size="small" type="danger" @click="reject">拒绝</el-button>
        </div>
        <div v-else-if="status===approveStatusEnums.ACCEPT.value">
          <el-image :src="require('@/assets/accept.svg')" class="w-20" fit="cover"/>
        </div>
        <div v-else-if="status===approveStatusEnums.REJECT.value">
          <el-image :src="require('@/assets/reject.svg')" class="w-20" fit="cover"/>
        </div>
      </div>

    </div>
  </div>

</template>
<script>
import {approveStatusEnums} from "@/enums/enums";

export default {
  name: "ApplyItem",
  computed: {
    approveStatusEnums() {
      return approveStatusEnums
    }
  },
  props: {
    user: {},
    description: String,
    status: Number,
    disable: Boolean
  },
  methods: {
    accept() {
      this.$emit('accept')
    },
    reject() {
      this.$emit('reject')
    }
  }
}
</script>
<style scoped>

</style>