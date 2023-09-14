<template>
  <el-row>
    <el-row v-if="!isVerifySuccess">
      <el-row>
        <el-input v-model="email" placeholder="请输入邮箱"/>
      </el-row>
      <el-row style="text-align: left;margin-top: 20px">
        <el-link :disabled="email===''" @click.native="isSend=true">发送验证码</el-link>
      </el-row>
      <el-row v-if="isSend" style="margin-top: 20px">
        <el-row style="text-align: left">我们已将验证码发送至你的邮箱，请注意查收</el-row>
        <el-input v-model="verifyCode" placeholder="请输入验证码" style="margin-top: 14px"/>
        <el-row style="margin-top: 14px;text-align: left">
          <el-link>确定</el-link>
        </el-row>
      </el-row>
    </el-row>

    <el-row v-else>
      <img src="../../assets/star-eye.svg" width="70%">
      <el-row>你已完成全部工作，现在开始使用吧!</el-row>
      <el-row>
        <el-button round style="width: 60%" type="primary">开始</el-button>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
export default {
  name: "EmailVerifyCard",
  data() {
    return {
      email: '',
      isSend: false,
      verifyCode: '',
      isVerifySuccess: true
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>