<template>
  <div class="container h-100">
    <div v-if="!init" class="row h-100">
      <div class=" col border-start border-end h-100 p-0 h-100">
        <div class="row d-flex align-items-center p-2">
          <div class="col-1 text-start">
            <el-button circle
                       class="fs-5 fw-bold text-dark border-0 p-2"
                       icon="el-icon-back"
                       @click="$router.back()"></el-button>
          </div>
          <div class="col text-start fw-bold fs-5">{{ community.name }}</div>
          <div class="col-4 text-end">
            <el-button circle
                       class="fs-5 fw-bold text-dark border-0 p-2"
            ><i class="bi bi-search"></i></el-button>
            <el-button circle
                       class="fs-5 fw-bold text-dark border-0 p-2"><i class="bi bi-three-dots"/></el-button>
          </div>
        </div>
        <div class="row">
          <el-image :src="community.cover" class="community-cover" fit="cover"
          />
        </div>
        <div class="  bg-light p-3">
          <div class="row">
            <div class="text-start fs-4 fw-bold text-start text-dark">{{ community.name }}</div>
            <div class="text-start mt-2">
              <el-button v-for="tag in community.tags" class="border fs-7 ps-2 pe-2 pt-1 pb-1 fw-bold text-dark"
                         round>{{ tag }}
              </el-button>
            </div>
            <div class="text-start fs-7 text-dark pt-3 pb-3">{{ community.description }}</div>
          </div>
          <div class="d-flex align-items-center  justify-content-between">
            <div v-if="community.members" class="d-flex align-items-center">
              <el-avatar
                  v-if="userList[community.userId]"
                  :src="userList[community.userId].smallAvatarUrl"
                  fit="cover"
                  size="medium"/>
              <el-avatar
                  v-for="i in community.members.length>4?4:community.members.length"
                  v-if="userList[community.members[i-1].userId]"
                  :src="userList[community.members[i-1].userId].smallAvatarUrl"
                  fit="cover"
                  size="medium"
                  style="margin-left: -10px"/>
              <span class="p-1 text-dark fs-7 fw-bold">{{ getCount(community.memberCount) }}</span>
              <span class="fs-7 text-secondary p-1">Members</span></div>
            <div class="d-flex align-items-center">
              <el-button circle class="p-2 bg-light" @click="copy($route.path)">
                <i class="bi bi-upload fw-bold fs-7 text-dark"/></el-button>
              <el-button
                  v-if="community.joinStatus===approveStatusEnum.ACCEPT.value||community.userId==user.id"
                  circle class="p-2 bg-light" @click="postDialog=true">
                <i class="bi bi-plus fw-bold fs-7 text-dark"/></el-button>
              <el-button
                  v-if="community.userId==user.id"
                  class="p-2 bg-light" round @click="updateDialog=true">编辑
              </el-button>
              <el-button
                  v-if="currentRole>=community.joinRange"
                  class="p-2 bg-light" round @click="$router.push(`/community/apply/${communityId}`)">新的申请
              </el-button>
              <el-button v-if="community.userId!=user.id" class="p-2 ps-3 pe-3 fw-bold fs-7 text-dark bg-light"
                         round
                         @click="handlerJoinBtn(community.joinStatus)">
                <span v-if="communityJoinRangeEnums.ANYONE.value===community.joinRange">加入</span>
                <span v-else-if="community.joinStatus===approveStatusEnum.PENDING.value">已申请</span>
                <span v-else-if="community.joinStatus===approveStatusEnum.ACCEPT.value">离开</span>
                <span v-else>申请加入</span>
              </el-button>
              <el-dialog
                  :modal-append-to-body="true"
                  :show-close="false"
                  :visible.sync="postDialog"
                  width="30%"
              >
                <div class="container p-0 text-start">
                  <div v-if="community.rules.length>0" class="border-bottom p-3">
                    <div class="fs-6 fw-bold text-dark">你的推文必须遵循{{ community.name }}的规则</div>
                    <div v-for="(rule,index) in community.rules" class="row mt-4 mb-4">
                      <div class="text-dark fw-bold col-1 "><span
                          class="rounded-circle bg-light badge text-dark fw-bold fs-6 ">{{ index + 1 }}</span></div>
                      <div class="col d-flex flex-column">
                        <span :class="rule.description?['lh-1']:[]" class="text-dark fs-7 fw-bold ">{{
                            rule.name
                          }}</span>
                        <span class="text-secondary fs-7 lh-1">{{ rule.description }}</span>
                      </div>
                    </div>
                  </div>
                  <origin-card :community-id="communityId" class="p-3"
                               @sent="sentChirper"/>
                </div>
              </el-dialog>
              <el-dialog
                  :modal-append-to-body="true"
                  :show-close="false"
                  :visible.snyc="joinDialog"
                  width="30%"
              >
                <div class="container p-0 ">
                  <div class="d-flex justify-content-between text-start align-items-center border-bottom p-2">
                    <div class="fs-5">
                      <el-button circle class="border-0   p-2 text-dark fw-bold"
                                 @click="joinDialog=false"><i class="fs-5 bi bi-x"/></el-button>
                      <span class=" text-dark fw-bold">{{ community.name }}规则</span>
                    </div>
                    <div>
                      <el-button class="fw-bold" round size="small" type="primary" @click="applyJoin">同意并加入
                      </el-button>
                    </div>
                  </div>
                  <div class="text-start p-3">
                    <div class="fs-4 fw-bold text-dark">
                      查看并同意{{ community.name }}规则
                    </div>
                    <div class="fs-7 mt-2">这些规则由社群管理员制定和执行，是对
                      <el-link class="text-primary">Chirp的规则</el-link>
                      的补充。
                    </div>
                    <div v-for="(rule,index) in community.rules" class="row mt-4 mb-4">
                      <div class="text-dark fw-bold col-1 "><span
                          class="rounded-circle bg-light badge text-dark fw-bold fs-6 ">{{ index + 1 }}</span></div>
                      <div class="col d-flex flex-column">
                        <span :class="rule.description?['lh-1']:[]" class="text-dark fs-7 fw-bold ">{{
                            rule.name
                          }}</span>
                        <span class="text-secondary fs-7 lh-1">{{ rule.description }}</span>
                      </div>
                    </div>
                    <div v-if="community.rules.length===0">
                      <el-empty description="社群管理员暂未设定规则"></el-empty>
                    </div>

                  </div>

                </div>
              </el-dialog>
              <el-dialog
                  :modal-append-to-body="true"
                  :show-close="false"
                  :visible.sync="updateDialog"
                  width="60%">
                <div class="p-3 text-start">
                  <new-community-card :edit-community="community" class="" @success="update"/>
                </div>
              </el-dialog>
            </div>
          </div>
        </div>
        <div
            class=" d-flex flex-nowrap align-self-center justify-content-around option-item fw-bold text-dark border-bottom">
          <div v-for="item in switchOptions"
               class="flex-grow-1 pt-3 pb-3 fs-7 text-center position-relative user-select-none finger"
               @click="switchTo(item)">
            <div>{{ item }}</div>
            <div v-if="switchType===item"
                 class="w-30 position-absolute bottom-0 start-50 translate-middle-x switch-btn-bottom bg-primary rounded-pill">
            </div>
          </div>

        </div>
        <div>
          <div v-if="switchType===switchOptions.Info&&Object.keys(community).length>0" class="text-start ">
            <div class="border-bottom ps-3 pe-3 pt-1">
              <div class="text-dark fw-bold fs-5">信息</div>
              <div class="row d-flex align-items-center pb-2 pt-2">
                <div class="col-1  text-center ms-3">
                  <i class="bi bi-people-fill fw-bold fs-4 text-secondary"/></div>
                <div class="col-10 fs-7">{{ communityPostRangeEnums.find(community.postRange).alias }}</div>
              </div>
              <div class="row d-flex align-items-center pb-2 pt-2">
                <div class="col-1 text-center ms-3">
                  <i class="bi bi-shield-lock-fill fw-bold fs-4 text-secondary"/></div>
                <div class="col-10 fs-7">
                  <div class="text-dark fw-bold">所有的社群都是公开的</div>
                  <div class="text-secondary">{{ communityJoinRangeEnums.find(community.joinRange).alias }}</div>
                </div>
              </div>
              <div class="row d-flex align-items-center pb-2 pt-2">
                <div class="col-1 text-center ms-3">
                  <i class="bi bi-calendar-week fw-bold fs-4 text-secondary"/></div>
                <div class="col-10 fs-7">
                  <div class="text-secondary fw-bold">由<span
                      class="text-dark finger src-dark" @click="$router.push(`/profile?username=${userList[community.userId].username}`)">
                    @{{userList[community.userId].username }}</span>创建于{{ yearMonthDay(new Date(community.createTime)) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="border-bottom ps-3 pe-3 pt-1">
              <div class="text-dark fw-bold fs-5">规则</div>
              <div class="fs-7 mt-2">这些规则由社群管理员制定和执行，是对
                <el-link class="text-primary">Chirp的规则</el-link>
                的补充。
              </div>
              <div>
                <div v-for="(rule,index) in community.rules" class="row mt-4 mb-4">
                  <div class="text-dark fw-bold col-1 "><span
                      class="rounded-circle bg-light badge text-dark fw-bold fs-6 ">{{ index + 1 }}</span></div>
                  <div class="col d-flex flex-column">
                    <span :class="rule.description?['lh-1']:[]" class="text-dark fs-7 fw-bold ">{{ rule.name }}</span>
                    <span class="text-secondary fs-7 lh-1">{{ rule.description }}</span>
                  </div>
                </div>
                <div v-if="community.rules.length===0">
                  <el-empty description="社群管理员暂未设定规则"></el-empty>
                </div>
              </div>
            </div>
            <div class="border-bottom ">
              <div class="text-dark fw-bold fs-5 mb-4 ps-3 pe-3 pt-1">版主</div>
              <user-info-card v-for="item in moderator"
                              v-if="userList[item.userId]"
                              :tag="communityMemberEnums.find(item.role).alias"
                              :user="userList[item.userId]"
                              class="hover-info p-3">
              </user-info-card>

            </div>
            <div class="border-bottom">
              <div class="text-dark fw-bold fs-5 ps-3 pe-3 pt-1">成员</div>
              <user-info-card v-for="item in member.length>5 ? member.slice(0,5) : member"
                              v-if="userList[item.userId]"
                              :user="userList[item.userId]"
                              class="hover-info p-3"
              >
              </user-info-card>
              <div class="text-start fs-7 text-primary p-3 finger"
                   @click="$router.push(`/community/member/${community.id}`)">查看更多
              </div>
            </div>
          </div>
          <div
              v-else-if="switchType===switchOptions.Top||switchType===switchOptions.Latest||switchType===switchOptions.Media">
            <div class="text-start">
              <div v-if="chirper[switchType].loading"
                   class="p-2">
                <el-skeleton :rows="6" animated/>
              </div>

              <div v-else>
                <div>
                  <chirper-card v-for="item in chirper[switchType].record" :chirper="item">

                  </chirper-card>
                  <infinite-loading
                      :ref="`inf-${switchType}`"
                      direction="bottom"
                      @infinite="loadMoreChirper">
                  </infinite-loading>
                </div>
              </div>
            </div>
          </div>
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
import {getCommunityDetail, getMember, getMemberOfCommunity, joinCommunity, leaveCommunity} from "@/api/community";
import {
  approveStatusEnums,
  communityJoinRangeEnums,
  communityMemberEnums,
  communityPostRangeEnums,
  orderEnums
} from "@/enums/enums";
import {userActions} from "@/config/vuex/action-types";
import {mapState} from "vuex";
import {getCount} from "@/util/tools";
import {copy} from "@/util/clipboard";
import {yearMonthDay, yMdHm} from "@/util/formatter";
import InputCard from "@/views/search/InputCard.vue";
import TrendList from "@/views/explore/TrendListCard.vue";
import {getToken} from "@/util/auth";
import LoginCard from "@/views/sign/LoginCard.vue";
import UserInfoCard from "@/component/UserInfoCard.vue";
import bigInt from "big-integer";
import {getChirperPage} from "@/api/chirper";
import OriginCard from "@/views/edit/OriginCard.vue";
import ChirperCard from "@/views/chirper/ChirperCard.vue";
import InfiniteLoading from "vue-infinite-loading";
import NewCommunityCard from "@/views/community/NewCommunityCard.vue";

export default {
  name: "CommunityDetailCard",
  components: {
    NewCommunityCard,
    ChirperCard,
    OriginCard,
    UserInfoCard,
    LoginCard,
    TrendList,
    InputCard,
    InfiniteLoading,
  },
  computed: {
    approveStatusEnum() {
      return approveStatusEnums
    },
    communityMemberEnums() {
      return communityMemberEnums
    },
    communityPostRangeEnums() {
      return communityPostRangeEnums
    },
    communityJoinRangeEnums() {
      return communityJoinRangeEnums
    },
    communityId() {
      return this.$route.params.id;
    },
    ...mapState({
      userList: state => state.user.userList,
      user: state => state.user
    }),
    switchType() {
      return this.$route.query.type ? this.$route.query.type : this.switchOptions.Top
    }
  },
  data() {
    return {
      community: {},
      member: [],
      moderator: [],
      switchOptions: {
        Top: 'Top',
        Latest: 'Latest',
        Media: 'Media',
        Info: 'Info'
      },
      chirper: {
        Top: {
          record: [],
          page: 1,
          loading: false,
          finished: false
        },
        Latest: {
          record: [],
          page: 1,
          loading: false,
          finished: false
        },
        Media: {
          record: [],
          page: 1,
          loading: false,
          finished: false
        }
      },
      joinDialog: false,
      postDialog: false,
      updateDialog: false,
      init: true,
      currentRole: ''
    }
  },
  methods: {
    bigInt,
    getToken,
    yearMonthDay,
    yMdHm,
    copy,
    getCount,
    loadCommunity() {
      getCommunityDetail(this.communityId).then(async res => {
        if (res.code === 200) {
          this.community = res.data.record;
          this.moderator.unshift({
            userId: this.community.userId,
            communityId: this.community.id,
            role: communityMemberEnums.ADMIN.value
          });
          if (this.user.id == this.community.userId) {
            this.currentRole = communityMemberEnums.ADMIN.value;
          } else {
            const r = await getMemberOfCommunity(this.communityId);
            if (r.code === 200) {
              if (r.data.record) {
                this.currentRole = r.data.record.role;
              }
            }
          }
        } else {
          throw new Error(res.message);
        }
      }).then(_ => {
        const userIds = this.community.members.map(m => m.userId);
        userIds.push(this.community.userId);
        return this.$store.dispatch(`user/${userActions.FETCH_USER_NOT_EXISTS}`, {userIds});
      })
          .catch(e => {
            console.log(e)
            this.$message.error(e);
          }).finally(_ => {
        this.init = false;
      })
      ;
      this.loadMember(1);
      this.loadModerator();
    },
    loadMember(page) {
      getMember({role: communityMemberEnums.MEMBER.value, communityId: this.communityId, page}).then(res => {
        if (res.code === 200) {
          this.member.push(...res.data.record);
        } else {
          this.$message.error(res.message);
        }
      }).then(_ => {
        let userIds = this.member.map(m => m.userId);
        this.$store.dispatch(`user/${userActions.FETCH_USER_NOT_EXISTS}`, {userIds});
      })
    },
    loadModerator() {
      getMember({role: communityMemberEnums.MODERATOR.value, communityId: this.communityId}).then(res => {
        if (res.code === 200) {
          this.moderator.push(...res.data.record);
        } else {
          this.$message.error(res.message);
        }
      }).then(_ => {
        let userIds = this.moderator.map(m => m.userId);
        this.$store.dispatch(`user/${userActions.FETCH_USER_NOT_EXISTS}`, {userIds});
      })
    },
    switchTo(param) {
      this.$router.push(`/community/${this.communityId}?type=${param}`);
    },
    applyJoin() {
      this.joinDialog = false;
      this.community.joinStatus = approveStatusEnums.PENDING.value;
      return joinCommunity({id: this.communityId}).then(res => {
        if (res.code === 200) {
          this.community.joinStatus = res.data.record.joinStatus;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    loadChirper() {
      const media = this.switchType === this.switchOptions.Media;
      const order = this.switchType === this.switchOptions.Top ? orderEnums.HOT : orderEnums.DESC;
      const page = this.chirper[this.switchType].page;
      const record = this.chirper[this.switchType].record;
      const communityId = this.communityId;
      return getChirperPage({communityId, media, order, page}).then(res => {
        if (res.code === 200) {
          if (!res.data.record||res.data.record.length === 0) {
            this.chirper[this.switchType].finished = true;
          } else {
            record.push(...res.data.record);
            this.chirper[this.switchType].page += 1;
          }
        } else {
          throw new Error(res.message);
        }
      })
    },
    async loadMoreChirper($state) {
      try {
        const loading = this.chirper[this.switchType].loading;
        const finished = this.chirper[this.switchType].finished;
        if (!loading && !finished) {
          this.chirper[this.switchType].loading = true;
          await this.loadChirper();
        }
        if (this.chirper[this.switchType].finished) {
          $state.complete();
        } else {
          $state.loaded();
        }
      } catch (e) {
        console.log(e);
        this.$message.error(e);
        $state.error();
        this.chirper[this.switchType].finished=true;
      } finally {
        this.chirper[this.switchType].loading = false;
      }

    },
    sentChirper(chirper) {
      chirper.authorId=this.user.id;
      chirper.avatar=this.user.smallAvatarUrl;
      chirper.username=this.user.username;
      chirper.nickname=this.user.nickname;
      this.chirper.Latest.record.unshift(chirper);
    },
    update(c) {
      this.updateDialog = false
      this.community = c;
    },
    handlerJoinBtn(status) {
      if (status == null || status === approveStatusEnums.INVALID.value) {
        this.joinDialog = true;
      } else if (status === approveStatusEnums.ACCEPT.value) {
        leaveCommunity({communityId: this.community.id, userId: this.user.id}).then(res => {
          if (res.code === 200) {
            this.community.joinStatus = approveStatusEnums.INVALID.value;
          } else {
            this.$message.error(res.message);
          }
        })
      }
    }
  },
  watch: {
    switchType() {
      if (this.switchType !== this.switchOptions.Info) {
        const record = this.chirper[this.switchType].record;
        if (record.length === 0) {
          this.loadChirper();
        }
      }
    },
  },
  created() {
    this.loadCommunity();
  },
  updated() {

  }
}
</script>
<style scoped>
.community-cover {
  width: 100%;
  height: 240px;
}


</style>