<template>
  <el-container>
    <el-main>
      <ul>
        <li
            style="width: calc(60% - 4px);border-left:2px solid #EBEEF5;min-height: 100vh;border-right:2px solid #EBEEF5;">
          <chirper-card :is-login="getToken()!=null&&getToken().length>0"/>
        </li>
        <li style="width: 40%;">
          <el-container>
            <el-main>
              <el-row>
                <el-col v-if="getToken()!=null&&getToken().length>0" :span="20">
                  <input-card/>
                  <trend-card style="margin-top: 8%;background-color:#EBEEF5;border-radius: 10px"/>
                </el-col>
                <el-col v-if="getToken()==null||!getToken().length>0" :span="20">

                  <login-card/>

                </el-col>

              </el-row>

            </el-main>
          </el-container>
        </li>
      </ul>
    </el-main>
  </el-container>
</template>

<script>
import TrendListCard from "@/views/explore/TrendListCard.vue";
import ChirperListCard from "@/views/home/ChirperListCard.vue";
import InputCard from "@/views/search/InputCard.vue";
import LoginCard from "@/views/sign/LoginCard.vue";
import {getToken} from "@/util/tools";

export default {
  name: "Home",
  methods: {getToken},
  props: {
    isLogin: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  components: {
    'chirper-card': ChirperListCard,
    'trend-card': TrendListCard,
    'input-card': InputCard,
    'login-card': LoginCard
  }
}
</script>

<style scoped>
li {
  list-style-type: none;
  float: left;
}

</style>
