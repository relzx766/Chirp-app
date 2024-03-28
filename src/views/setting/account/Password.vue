<template>
  <div>
    <div class="row mt-2 mb-2 d-flex align-items-center">
      <div class="col-1">
        <el-button circle
                   class="fs-5 fw-bold text-dark border-0 p-2"
                   icon="el-icon-back"
                   @click="$router.back()"></el-button>
      </div>
      <div class="col text-start fs-5 fw-bold text-dark">
        {{ pwdMenu.title }}
      </div>
    </div>
    <el-form ref="pwdForm" :model="pwd" :rules="rules">
      <el-form-item prop="current">
        <el-input v-model="pwd.current" placeholder="旧密码" show-password></el-input>
      </el-form-item>
      <el-form-item prop="newOne">
        <el-input v-model="pwd.newOne" placeholder="新密码" show-password></el-input>
      </el-form-item>
      <el-form-item prop="check">
        <el-input v-model="pwd.check" placeholder="再次输入" show-password></el-input>
      </el-form-item>
      <el-form-item class="text-end">
        <el-button :disabled="!savable" class="fw-bold fs-6" round type="primary"
                   @click="save">保存
        </el-button>
      </el-form-item>
    </el-form>


  </div>
</template>
<script>
import {mapState} from "vuex";
import {resetPwd} from "@/api/sign";
import {userActions} from "@/config/vuex/action-types";

export default {
  name: "Password",
  computed: {
    ...mapState({
      pwdMenu: state => state.menu.setting.children.account.children.password,
      user: state => state.user
    }),
    savable() {
      return this.pwd.newOne === this.pwd.check &&
          this.pwd.newOne.length > 0
    }
  },
  data() {
    return {
      pwd: {
        current: '',
        newOne: '',
        check: ''
      },
      rules: {
        current: [
          {required: true, message: '请输入旧密码', trigger: 'blur'}
        ],
        newOne: [
          {required: true, message: '请输入新密码', trigger: 'blur'}
        ],
        check: [
          {required: true, message: '请再次输入新密码', trigger: 'blur'},
          {validator: this.pwdCheck, trigger: 'blur'}
        ]
      }

    }
  },
  methods: {
    pwdCheck(rule, value, callback) {
      if (value !== this.pwd.newOne) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    async save() {
      await this.$refs.pwdForm.validate(async (valid) => {
        if (valid) {
          await resetPwd(this.pwd.current, this.pwd.newOne).then(res => {
            if (res.code === 200) {
              this.$message.success("修改密码成功");
              return this.$store.dispatch(`user/${userActions.LOGIN}`, {
                account: this.user.username,
                password: this.pwd.newOne
              });
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false;
        }
      });
    }
  }
}

</script>

<style scoped>

</style>