<template>
  <el-container>
    <el-main>
      <div class="row">
        <div class="col-7 border-start border-end"
             style="height: 100vh;">
          <chirper-card
              class="overflow-y-auto"
              style="max-height: 96vh;"
              :is-login="getToken()!=null&&getToken().length>0">
          </chirper-card>
        </div>
       <div class="col-5">
             <el-row class="h-100 w-100">
               <el-col v-if="getToken()!=null&&getToken().length>0" :span="20">
                 <input-card/>
                 <trend-card style="margin-top: 8%;background-color:#EBEEF5;border-radius: 10px"/>
               </el-col>
               <el-col v-if="getToken()==null||!getToken().length>0" :span="20" class=" d-flex justify-content-center h-100 w-100">
                 <div class="align-self-center  w-75">
                   <login-card />
                 </div>
               </el-col>

             </el-row>

       </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import TrendListCard from "@/views/explore/TrendListCard.vue";
import ChirperListCard from "@/views/home/ChirperListCard.vue";
import InputCard from "@/views/search/InputCard.vue";
import LoginCard from "@/views/sign/LoginCard.vue";
import {getToken} from "@/util/auth";

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
.overflow-y-auto ::-webkit-scrollbar{
  display: none;
}
</style>
