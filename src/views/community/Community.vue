<template>
  <div v-if="init" class="container h-100">
    <div class="row h-100">
      <div class="col border-start border-end h-100">
        <div class="row d-flex align-items-center p-2">
          <div class="col-1 text-start p-0">
            <el-button circle
                       class=" fs-5 fw-bold text-dark border-0 p-2"
                       icon="el-icon-back"
                       @click="$router.back()"></el-button>

          </div>
          <div v-if="!showMore" class="col row d-flex align-items-center">
            <div class="col  text-start fs-5 fw-bold text-dark">
              社群
            </div>

            <div class="col text-end">
              <el-button circle class="border-0 fs-5 text-dark p-2  fw-bold"
                         @click="toMore"><i class="bi bi-search"></i>
              </el-button>

              <el-button circle class="border-0 fs-5 text-dark p-2  fw-bold"
                         @click="newCommunityDialog=true"><i class="bi bi-person-add"></i>
              </el-button>
              <el-dialog
                  :show-close="false"
                  :visible.sync="newCommunityDialog"
                  width="60%">
                <div class="p-3 text-start">
                  <new-community-card class="" @success="newCommunityDialog=false"/>
                </div>
              </el-dialog>
            </div>
          </div>
          <div v-else class="col row d-flex align-items-center">
            <el-input v-model="keyword"
                      class="p-2 mb-2 community-search-input"
                      placeholder="搜索社群"
                      prefix-icon="el-icon-search"
                      @keydown.enter.native="doSearch"/>
          </div>

        </div>
        <div class="text-start text-dark  fs-5 fw-bold mt-3 mb-2">发现社群</div>
        <div class="row  p-0 finger" @scroll="loadMore">
          <div v-for="item in communities"
               class="d-flex pt-2 pb-2  align-items-center hover-info"
               @click="$router.push(`/community/${item.id}`)">
            <el-image
                :src="item.cover"
                class="rounded-3"
                fit="cover"
                style="width: 90px; height: 90px"/>
            <div class="ms-2 h-100 d-flex flex-column   justify-content-between">
              <div>
                <div class="text-start text-dark fw-bold fs-6">{{ item.name }}</div>
                <div class="text-start text-dark  fs-7 "> {{ getCount(item.memberCount) }} <span class="text-secondary">Members</span>
                </div>
              </div>
              <div class="text-start">
                <el-avatar
                    v-if="userList[item.userId]"
                    :src="userList[item.userId].smallAvatarUrl"
                    fit="cover"
                    size="small"/>
                <el-avatar v-for="i in item.members.length>4?4:item.members.length" :src="userList[item.members[i-1].userId].smallAvatarUrl"
                           class="border border-1  border-white" fit="cover"
                           size="small"
                           style="margin-left: -10px"/>
              </div>
            </div>
          </div>
          <infinite-loading
              v-if="showMore"
              ref="infCommunity"
              direction="bottom"
              @infinite="loadMore">
          </infinite-loading>
          <div v-show="!showMore" class="text-start fs-7 text-primary pt-3 pb-3" @click="toMore">显示更多</div>
        </div>

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
  </div>

</template>
<script>
import {getCount} from "@/util/tools";
import {mapState} from "vuex";
import TrendList from "@/views/explore/TrendListCard.vue";
import InputCard from "@/views/search/InputCard.vue";
import {getToken} from "@/util/auth";
import LoginCard from "@/views/sign/LoginCard.vue";
import NewCommunityCard from "@/views/community/NewCommunityCard.vue";
import {getCommunityPage} from "@/api/community";
import {userActions} from "@/config/vuex/action-types";
import InfiniteLoading from "vue-infinite-loading";

export default {
  name: "Community",
  components: {NewCommunityCard, LoginCard, InputCard, TrendList, InfiniteLoading},

  computed: {
    ...mapState({
      user: state => state.user,
      userList: state => state.user.userList
    }),
    showMore() {
      return this.$route.query.showMore
    }
  },
  data() {
    return {
      keyword: '',
      communities: [],
      page: 1,
      loading: false,
      finished: false,
      newCommunityDialog: false,
      init: false
    }
  },
  methods: {
    getToken, getCount,
    toMore() {
      this.$router.push('/community?showMore=true');
    },
    doSearch() {
      this.page = 1;
      this.communities = [];
      this.loadCommunity();
    },
    loadCommunity() {
      this.loading = true;
      return getCommunityPage({keyword: this.keyword, page: this.page}).then(res => {
        if (res.code === 200) {
          const record = res.data.record;
          this.finished = record.length === 0;
          this.page++;
          this.communities.push(...record);
          const userIds = [];
          record.forEach(r => {
            userIds.push(r.userId);
            r.members.forEach(m => {
              userIds.push(m.userId);
            })
          });
          return this.$store.dispatch(`user/${userActions.FETCH_USER_NOT_EXISTS}`, {userIds});
        } else {
          throw new Error(res.message);
        }
      }).finally(_ => {
        this.init = true;
        this.loading = false;
      })
    },
    async loadMore($state) {
      if (!this.loading && !this.finished && this.showMore) {
        try {
          await this.loadCommunity();
          if (this.finished) {
            $state.complete();
          } else {
            $state.loaded();
          }
        } catch (e) {
          console.log(e);
          $state.error();
        }
      }
    },

  },
  created() {
    this.loadCommunity();
  }
}
</script>
<style scoped>
::v-deep .community-search-input .el-input__prefix {
  margin-left: 10px;
}

::v-deep .community-search-input .el-input__inner {
  border-radius: 23px;
}

.community-item :hover {
  background-color: #f4f4f4;
}
</style>