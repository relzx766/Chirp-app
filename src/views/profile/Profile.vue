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
                <div id="chirper" style="padding: 6px">
                  <chirper-card v-for="item in chirpers" :chirper="item" shadow="hover"
                                style="border-bottom: 1px solid #E4E7ED;"
                                type="list"/>
                </div>
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
import {getDetailProfile, getShortProfile} from "@/api/user";
import {getToken} from "@/util/tools";
import {getByAuthor} from "@/api/chirper";
import ChirperCard from "@/views/chirper/ChirperCard.vue";
import InputCard from "@/views/search/InputCard.vue";
import LoginCard from "@/views/sign/LoginCard.vue";
import TrendListCard from "@/views/explore/TrendListCard.vue";

export default {
  name: "Profile",
  components: {
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
      if (id === this.$store.getters.getUser.id) {
        this.user = this.$store.getters.getUser;
      }
      getDetailProfile(id).then((res) => {
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
          this.combineWithUser(res.data.record).then((data) => {
            this.isBottom = data.length <= 0;
            this.chirpers.push(...data);
          })
        })
      }
    },
    doChirperSelectClick() {
      this.page = 1;
      getByAuthor(this.user.id, this.page).then((res) => {
        this.combineWithUser(res.data.record).then((data) => {
          this.chirpers = data;
        })
      })
    },
    combineWithUser(chirpers = []) {
      if (chirpers.length > 0) {
        let authorIds = [];
        for (let i = 0; i < chirpers.length; i++) {
          authorIds.push(chirpers[i].authorId);
        }
        return getShortProfile(authorIds).then((res) => {
          let users = res.data.record;
          return chirpers.map(chirper => {
            let user = users.find(u => u.id === chirper.authorId);
            chirper.mediaKeys = JSON.parse(chirper.mediaKeys);
            chirper.username = user.username;
            chirper.nickname = user.nickname;
            chirper.avatar = user.smallAvatarUrl;
            return chirper;
          });
        })
      }
      return Promise.resolve([]);

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