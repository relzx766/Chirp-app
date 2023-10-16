<template>
  <el-form :model="user" label-width="20%">
    <el-form-item>
      <img src="../../assets/logo.svg" width="20%">
    </el-form-item>
    <el-form-item>
      <el-button size="small" style="width: 100%; border-radius: 23px;font-weight: bold;height:40px;"
                 @click="loginWithGoogle">
        <el-row style="height: 100%">
          <el-col :span="6" style="height: 100%;text-align: right"><img height="100%" src="../../assets/google.svg">
          </el-col>
          <el-col :span="14" style="text-align: left;height: 100%;margin-left: 10px">
            <span style="line-height: 20px"> Sign in with Google</span>
          </el-col>
        </el-row>
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button size="small" style="width: 100%; border-radius: 23px;font-weight: bold;height:40px;"
                 @click="loginWithApple">
        <el-row style="height: 100%">
          <el-col :span="6" style="height: 100%;text-align: right"><img height="100%" src="../../assets/apple.svg">
          </el-col>
          <el-col :span="14" style="text-align: left;height: 100%;margin-left: 10px">
            <span style="line-height: 20px"> Sign in with Apple</span>
          </el-col>
        </el-row>
      </el-button>
    </el-form-item>
    <el-form-item>
      or
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
    <el-form-item>
      <el-button size="small" style="width: 100%; border-radius: 23px;font-weight: bold;height:40px;">忘记密码
      </el-button>
    </el-form-item>
    <el-form-item>
      还没有账号?
      <el-link style="color: #409EFF" @click.native="signUpDialog=true">注册</el-link>
    </el-form-item>
    <el-dialog
        :show-close="false"
        :visible.sync="signUpDialog"
        width="30%">
      <el-row style="margin-top: -50px;width: 106%;margin-left: -3%;min-height: 50vh">
        <sign-up-card/>
      </el-row>
    </el-dialog>

  </el-form>
</template>

<script>
import SignUpCard from "@/views/sign/SignUpCard.vue";
import EmailVerifyCard from "@/views/sign/EmailVerifyCard.vue";
import {signIn} from "@/api/sign";

export default {
  name: "LoginCard",
  components: {
    'sign-up-card': SignUpCard,
    'verify-card': EmailVerifyCard
  },
  data() {
    return {
      user: {
        account: '',
        password: '',
        avatar: "https://dogefs.s3.ladydaily.com/~/source/wallhaven/small/rr/rr793m.jpg?w=400&h=200&fmt=webp"
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
      signIn(this.user.account, this.user.password).then((res) => {
        if (res.code === 200) {
          localStorage.setItem("token", res.data.record.token);
          localStorage.setItem("id", res.data.record.user.id);
          this.$router.go(0);
        } else {
          this.$message.error(res.data.message);
        }
      })

    }
  },
}
</script>

<style scoped>

</style>
