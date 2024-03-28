<template>
  <el-container>
    <el-main>
      <div class="row">
        <div class="col border-start border-end">
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
                  <div v-if="getProfileViewable(user)">
                    <div
                        class="user-select-none finger d-flex flex-nowrap align-self-center justify-content-around option-item fw-bold text-dark border-bottom">
                      <div v-for="item in switchOptions"
                           class="flex-grow-1 pt-3 pb-3 fs-7 text-center position-relative"
                           @click="switchTo(item)">
                        <div>{{ item }}</div>
                        <div v-if="switchType===item"
                             class="w-30 position-absolute bottom-0 start-50 translate-middle-x switch-btn-bottom bg-primary rounded-pill">
                        </div>
                      </div>

                    </div>
                    <div>
                      <div v-for="item in records[switchType].record">
                        <refer-card v-if="item.type===chirperTypeEnums.FORWARD||item.type===chirperTypeEnums.QUOTE"
                                    :barVisible="item.type!==chirperTypeEnums.FORWARD"
                                    :value="item" style="margin-top: 8px;"/>
                        <chirper-card
                            v-else :chirper="item"
                            style="margin-top: 8px;"/>
                      </div>
                    </div>
                    <!--                    <el-row class="d-flex justify-content-between border-bottom">
                                          <el-button :class="!$route.query.type?['text-dark']:[]"
                                                     class="border-0  bg-white pb-0"
                                                     round
                                                     @click="$router.push(`profile?username=${user.username}`)">
                                            <span class="ms-2 me-2 fw-bold fs-6">帖子</span>
                                            <div class="progress mt-2 bg-white " style="height: 4px">
                                              <div v-show="!$route.query.type" aria-valuemax="100" aria-valuemin="0"
                                                   aria-valuenow="100" class="progress-bar bg-primary" role="progressbar"
                                                   style="width: 100%"></div>
                                            </div>
                                          </el-button>
                                          <el-button :class="$route.query.type===chirperSearchEnums.REPLY?['text-dark']:[]"
                                                     class="border-0 bg-white pb-0"
                                                     round
                                                     @click="$router.push(`profile?username=${user.username}&type=${chirperSearchEnums.REPLY}`)">
                                            <span class="ms-2 me-2 fw-bold fs-6  mb-2">回复</span>
                                            <div class="progress mt-2 bg-white" style="height: 4px">
                                              <div v-show="$route.query.type===chirperSearchEnums.REPLY" aria-valuemax="100"
                                                   aria-valuemin="0" aria-valuenow="100" class="progress-bar bg-primary" role="progressbar"
                                                   style="width: 100%"></div>
                                            </div>
                                          </el-button>
                                          <el-button :class="$route.query.type===chirperSearchEnums.MEDIA?['text-dark']:[]"
                                                     class="border-0 bg-white pb-0"
                                                     round
                                                     @click="$router.push(`profile?username=${user.username}&type=${chirperSearchEnums.MEDIA}`)">
                                            <span class="ms-2 me-2 fw-bold fs-6  mb-2">媒体</span>
                                            <div class="progress mt-2 bg-white" style="height: 4px">
                                              <div v-show="$route.query.type===chirperSearchEnums.MEDIA" aria-valuemax="100"
                                                   aria-valuemin="0" aria-valuenow="100" class="progress-bar bg-primary" role="progressbar"
                                                   style="width: 100%"></div>
                                            </div>
                                          </el-button>
                                          <el-button :class="$route.query.type===chirperSearchEnums.LIKE?['text-dark']:[]"
                                                     class="border-0 bg-white pb-0"
                                                     round
                                                     @click="$router.push(`profile?username=${user.username}&type=${chirperSearchEnums.LIKE}`)">
                                            <span class="ms-2 me-2 fw-bold fs-6  mb-2">喜欢</span>
                                            <div class="progress mt-2 bg-white" style="height: 4px">
                                              <div v-show="$route.query.type===chirperSearchEnums.LIKE" aria-valuemax="100"
                                                   aria-valuemin="0" aria-valuenow="100" class="progress-bar bg-primary" role="progressbar"
                                                   style="width: 100%"></div>
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
                                        </div>-->
                  </div>
                  <div v-else-if="user.relation===relationEnums.BLOCK">
                    <div class="text-start fw-bold fs-3 text-dark mt-5 ms-5">@{{ user.username }}已被屏蔽</div>
                    <div class="text-start  text-secondary ms-5">如果你想查看他的帖子，需要先解除屏蔽</div>
                  </div>
                  <div v-else-if="user.relationReverse===relationEnums.BLOCK">
                    <div class="text-start fw-bold fs-3 text-dark mt-5 ms-5">@{{ user.username }}已屏蔽了你</div>
                  </div>
                </div>

              </div>
            </el-main>
          </el-container>

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
import ProfileCard from "@/views/profile/ProfileCard.vue";
import {getDetailProfile, getFollowCount} from "@/api/user";
import {getToken} from "@/util/auth";
import {getChirperPage, getLikeByUser} from "@/api/chirper";
import ChirperCard from "@/views/chirper/ChirperCard.vue";
import InputCard from "@/views/search/InputCard.vue";
import LoginCard from "@/views/sign/LoginCard.vue";
import TrendList from "@/views/explore/TrendListCard.vue";
import ReferCard from "@/views/chirper/ReferCard.vue";
import {mapState} from "vuex";
import {chirperSearchEnums, chirperTypeEnums, relationEnums} from "@/enums/enums";
import {userMutations} from "@/config/vuex/mutation-types";
import {getProfileViewable} from "@/util/userUtil";

export default {
  name: "Profile",
  computed: {
    relationEnums() {
      return relationEnums
    },
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
      currentUser: state => state.user,
      userList: state => state.user.userList
    }),
    switchType() {
      return this.$route.query.type ?
          this.$route.query.type : this.switchOptions.All;
    },
    username() {
      return this.$route.query.username;
    }
  },
  components: {
    TrendList,
    'refer-card': ReferCard,
    'profile-card': ProfileCard,
    'chirper-card': ChirperCard,
    'input-card': InputCard,
    'login-card': LoginCard,
  },
  data() {
    return {
      user: {},
      isLoading: false,
      switchOptions: {
        All: 'All',
        Reply: 'Reply',
        Media: 'Media',
        Like: 'Like'
      },
      records: {
        All: {
          record: [],
          page: 1,
          finished: false
        },
        Reply: {
          record: [],
          page: 1,
          finished: false
        },
        Media: {
          record: [],
          page: 1,
          finished: false
        },
        Like: {
          record: [],
          page: 1,
          finished: false
        }
      },

    }
  },
  methods: {
    getProfileViewable,
    getToken,
    init() {
      this.user = {};
      this.isLoading = false;
      this.records = {
        All: {
          record: [],
          page: 1,
          finished: false
        },
        Reply: {
          record: [],
          page: 1,
          finished: false
        },
        Media: {
          record: [],
          page: 1,
          finished: false
        },
        Like: {
          record: [],
          page: 1,
          finished: false
        }
      };
      let username = this.username;
      getDetailProfile(username).then((res) => {
        if (res.code === 200) {
          let user = res.data.record;
          this.user = user;
          this.$store.commit(`user/${userMutations.SET_USER_TO_LIST}`, {user: user});
          this.getPage();
          return user;
        } else {
          throw new Error(res.message);
        }
      }).then(user => {
        getFollowCount(user.id).then(r => {
          if (r.code === 200) {
            user.followNum = r.data.record.follower;
            user.followingNum = r.data.record.following;
            this.$set(this, 'user', user);
            this.$store.commit(`user/${userMutations.SET_USER_TO_LIST}`, {user});
          }
        })
      }).catch(e => {
        console.log(e);
      })
    },
    async getPage() {
      let user = this.user;
      if (getProfileViewable(user)) {
        const type = this.switchType;
        const record = this.records[type];
        if (!record.finished) {
          this.isLoading = true;
          let res;
          if (type !== this.switchOptions.Like) {
            res = await getChirperPage({
              page: record.page,
              userIds: [this.user.id], type: type, media: type === this.switchOptions.Media
            });
          } else {
            res = await getLikeByUser(record.page, this.user.id);
          }
          if (res.code === 200) {
            record.finished = res.data.record == null || res.data.record.length <= 0
            if (!record.finished) {
              record.record.push(...res.data.record);
              record.page++;
            }
          } else {
            record.finished = true;
          }
          this.isLoading = false;
        }
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
    show(path) {
      let type = this.$route.query.type;
      if (!type && path === 'all') {
        return true;
      }
      return path === type;
    },
    switchTo(type) {
      this.$router.push(`/profile?username=${this.username}&type=${type}`)
    }
  },
  watch: {
    $route(nval, oval) {
      if (nval.query.username !== oval.query.username) {
        this.init();
      }
      this.getPage();
    },
    '$store.state.user.counter': {
      handler() {
        this.user = this.userList[this.user.id];
        if (!getProfileViewable(this.user)) {
          this.records = {
            All: {
              record: [],
              page: 1,
              finished: false
            },
            Reply: {
              record: [],
              page: 1,
              finished: false
            },
            Media: {
              record: [],
              page: 1,
              finished: false
            },
            Like: {
              record: [],
              page: 1,
              finished: false
            }
          };
        }
      },
      deep: true
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
