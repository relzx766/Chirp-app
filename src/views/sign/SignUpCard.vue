<template>
  <el-row style="width: 100%;">
    <el-container>
      <el-header class="p-2">
        <div class="row ">
          <div class="col d-flex justify-content-start">
            <el-button v-show="active>0" round size="small" type="info"
                       @click="active>0?active--:active">back
            </el-button>
          </div>
          <div class="col d-flex justify-content-center">
            <img alt="logo" src="../../assets/logo.svg" width="40px">
          </div>
          <div class="col d-flex justify-content-end">
            <el-button v-show="active<1" :disabled="isUnExists||isEmailExists||user.password.trim().length<6||user.password.trim().length>30
||!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(user.email)||!/^[a-zA-Z0-9]{4,30}$/.test(user.username)" round size="small" type="primary"
                       @click="doNext()">
              next
            </el-button>
          </div>
        </div>
      </el-header>
      <el-form :model="user" :rules="rules" class="p-2">
        <el-row v-if="active===0">
          <el-form-item prop="username">
            <el-input v-model="user.username"
                      class="sign-form-input border-danger-subtle" placeholder="用户名" size="medium">
              <i v-show="unChecking"
                 slot="suffix" class="el-icon-loading el-input__icon"/>
              <i v-show="isUnExists&&!unChecking||user.username.trim().length<=0"
                 slot="suffix" class="el-icon-close el-input__icon text-danger"/>
              <i v-show="!isUnExists&&!unChecking&&user.username.trim().length>0&&/^[a-zA-Z0-9]{4,30}$/.test(user.username)"
                 slot="suffix"
                 class="el-icon-check el-input__icon text-success"/>
            </el-input>
          </el-form-item>
          <el-form-item class="mt-2" prop="password">
            <el-input v-model="user.password" class="sign-form-input" placeholder="密码" show-password size="medium"/>
          </el-form-item>
          <el-form-item class="mt-2" prop="email">
            <el-input v-model="user.email"
                      class="sign-form-input" placeholder="邮箱" size="medium">
              <i v-show="emailChecking"
                 slot="suffix" class="el-icon-loading el-input__icon"/>
              <i v-show="isEmailExists&&!emailChecking||user.email.trim().length<=0"
                 slot="suffix" class="el-icon-close el-input__icon text-danger"/>
              <i v-show="!isEmailExists&&!emailChecking&&user.email.trim().length>0&&/^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(user.email)"
                 slot="suffix"
                 class="el-icon-check el-input__icon text-success"/>
            </el-input>
          </el-form-item>
          <el-row style="margin-top: 40px;margin-bottom: 14px;font-weight: bold;text-align: left">
            <span>你的生日</span>
          </el-row>
          <el-form-item prop="birthday">
            <el-date-picker
                v-model="user.birthday"
                :picker-options="pickerOptions"
                format="yyyy 年 MM 月 dd 日"
                placeholder="生日"
                style="width: 100%;float: right"
                type="date">
            </el-date-picker>
          </el-form-item>


        </el-row>

        <el-row v-if="active===1">
          <el-image
              :src="require('../../assets/star-eye.svg')"
              fit="container"/>
          <el-row class="text-center">你已完成全部工作，现在开始使用吧!</el-row>
          <el-row class="text-center">
            <el-button round style="width: 60%" type="primary" @click="()=>{$router.go(0)}">开始</el-button>
          </el-row>
        </el-row>
      </el-form>
    </el-container>

  </el-row>

</template>

<script>
import moment from "moment";
import {signUp} from "@/api/sign";
import {checkEmail, checkUsername} from "@/api/user";

export default {
  name: "SignUpCard",
  data() {
    return {
      user: {
        username: "",
        password: "",
        email: "",
        birthday: ""
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 4, max: 30, message: '用户名长度在4-30位', trigger: 'blur'},
          {validator: this.unCheck, trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 30, message: '密码长度在6-30位', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '邮箱格式不正确', trigger: 'blur'},
          {validator: this.emailCheck, trigger: 'blur'}
        ]
      },
      isUnExists: true,
      unChecking: false,
      isEmailExists: true,
      emailChecking: false,
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        },
        selectableRange: '00:00:00 - ' + new Date().getHours() + ':' + (new Date().getMinutes() + 1) + ':00'
      },
      active: 0,
      nextDisabled: true
    }
  },
  methods: {
    doNext() {
      if (this.active === 0) {
        let birthday = moment(this.user.birthday).format("YYYY-MM-DD");
        signUp(this.user.username, this.user.password, this.user.email, birthday).then((res) => {
          if (res.code === 200) {
            this.active++;
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      }
    },
    getDayOptions() {
      let firstDay = new Date(this.user.birthday.year, this.user.birthday.month, 1);
      let nextMonthFirstDay = new Date(this.user.birthday.year, this.user.birthday.month + 1, 1);
      let lastDay = new Date(nextMonthFirstDay - 1);
      let start = parseInt(moment(firstDay).format("D"));
      let end = parseInt(moment(lastDay).format("D"));
      let option = [];
      for (let i = start; i < end + 1; i++) {
        option.push(i);
      }
      return option;
    },
    unCheck(rule, value, callback) {
      if (this.user.username.trim().length > 0) {
        this.unChecking = true;
        checkUsername(this.user.username).then(res => {
          this.unChecking = false;
          this.isUnExists = res.data.record;
          if (res.data.record) {
            callback(new Error("用户名已存在"));
          } else {
            callback();
          }
        });
      } else {
        callback(new Error("请输入用户名"));
      }
    },
    emailCheck(rule, value, callback) {
      if (this.user.email.trim().length > 0) {
        this.emailChecking = true;
        checkEmail(this.user.email).then(res => {
          this.emailChecking = false;
          this.isEmailExists = res.data.record;
          if (res.data.record) {
            callback(new Error("邮箱已被使用"));
          } else {
            callback();
          }
        });
      } else {
        callback(new Error("请输入邮箱"));
      }
    },
  },
  created() {
    this.getDayOptions()
  }
}
</script>

<style scoped>

.sign-form-input {
  width: 100%;
}
</style>
