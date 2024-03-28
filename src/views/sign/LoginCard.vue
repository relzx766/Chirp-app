<template>
  <div class="container">
    <el-form :model="user">
      <el-form-item>
        <img alt="logo" src="../../assets/logo.svg" width="20%">
      </el-form-item>
      <el-form-item>
        <el-button class="w-100 oauth-btn" round
                   @click="loginWithGoogle">
          <el-row
              class="h-100  d-flex  align-items-center justify-content-center">
            <img alt="Google" class="h-100" src="../../assets/google.svg">
            <span class="fw-bold text-dark ms-1"> Sign in with Google</span>
          </el-row>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="w-100 oauth-btn" round
                   @click="loginWithApple">
          <el-row class="h-100  d-flex  align-items-center justify-content-center">
            <img alt="Apple" class="h-100" src="../../assets/apple.svg">
            <span class="fw-bold text-dark ms-1"> Sign in with Apple</span>
          </el-row>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-divider>or</el-divider>
      </el-form-item>
      <el-form-item>
        <el-input v-model="user.account" placeholder="用户名/邮箱"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="user.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" size="small" style="width: 100%; border-radius: 23px;color: #FFFFFF;
    font-weight: bold;height:40px;background-color: #000000" @click="loading=true;doLogin()">登录
        </el-button>
      </el-form-item>
<!--      <el-form-item>
        <el-button size="small" style="width: 100%; border-radius: 23px;font-weight: bold;height:40px;"
                   @click="$router.push('/sign/pwd/reset')">忘记密码
        </el-button>
      </el-form-item>-->
      <el-form-item>
        还没有账号?
        <el-link style="color: #409EFF" @click.native="signUpDialog=true">注册</el-link>
      </el-form-item>
      <el-dialog
          :show-close="false"
          :visible.sync="signUpDialog"
          append-to-body
          custom-class="no-header-dialog"
          width="30%">
        <el-row class="p-1">
          <sign-up-card/>
        </el-row>
      </el-dialog>

    </el-form>
  </div>

</template>

<script>
import SignUpCard from "@/views/sign/SignUpCard.vue";
import {userActions} from "@/config/vuex/action-types";

export default {
  name: "LoginCard",
  components: {
    'sign-up-card': SignUpCard,
  },
  data() {
    return {
      user: {
        account: '',
        password: '',
        avatar: ''
      },
      signUpDialog: false,
      verifyDialog: false,
      loading: false
    }
  },
  methods: {
    loginWithGoogle() {
      this.$message('google还未支持😥');
    },
    loginWithApple() {
      this.$message('apple还未支持😥');
    },
    doLogin() {
      this.$store.dispatch(`user/${userActions.LOGIN}`, this.user)
          .then(() => {
            window.location.href = '/home'
          }).catch(e => {
        this.$message.error(e.message);
      }).finally(_=>{
        this.loading=false
      })
    }
  },
}
</script>

<style scoped>
.oauth-btn {
  height: 40px;
}
</style>
