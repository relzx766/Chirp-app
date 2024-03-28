<template>
  <div class="container h-100">
    <div class="row h-100">
      <div class="col h-100 border-start border-end p-0">
        <div v-if="init===initStatusEnums.SUCCESS">
          <div class="d-flex flex-nowrap align-items-center justify-content-between">
            <div class="col-1 text-start">
              <el-button circle
                         class="fs-5 fw-bold text-dark border-0 p-2"
                         icon="el-icon-back"
                         @click="$router.back()"></el-button>
            </div>
            <div class="text-dark fw-bold fs-5 text-start flex-grow-1">{{ community.name }}的申请请求</div>
            <div>
              <el-popover :visible-arrow="false" trigger="click" width="auto">
                <div>
                  <div>
                    <el-button :type="order===orderEnums.ASC?'primary':'default'"
                               class="border border-0 fw-bold "
                               @click="changeOrder(orderEnums.ASC)">顺序
                    </el-button>
                  </div>
                  <div>
                    <el-button :type="order===orderEnums.DESC?'primary':'default'"
                               class="border border-0 fw-bold "
                               @click="changeOrder(orderEnums.DESC)">逆序
                    </el-button>
                  </div>
                </div>
                <el-button slot="reference" circle class="p-2 fs-5 fw-bold text-dark border-0"><i
                    class="bi bi-three-dots"/>
                </el-button>
              </el-popover>
            </div>
          </div>
          <div
              class=" d-flex flex-nowrap align-self-center justify-content-around option-item fw-bold text-dark border-bottom">
            <div v-for="item in switchOptions"
                 class="flex-grow-1 pt-3 pb-3 fs-7 text-center position-relative"
                 @click="to(item)">
              <div>{{ item }}</div>
              <div v-if="switchType===item"
                   class="w-20 position-absolute bottom-0 start-50 translate-middle-x switch-btn-bottom bg-primary rounded-pill">
              </div>
            </div>

          </div>
          <div>
            <div v-for="(item,index) in apply[switchType].applies" class="border-bottom p-3">
              <apply-item :description="`申请加入${community.name}`" :disable="currentUserRole<community.joinRange"
                          :status="item.status"
                          :user="userList[item.userId]"
                          @accept="approve(index,approveStatusEnum.ACCEPT)"
                          @reject="approve(index,approveStatusEnum.REJECT)"/>
            </div>
          </div>
          <infinite-loading
              ref="infApply"
              direction="bottom"
              @infinite="loadMore">
          </infinite-loading>
        </div>
        <div v-else-if="init===initStatusEnums.WAITING"
             class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div v-else-if="init===initStatusEnums.FAILED">
          加载失败
        </div>
      </div>

      <div class="col">
        <div v-if="getToken()!=null&&getToken().length>0">
          <input-card class="mt-2"/>
          <div class="border p-3 text-start rounded-4 mt-4">
            <div class="text-dark fw-bold fs-5">{{ community.name }}规则</div>
            <div>
              <div v-for="(rule,index) in community.rules" class="row mt-4 mb-4">
                <div class="text-dark fw-bold col-1 "><span
                    class="rounded-circle bg-light badge text-dark fw-bold fs-6 ">{{ index + 1 }}</span></div>
                <div class="col d-flex flex-column">
                  <span class="text-dark fs-7 fw-bold lh-1">{{ rule.name }}</span>
                  <span class="text-secondary fs-7 lh-1">{{ rule.description }}</span>
                </div>
              </div>
            </div>
          </div>
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
import {approve, getApply, getCommunityDetail, getMemberOfCommunity} from "@/api/community";
import InfiniteLoading from "vue-infinite-loading";
import {approveStatusEnums, communityMemberEnums, initStatusEnums, orderEnums} from "@/enums/enums";
import LoginCard from "@/views/sign/LoginCard.vue";
import TrendList from "@/views/explore/TrendListCard.vue";
import InputCard from "@/views/search/InputCard.vue";
import {getToken} from "@/util/auth";
import {userActions} from "@/config/vuex/action-types";
import {mapState} from "vuex";
import ApplyItem from "@/component/ApplyItem.vue";

export default {
  name: "ApplyCard",
  components: {ApplyItem, InputCard, TrendList, LoginCard, InfiniteLoading},
  computed: {
    orderEnums() {
      return orderEnums
    },
    approveStatusEnum() {
      return approveStatusEnums
    },
    initStatusEnums() {
      return initStatusEnums
    },
    communityId() {
      return this.$route.params.id;
    },
    ...mapState({
      userList: state => state.user.userList,
      user: state => state.user
    }),
    switchType() {
      return this.$route.query.type ? this.$route.query.type : this.switchOptions.All;
    }
  },
  data() {
    return {
      switchOptions: {
        All: 'All',
        Pending: 'Pending',
      },
      apply: {
        All: {
          applies: [],
          loading: false,
          finished: false,
          page: 1
        },
        Pending: {
          applies: [],
          loading: false,
          finished: false,
          page: 1
        }
      },
      init: initStatusEnums.WAITING,
      community: {},
      order: orderEnums.DESC,
      currentUserRole: '',
    }
  },
  methods: {
    getToken,
    loadApply() {
      const page = this.apply[this.switchType].page;
      const applies = this.apply[this.switchType].applies;
      const status = this.switchType === this.switchOptions.All ? [] : [approveStatusEnums.PENDING.value];
      return getApply({communityId: this.communityId, page, status, order: this.order}).then(res => {
        if (res.code === 200) {
          const record = res.data.record;
          applies.push(...record);
          const userIds = record.map(item => item.userId);
          this.$store.dispatch(`user/${userActions.FETCH_USER_NOT_EXISTS}`, {userIds});
          this.apply[this.switchType].finished = record.length <= 0;
          this.apply[this.switchType].page++;
        } else {
          throw new Error(res.message);
        }
      })
    },
    loadCommunity() {
      getCommunityDetail(this.communityId).then(async res => {
        if (res.code === 200) {
          this.community = res.data.record;
          if (this.user.id == this.community.userId) {
            this.currentUserRole = communityMemberEnums.ADMIN.value;
          } else {
            const r = await getMemberOfCommunity(this.communityId);
            console.log(r)
            if (r.code === 200) {
              const record = r.data.record;
              console.log(r)
              if (record) {
                this.currentUserRole = record.role;
              }
            } else {
              throw new Error(r.message);
            }
          }
        } else {
          throw new Error(res.message);
        }
      }).then(_ => {
        this.init = initStatusEnums.SUCCESS;
      }).catch(e => {
        this.$message.error(e);
        this.init = initStatusEnums.FAILED;
      })
    },
    async loadMore($state) {
      const loading = this.apply[this.switchType].loading;
      const finished = this.apply[this.switchType].finished;
      if (!loading && !finished) {
        this.apply[this.switchType].loading = true;
        try {
          await this.loadApply();
          if (this.apply[this.switchType].finished) {
            $state && $state.complete();
          } else {
            $state && $state.loaded();
          }
        } catch (e) {
          $state && $state.error();
          console.log(e);
          this.$message.error(e);
        } finally {
          this.apply[this.switchType].loading = false;
        }
      }
    },
    approve(index, type = approveStatusEnums.ACCEPT) {
      const id = this.apply[this.switchType].applies[index].id;
      approve({id, status: type.value}).then(res => {
        if (res.code === 200) {
          this.apply[this.switchType].applies[index].status = type.value;
        }
      })
    },
    to(type) {
      this.$router.push(`/community/apply/${this.communityId}?type=${type}`);
    },
    changeOrder(order) {
      this.order = order;
      this.apply = {
        All: {
          applies: [],
          loading: false,
          finished: false,
          page: 1
        },
        Pending: {
          applies: [],
          loading: false,
          finished: false,
          page: 1
        }
      };
      this.$refs.infApply.$emit('$InfiniteLoading:reset');
    }

  },
  watch: {
    switchType() {
      if (this.apply[this.switchType].applies.length === 0) {
        this.loadMore();
      }
    }
  },
  created() {
    this.loadCommunity();
  }
}
</script>
<style scoped>

</style>