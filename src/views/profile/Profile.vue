<template>
  <el-container>
    <el-main>
      <div class="row">
        <div class="col-7 border-start border-end">
          <el-container>
            <el-main class="overflow-y-auto" style="display: flex;flex-direction: column;height: 100vh;padding: 0">
              <el-row class="fw-bold fs-4" style="height: 80px;align-self: flex-start">
                <el-button circle icon="el-icon-back" style="border: none;font-size: 24px;font-weight: bold"
                           @click="$router.back()"></el-button>
                <span>{{ user.username }}</span>
              </el-row>

              <div class="overflow-y-auto" style="max-height: 100vh">
                <div style="margin-bottom: 40px">
                  <el-row>
                    <profile-card :is-self="currentUser.id===user.id" :value="user"/>
                  </el-row>

                  <el-row class="d-flex justify-content-between border-bottom">
                    <el-button round
                               class="border-0  bg-white pb-0"
                               :class="!$route.query.type?['text-dark']:[]"
                               @click="$router.push(`profile?username=${user.username}`)">
                      <span class="ms-2 me-2 fw-bold fs-6">帖子</span>
                      <div class="progress mt-2 bg-white " style="height: 4px">
                        <div v-show="!$route.query.type" class="progress-bar bg-primary" role="progressbar"
                             style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </el-button>
                    <el-button round class="border-0 bg-white pb-0"
                               :class="$route.query.type===chirperSearchEnums.REPLY?['text-dark']:[]"
                               @click="$router.push(`profile?username=${user.username}&type=${chirperSearchEnums.REPLY}`)">
                      <span class="ms-2 me-2 fw-bold fs-6  mb-2">回复</span>
                      <div class="progress mt-2 bg-white" style="height: 4px">
                        <div v-show="$route.query.type===chirperSearchEnums.REPLY" class="progress-bar bg-primary"
                             role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0"
                             aria-valuemax="100"></div>
                      </div>
                    </el-button>
                    <el-button round class="border-0 bg-white pb-0"
                               :class="$route.query.type===chirperSearchEnums.MEDIA?['text-dark']:[]"
                               @click="$router.push(`profile?username=${user.username}&type=${chirperSearchEnums.MEDIA}`)">
                      <span class="ms-2 me-2 fw-bold fs-6  mb-2">媒体</span>
                      <div class="progress mt-2 bg-white" style="height: 4px">
                        <div v-show="$route.query.type===chirperSearchEnums.MEDIA" class="progress-bar bg-primary"
                             role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0"
                             aria-valuemax="100"></div>
                      </div>
                    </el-button>
                    <el-button round class="border-0 bg-white pb-0"
                               :class="$route.query.type===chirperSearchEnums.LIKE?['text-dark']:[]"
                               @click="$router.push(`profile?username=${user.username}&type=${chirperSearchEnums.LIKE}`)">
                      <span class="ms-2 me-2 fw-bold fs-6  mb-2">喜欢</span>
                      <div class="progress mt-2 bg-white" style="height: 4px">
                        <div v-show="$route.query.type===chirperSearchEnums.LIKE" class="progress-bar bg-primary"
                             role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0"
                             aria-valuemax="100"></div>
                      </div>
                    </el-button>
                  </el-row>
                  <div v-for="key in Object.keys(chirpers)">
                    <el-row v-show="show(key)">
                      <el-row v-for="item in chirper" class="border-bottom">
                        <refer-card v-if="item.type===chirperTypeEnums.FORWARD||item.type===chirperTypeEnums.QUOTE"
                                    :barVisible="item.type!==chirperTypeEnums.FORWARD"
                                    :value="item" style="margin-top: 8px;"/>
                        <chirper-card
                            v-else :chirper="item"
                            style="margin-top: 8px;"/>
                      </el-row>
                    </el-row>
                  </div>
                </div>

              </div>
            </el-main>
          </el-container>

        </div>
        <div class="col-5">
          <el-row class="h-100 w-100">
            <el-col v-if="getToken()!=null&&getToken().length>0" :span="20">
              <input-card/>
              <trend-card style="margin-top: 8%;background-color:#EBEEF5;border-radius: 10px"/>
            </el-col>
            <el-col v-if="getToken()==null||!getToken().length>0" :span="20"
                    class=" d-flex justify-content-center h-100 w-100">
              <div class="align-self-center  w-75">
                <login-card/>
              </div>
            </el-col>

          </el-row>

        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import ProfileCard from "@/views/profile/ProfileCard.vue";
import {getDetailProfile} from "@/api/user";
import {getToken} from "@/util/auth";
import {getChirperPage, getLikeByUser} from "@/api/chirper";
import ChirperCard from "@/views/chirper/ChirperCard.vue";
import InputCard from "@/views/search/InputCard.vue";
import LoginCard from "@/views/sign/LoginCard.vue";
import TrendListCard from "@/views/explore/TrendListCard.vue";
import ReferCard from "@/views/chirper/ReferCard.vue";
import {mapState} from "vuex";
import {chirperSearchEnums, chirperTypeEnums} from "@/enums/enums";

export default {
  name: "Profile",
  computed: {
    chirperTypeEnums() {
      return chirperTypeEnums
    },
    chirperSearchEnums() {
      return chirperSearchEnums
    },
    chirper() {
      let type = this.$route.query.type;
      if (!type) {
        return this.chirpers.all.chirper
      } else {
        return this.chirpers[type].chirper;
      }
    },
    ...mapState({
      currentUser:state => state.user
    })
  },
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
      /*      this.user={};
            this.activeName='all';
            this.isLoading=false;
            this.chirper=[];
            this.page=1;
            this.isBottom=false;*/
      let username = this.$route.query.username;
      getDetailProfile(username).then((res) => {
        this.user = res.data.record;
        this.getPage();
      }).catch(e => {
        console.log(e);
      })
    },
    getPage() {
      let type = this.$route.query.type;
      let options;
      if (type === chirperSearchEnums.MEDIA) {
        options = {
          'userId': this.user.id
        };
        options[type] = true;
      } else {
        options = {
          'userId': this.user.id,
          type
        };
      }
      if (!type && !this.chirpers.all.isBottom) {
        this.isLoading = true;
        getChirperPage(this.chirpers.all.page, options).then(res => {
          this.isLoading = false;
          if (res.code === 200) {
            this.chirpers.all.isBottom = res.data.record.length <= 0;
            if (!this.chirpers.all.isBottom) {
              this.chirpers.all.chirper.push(...res.data.record);
              this.chirpers.all.page++;
            }
          }
        })
      } else if (type === chirperSearchEnums.REPLY && !this.chirpers.reply.isBottom) {
        this.isLoading = true;
        getChirperPage(this.chirpers.reply.page, options).then(res => {
          this.isLoading = false;
          if (res.code === 200) {
            this.chirpers.reply.isBottom = res.data.record.length <= 0;
            if (!this.chirpers.reply.isBottom) {
              this.chirpers.reply.chirper.push(...res.data.record);
              this.chirpers.reply.page++;
            }
          }
        })
      } else if (type === chirperSearchEnums.MEDIA && !this.chirpers.media.isBottom) {
        this.isLoading = true;
        getChirperPage(this.chirpers.media.page, options).then(res => {
          this.isLoading = false;
          if (res.code === 200) {
            this.chirpers.media.isBottom = res.data.record.length <= 0;
            if (!this.chirpers.media.isBottom) {
              this.chirpers.media.chirper.push(...res.data.record);
              this.chirpers.media.page++;
            }
          }
        })
      } else if (type === chirperSearchEnums.LIKE && !this.chirpers.like.isBottom) {
        this.isLoading = true;
        getLikeByUser(this.chirpers.like.page, this.user.id).then(res => {
          this.isLoading = false;
          if (res.code === 200) {
            this.chirpers.like.isBottom = res.data.record.length <= 0;
            if (!this.chirpers.like.isBottom) {
              this.chirpers.like.page++;
              this.chirpers.like.chirper.push(...res.data.record);
            }
          }
        })
      }

      /*    if (this.activeName === 'all' && !this.chirpers.all.isBottom) {
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
            })*/
    },
    loadMoreChirper() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight + 10 >= scrollHeight && !this.isLoading) {
        this.getPage();
      }
    },
    show(path) {
      let type = this.$route.query.type;
      if (!type && path === 'all') {
        return true;
      }
      return path === type;
    }
  },
  watch: {
    $route() {
      this.init();
    },
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

::v-deep .el-tabs__item {
  color: #8d8f94;
}

::v-deep .el-tabs__item.is-active {
  color: #303133;
}

::v-deep .el-tabs__active-bar {
  background-color: transparent !important;
  background-image: radial-gradient(
      circle at 0% 50%,
      transparent 0, transparent 30%,
      #409EFF 0, #409EFF 70%,
      transparent 0, transparent
  );
}

.back-bar {
  text-align: left;
  font-size: 24px;
  font-weight: bold;
  background-color: #FFFFFF;
}

.overflow-y-auto ::-webkit-scrollbar {
  display: none;
}
</style>
