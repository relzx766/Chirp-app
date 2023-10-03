<template>
  <el-container>
    <el-main>
      <ul>
        <li
            style="width: calc(60% - 4px);;border-left:2px solid #EBEEF5;min-height: 100vh;border-right:2px solid #EBEEF5;">

          <el-row class="back-bar">
            <el-button circle icon="el-icon-back" style="border: none;font-size: 24px;font-weight: bold"
                       @click="$router.back()"></el-button>
            <span>{{ user.username }}</span>
          </el-row>


          <el-row style="margin-top: 40px;margin-bottom: 12px;">
            <profile-card :is-self="$store.getters.getUser.id===this.user.id" :value="user"/>
          </el-row>
          <el-row>
            <el-tabs v-model="activeName" :stretch="true" @tab-click="doChirperSelectClick">
              <el-tab-pane name="chirper">
                <span slot="label" style="font-size: 16px;font-weight: bold">推文</span>
                <el-row v-for="item in chirpers" style="border-bottom: 1px solid #E4E7ED;">
                  <refer-card v-if="item.type==='FORWARD'||item.type==='QUOTE'" :barVisible="item.type!=='FORWARD'"
                              :value="item" style="margin-top: 8px;"/>
                  <chirper-card
                      v-else :chirper="item"
                      style="margin-top: 8px;"/>
                </el-row>
              </el-tab-pane>
              <el-tab-pane name="reply"><span slot="label" style="font-size: 16px;font-weight: bold">回复</span>
              </el-tab-pane>
              <el-tab-pane name="media"><span slot="label" style="font-size: 16px;font-weight: bold">媒体</span>
              </el-tab-pane>
              <el-tab-pane name="like"><span slot="label" style="font-size: 16px;font-weight: bold">喜欢</span>
              </el-tab-pane>
            </el-tabs>
          </el-row>
        </li>
        <li style="width: 40%">
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
import ProfileCard from "@/views/profile/ProfileCard.vue";
import {getDetailProfile} from "@/api/user";
import {getToken} from "@/util/tools";
import {getByAuthor} from "@/api/chirper";
import ChirperCard from "@/views/chirper/ChirperCard.vue";
import InputCard from "@/views/search/InputCard.vue";
import LoginCard from "@/views/sign/LoginCard.vue";
import TrendListCard from "@/views/explore/TrendListCard.vue";
import ReferCard from "@/views/chirper/ReferCard.vue";

export default {
  name: "Profile",
  components: {
    'refer-card': ReferCard,
    'profile-card': ProfileCard,
    'chirper-card': ChirperCard,
    'input-card': InputCard,
    'login-card': LoginCard,
    'trend-card': TrendListCard
  },
  data() {
    return {
      user: {},
      activeName: 'chirper',
      chirpers: [],
      page: 1,
      isBottom: false
    }
  },
  methods: {
    getToken,
    init() {
      let id;
      id = this.$route.query.id ? this.$route.query.id : this.$store.getters.getUser.id;
      let type;
      type = this.$route.query.type ? this.$route.query.type : null;
      if (id === this.$store.getters.getUser.id) {
        this.user = this.$store.getters.getUser;
      }
      getDetailProfile(id, type).then((res) => {
        this.user = res.data.record;
        this.doChirperSelectClick();
      })
    },
    loadMoreChirper() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight + 10 >= scrollHeight && !this.isBottom) {
        this.page++;
        getByAuthor(this.user.id, this.page).then((res) => {
          this.isBottom = Array.from(res.data.record).length <= 0
          this.chirpers.push(...Array.from(res.data.record))
        })
      }
    },
    doChirperSelectClick() {
      this.page = 1;
      getByAuthor(this.user.id, this.page).then((res) => {
        this.chirpers = res.data.record;
      })
    },
  },
  watch: {
    $route() {
      this.init();
    }
  },
  created() {
    this.init();
    window.addEventListener("scroll", this.loadMoreChirper, true)
  },
  destroyed() {
    window.removeEventListener("scroll", this.loadMoreChirper)
  }
}
</script>

<style scoped>
html, body {
  min-height: 100%;
}

li {
  list-style-type: none;
  float: left;
}

::v-deep .el-tabs__active-bar {
  background-color: transparent !important;
  background-image: linear-gradient(
      90deg, transparent 0, transparent 30%,
      #4d72f6 0, #4d72f6 70%,
      transparent 0, transparent
  );
}

.back-bar {
  text-align: left;
  font-size: 24px;
  font-weight: bold;
  position: fixed;
  z-index: 99;
  background-color: #FFFFFF;
  height: 60px;
  width: calc(44% - 5px);
  top: 0;
}
</style>
