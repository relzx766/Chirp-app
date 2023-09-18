<template>
  <el-container>
    <el-main>
      <ul>
        <li
            style="width: calc(60% - 4px);border-left:2px solid #EBEEF5;border-right:2px solid #EBEEF5;min-height: 100vh">
          <el-row class="back-bar">
            <el-button circle icon="el-icon-back" style="border: none;font-size: 24px;font-weight: bold"
                       @click="$router.back()"></el-button>
            <span>帖子</span>
          </el-row>
          <el-row style="padding: 10px">
            <chirper-card v-if="currentChirper.type!=='QUOTE'" :chirper="currentChirper" :clickEvent="false"
                          :mediaVisible="true"
                          :straight="false" shadow="never" style="margin-top: 40px"/>
            <refer-card v-if="currentChirper.type==='QUOTE'" :value="currentChirper" style="margin-top: 40px"/>
            <edit-card :chirper="currentChirper" style="border-bottom: 2px solid #EBEEF5;margin-top: 10px"
                       @sent="doPost"/>
          </el-row>
          <el-row v-for="item in reply">
            <chirper-card :chirper="item" shadow="hover"
                          style="padding: 10px;border-bottom: 1px solid #E4E7ED;z-index: 1"
            />
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
import ChirperCard from "@/views/chirper/ChirperCard.vue";
import TrendListCard from "@/views/explore/TrendListCard.vue";
import LoginCard from "@/views/sign/LoginCard.vue";
import InputCard from "@/views/search/InputCard.vue";
import {getToken} from "@/util/tools";
import {getDetail, getReply} from "@/api/chirper";
import {getShortProfile} from "@/api/user";
import ReplyCard from "@/views/edit/ReplyCard.vue";
import ReferCard from "./ReferCard.vue";

export default {
  name: "Chirper",
  components: {
    'chirper-card': ChirperCard,
    'trend-card': TrendListCard,
    'login-card': LoginCard,
    'input-card': InputCard,
    'edit-card': ReplyCard,
    'refer-card': ReferCard
  },
  data() {
    return {
      currentChirper: {},
      reply: [],
      page: 1,
      isLoading: false,
      isBottom: false
    }
  },

  methods: {
    getToken,
    getReply() {
      getReply(this.currentChirper.id, this.page).then((res) => {
        this.combineWithUser(res.data.record).then((data => {
          this.reply.push(...Array.from(data));
        }));
      })
    },
    loadMoreReply() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight + 10 >= scrollHeight && !this.isBottom && !this.isLoading) {
        this.page++;
        this.isLoading = true;
        getReply(this.currentChirper.id, this.page).then((res) => {
          if (res.data.record.length > 0) {
            this.combineWithUser(res.data.record).then((data) => {
              this.reply.push(...data)
            })
          } else {
            this.isBottom = true;
          }
          this.isLoading = false;
        })
      }
    },
    init() {
      let id = this.$route.query.id;
      this.currentChirper = {};
      this.reply = [];
      this.page = 1;
      getDetail(id).then((res) => {
        this.combineWithUser([res.data.record]).then((data) => {
          this.currentChirper = data[0];
          //进入这个界面既是浏览了该推文，因为加载在统计前，所以手动+1
          this.currentChirper.viewCount++
          if (this.currentChirper.replyCount > 0) {
            this.getReply();
          }
        })
      })
    },
    combineWithUser(chirpers = []) {
      let authorIds = [];
      for (let i = 0; i < chirpers.length; i++) {
        authorIds.push(chirpers[i].authorId);
      }
      return getShortProfile(authorIds).then((res) => {
        if (res.code === 200) {
          let users = res.data.record;
          return chirpers.map(chirper => {
            let user = users.find(u => u.id === chirper.authorId);
            chirper.mediaKeys = JSON.parse(chirper.mediaKeys);
            chirper.username = user.username;
            chirper.nickname = user.nickname;
            chirper.avatar = user.smallAvatarUrl;
            return chirper;
          });
        }
        ;
        return {};
      })
    },
    doPost(chirper) {
      getDetail(chirper.id).then((res) => {
        this.combineWithUser([res.data.record]).then((data) => {
          chirper = data[0];
          this.reply.unshift(chirper)
        })
      })
    }
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    $route() {
      this.init();
    }
  },
  created() {
    this.init();
    window.addEventListener("scroll", this.loadMoreReply, true);
  },
  destroyed() {
    window.removeEventListener("scroll", this.loadMoreReply);
  }
}
</script>

<style scoped>
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
  width: calc(43% - 5px);
  top: 0;
}
</style>