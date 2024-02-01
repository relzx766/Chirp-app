<template >
  <div class="row  w-100 vh-100  " >
    <div class="col  w-100 h-100 d-flex  justify-content-center" >
      <el-image
          class=" align-self-center  w-50 h-50 ms-5"
          :src="require('../../assets/logo.svg')"
          fit="container"/>
    </div>
    <div class="col w-100 h-100 d-flex  justify-content-start">
      <div class="align-self-center text-start w-50">
        <h1 class="fw-bolder text-dark">正发生</h1>
        <h3 class="fw-bolder text-dark mt-4">现在就加入。</h3>
        <el-form  class="w-75 ">
          <el-form-item>
            <el-button round class="w-100 oauth-btn" >
              <el-row class="h-100  d-flex  align-items-center justify-content-center" >
                  <img class="h-100" src="../../assets/google.svg" alt="Google">
                  <span class="fw-bold text-dark ms-1">使用Google账号注册</span>
              </el-row>
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button round class="w-100 oauth-btn" >
              <el-row class="h-100  d-flex  align-items-center justify-content-center">
              <img class="h-100 " src="../../assets/apple.svg" alt="Apple">
               <span class="fw-bold text-dark">使用Apple账号注册</span>
              </el-row>
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-divider>或</el-divider>
          </el-form-item>
          <el-form-item>
            <el-button round class="w-100 oauth-btn fw-bold fs-6"
                       type="primary"
            @click="registerDialog=true;loginDialog=false">
              创建账号
            </el-button>
            <p style="font-size: 12px">注册即表示同意<a href="#" class="text-decoration-none text-primary">服务条款</a>及<a href="#" class="text-decoration-none text-primary">隐私政策</a>,其中包括<a href="#" class="text-decoration-none text-primary">Cookie使用条款。</a></p>
          </el-form-item>
          <el-form-item>
            <h5 class="fw-bold text-dark mb-2">已有账号?</h5>
            <el-button round class="w-100 oauth-btn fw-bold fs-6 text-primary"
            @click="loginDialog=true;registerDialog=false">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog
        :show-close="false"
        :visible.sync="loginDialog"
        custom-class="no-header-dialog"
        width="30%">
      <el-row class="p-1">
        <login-card/>
      </el-row>
    </el-dialog>
    <el-dialog
        :show-close="false"
        :visible.sync="registerDialog"
        custom-class="no-header-dialog"
        width="30%">
      <el-row class="p-1">
        <sign-up-card/>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import SignUpCard from "@/views/sign/SignUpCard.vue";
import LoginCard from "@/views/sign/LoginCard.vue";

export default {
  name: "Sign",
  components: {LoginCard, SignUpCard},
  data(){
    return{
      registerDialog:false,
      loginDialog:false
    }
  }
}
</script>
<style scoped>
.oauth-btn{
  height: 40px;
}
</style>