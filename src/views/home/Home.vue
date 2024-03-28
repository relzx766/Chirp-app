<template>
  <el-container>
    <el-main>
      <div class="row">
        <div class="col border-start border-end"
             style="height: 100vh;">
          <chirper-card
              :is-login="getToken()!=null&&getToken().length>0"
              class="overflow-y-auto"
              style="max-height: 96vh;">
          </chirper-card>
        </div>
        <div class="col">
          <div v-if="getToken()!=null&&getToken().length>0">
            <input-card class="mt-2"/>
            <trend-list class="bg-light rounded-4 bg-info-2 mt-4"/>
          </div>
          <div v-if="getToken()==null||!getToken().length>0"
               class=" d-flex justify-content-center h-100 w-100">
            <div class="align-self-center  w-75">
              <login-card/>
            </div>
          </div>

        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import TrendListCard from "@/views/explore/TrendListCard.vue";
import TrendList from "@/views/explore/TrendListCard.vue";
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
    TrendList,
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

.overflow-y-auto ::-webkit-scrollbar {
  display: none;
}
</style>
