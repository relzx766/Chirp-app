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
            <el-tabs v-model="activeName" :stretch="true" @tab-click="getPage">
              <el-tab-pane name="all">
                <span slot="label" style="font-size: 16px;font-weight: bold">推文</span>
                <el-row v-for="item in chirpers.all.chirper" style="border-bottom: 1px solid #E4E7ED;">
                  <refer-card v-if="item.type==='FORWARD'||item.type==='QUOTE'" :barVisible="item.type!=='FORWARD'"
                              :value="item" style="margin-top: 8px;"/>
                  <chirper-card
                      v-else :chirper="item"
                      style="margin-top: 8px;"/>
                </el-row>
              </el-tab-pane>
              <el-tab-pane name="reply"><span slot="label" style="font-size: 16px;font-weight: bold">回复</span>
                <el-row v-for="item in chirpers.reply.chirper" style="border-bottom: 1px solid #E4E7ED;">
                  <refer-card v-if="item.type==='FORWARD'||item.type==='QUOTE'" :barVisible="item.type!=='FORWARD'"
                              :value="item" style="margin-top: 8px;"/>
                  <chirper-card
                      v-else :chirper="item"
                      style="margin-top: 8px;"/>
                </el-row>
              </el-tab-pane>
              <el-tab-pane name="media"><span slot="label" style="font-size: 16px;font-weight: bold">媒体</span>
                <el-row v-for="item in chirpers.media.chirper" style="border-bottom: 1px solid #E4E7ED;">
                  <refer-card v-if="item.type==='FORWARD'||item.type==='QUOTE'" :barVisible="item.type!=='FORWARD'"
                              :value="item" style="margin-top: 8px;"/>
                  <chirper-card
                      v-else :chirper="item"
                      style="margin-top: 8px;"/>
                </el-row>
              </el-tab-pane>
              <el-tab-pane name="like"><span slot="label" style="font-size: 16px;font-weight: bold">喜欢</span>
                <el-row v-for="item in chirpers.like.chirper" style="border-bottom: 1px solid #E4E7ED;">
                  <refer-card v-if="item.type==='FORWARD'||item.type==='QUOTE'" :barVisible="item.type!=='FORWARD'"
                              :value="item" style="margin-top: 8px;"/>
                  <chirper-card
                      v-else :chirper="item"
                      style="margin-top: 8px;"/>
                </el-row>
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
import {getChirperPage, getLikeByUser} from "@/api/chirper";
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
      activeName: 'all',
      isLoading: false,
      chirpers: {
        all: {
          chirper: [],
          page: 1,
          isBottom: false
        },
        reply: {
          chirper: [],
          page: 1,
          isBottom: false
        },
        media: {
          chirper: [],
          page: 1,
          isBottom: false
        },
        like: {
          chirper: [],
          page: 1,
          isBottom: false
        }
      }
    }
  },
  methods: {
    getToken,
    init() {
      let id;
      id = this.$route.query.id ? this.$route.query.id : this.$store.getters.getUser.id;
      let type;
      if (!id) {
        this.init();
      }
      type = this.$route.query.type ? this.$route.query.type : null;
      if (id === this.$store.getters.getUser.id) {
        this.user = this.$store.getters.getUser;
      }
      getDetailProfile(id, type).then((res) => {
        this.user = res.data.record;
        this.getPage();
      }).catch(e => {
        console.log(e)
      })
    },
    getPage() {
      if (this.activeName === 'all' && !this.chirpers.all.isBottom) {
        let options = {}
        options['userId'] = [this.user.id];
        this.isLoading = true;
        getChirperPage(this.chirpers.all.page, options).then(res => {
          this.chirpers.all.isBottom = res.data.record.length <= 0;
          this.isLoading = false;
          this.chirpers.all.chirper.push(...res.data.record);
          this.chirpers.all.page++;
        })
      } else if (this.activeName === 'reply' && !this.chirpers.reply.isBottom) {
        let options = {
          'userId': [this.user.id],
          'type': 'reply'
        };
        this.isLoading = true;
        getChirperPage(this.chirpers.reply.page, options).then(res => {
          this.chirpers.reply.isBottom = res.data.record.length <= 0;
          this.isLoading = false;
          this.chirpers.reply.chirper.push(...res.data.record);
          this.chirpers.reply.page++;

        })
      } else if (this.activeName === 'media' && !this.chirpers.media.isBottom) {
        let options = {
          'userId': [this.user.id],
          'isMedia': true
        }
        this.isLoading = true;
        getChirperPage(this.chirpers.media.page, options).then(res => {
          this.chirpers.media.chirper.push(...res.data.record);
          this.isLoading = false;
          this.chirpers.media.isBottom = res.data.record.length <= 0;
          this.chirpers.media.page++;
        })
      } else if (this.activeName === 'like' && !this.chirpers.like.isBottom) {
        this.isLoading = true;
        getLikeByUser(this.chirpers.like.page, this.user.id).then(res => {
          this.chirpers.like.isBottom = res.data.record.length <= 0;
          this.chirpers.like.page++;
          this.chirpers.like.chirper.push(...res.data.record);
          this.isLoading = false;
        })
      }
    },
    loadMoreChirper() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight + 10 >= scrollHeight && !this.isLoading) {
        this.getPage();
      }
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
