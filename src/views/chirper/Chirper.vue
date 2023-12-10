<template>
  <el-container>
    <el-main>
      <div class="row">
        <div class="col-7"
             style="border-left:2px solid #EBEEF5;border-right:2px solid #EBEEF5;">
          <el-container>
            <el-main class="overflow-y-auto" style="display: flex;flex-direction: column;height: 100vh;padding: 0">
              <el-row class="fw-bold fs-4 text-start" style="align-self: flex-start;height: 70px">
                <el-button circle icon="el-icon-back" style="border: none;font-size: 24px;font-weight: bold"
                           @click="$router.back()"></el-button>
                <span>帖子</span>
              </el-row>
              <div class="overflow-y-auto" style="height: 100vh">
                <el-row  style="margin-bottom: 40px">

                  <chirper-card v-if="refer.visible" id="refer" ref="refer" :chirper="refer.record"/>

                  <chirper-card v-if="currentChirper.type!=='QUOTE'" id="current" ref="current" :chirper="currentChirper"
                                :clickEvent="false"
                                :mediaVisible="true"
                                :straight="false" shadow="never"/>
                  <refer-card v-if="currentChirper.type==='QUOTE'" id="current" ref="current" :value="currentChirper"
                            />
                  <edit-card :chirper="currentChirper" style="border-bottom: 2px solid #EBEEF5;margin-top: 10px"
                             @sent="doPost"/>

                </el-row>
                <el-row v-for="item in reply">
                  <chirper-card :chirper="item" shadow="hover"
                                style="padding: 10px;border-bottom: 1px solid #E4E7ED;z-index: 1"
                  />
                </el-row>
              </div>

            </el-main>
          </el-container>
        </div>
        <div class="col-5">
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
        </div>
      </div>
    </el-main>
  </el-container>

</template>

<script>
import ChirperCard from "@/views/chirper/ChirperCard.vue";
import TrendListCard from "@/views/explore/TrendListCard.vue";
import LoginCard from "@/views/sign/LoginCard.vue";
import InputCard from "@/views/search/InputCard.vue";
import {getToken} from "@/util/auth";
import {getDetail, getReply} from "@/api/chirper";
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
      isLoading: true,
      isBottom: false,
      refer: {
        record: {},
        visible: false
      }
    }
  },

  methods: {
    getToken,
    getReply() {
      getReply(this.currentChirper.id, this.page).then((res) => {
        this.reply.push(...res.data.record)

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
          if (res.code===200&&res.data.record.length > 0) {
            this.reply.push(...res.data.record);
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
        this.currentChirper = res.data.record;
        //进入这个界面既是浏览了该推文，因为加载在统计前，所以手动+1
        this.currentChirper.viewCount++
        if (this.currentChirper.replyCount > 0) {
          this.getReply();
          this.isLoading = false;
        }
        if (this.currentChirper.inReplyToChirperId) {
          getDetail(this.currentChirper.inReplyToChirperId).then(res => {
            this.refer.record = res.data.record;
            this.refer.visible = true;
            this.$nextTick(() => {
              this.$nextTick(() => {
                document.documentElement.scrollTop = window.innerHeight - document.getElementById("current").offsetHeight;
              })
            })
          })
        }
      })

    },
    doPost(chirper) {
      this.currentChirper.replyCount++;
      getDetail(chirper.id).then((res) => {
        let chirper = res.data.record;
        let user = this.$store.getters.getUser;
        chirper.username = user.username;
        chirper.nickname = user.nickname;
        chirper.avatar = user.smallAvatarUrl;
        this.reply.unshift(chirper);

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
  mounted() {
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
.overflow-y-auto ::-webkit-scrollbar{
  display: none;
}
</style>
