<template>
  <div class="container h-100">
    <div class="row h-100">
      <div class="col p-0 border-start border-end h-100">
        <div class="row d-flex align-items-center p-2">
          <div class="col-1 text-start">
            <el-button circle
                       class="fs-5 fw-bold text-dark border-0 p-2"
                       icon="el-icon-back"
                       @click="$router.back()"></el-button>
          </div>
          <div class="col text-start fw-bold fs-5">成员</div>
        </div>
        <div
            class=" d-flex flex-nowrap align-self-center justify-content-around option-item fw-bold text-dark border-bottom">
          <div v-for="item in switchOptions"
               class="flex-grow-1 pt-3 pb-3 fs-7 text-center position-relative"
               @click="switchTo(item)">
            <div>{{ item }}</div>
            <div v-if="switchType===item"
                 class="w-25 position-absolute bottom-0 start-50 translate-middle-x switch-btn-bottom bg-primary rounded-pill">
            </div>
          </div>

        </div>
        <div>
          <div v-for="(member,index) in records[switchType].record"
               class="p-3  hover-info ">
            <el-popover :visible-arrow="false" placement="bottom-start" trigger="click"
                        width="auto"
            >
              <div class="">
                <div v-if="currentRole===communityMemberEnums.ADMIN.value">
                  <el-button v-if="member.role===communityMemberEnums.MEMBER.value"
                             class="border border-0 fw-bold text-dark w-100 text-start"
                             @click="update(index,communityMemberEnums.MODERATOR.value)"
                  ><i class="bi bi-chevron-double-up"/> 提升为版主
                  </el-button>
                  <el-button v-else-if="member.role===communityMemberEnums.MODERATOR.value"
                             class="border border-0 fw-bold text-dark w-100 text-start"
                             @click="update(index,communityMemberEnums.MEMBER.value)"
                  ><i class="bi bi-chevron-double-down"/> 降低为成员
                  </el-button>
                </div>
                <div v-if="currentRole>=community.joinRange">
                  <el-button class="border border-0 fw-bold text-dark w-100 text-start"
                             @click="remove(index)"
                  ><i class="bi bi-person-dash"/> 移出{{ community.name }}
                  </el-button>
                </div>
                <div>
                </div>
              </div>
              <user-info-card
                  v-if="userList[member.userId]"
                  slot="reference"
                  :show-description="false"
                  :tag="communityMemberEnums.find(member.role).alias"
                  :user="userList[member.userId]"
                  class="finger"
              >
              </user-info-card>
            </el-popover>


          </div>
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
import LoginCard from "@/views/sign/LoginCard.vue";
import TrendList from "@/views/explore/TrendListCard.vue";
import InputCard from "@/views/search/InputCard.vue";
import {getToken} from "@/util/auth";
import {communityMemberEnums} from "@/enums/enums";
import {getCommunityDetail, getMember, getMemberOfCommunity, leaveCommunity, updateRole} from "@/api/community";
import {userActions} from "@/config/vuex/action-types";
import UserInfoCard from "@/component/UserInfoCard.vue";
import {mapState} from "vuex";

export default {
  name: "MemberCard",
  components: {UserInfoCard, InputCard, TrendList, LoginCard},
  computed: {
    communityMemberEnums() {
      return communityMemberEnums
    },
    switchOptions() {
      return {
        Member: 'Member',
        Moderator: 'Moderator'
      }
    },
    switchType() {
      return this.$route.query.type ? this.$route.query.type : this.switchOptions.Moderator;
    },
    communityId() {
      return this.$route.params.communityId;
    },
    ...mapState({
      userList: state => state.user.userList,
      user: state => state.user
    })
  },
  data() {
    return {
      records: {
        Member: {
          record: [],
          loading: false,
          finished: false,
          page: 1
        },
        Moderator: {
          record: [],
          loading: false,
          finished: false,
          page: 1
        }
      },
      community: {},
      currentRole: ''
    }
  },
  methods: {
    getToken,
    switchTo(type) {
      this.$router.push(`/community/member/${this.communityId}?type=${type}`);
    },
    loadUser() {
      const role = communityMemberEnums[this.switchType.toUpperCase()];
      const load = () => {
        switch (role) {
          case communityMemberEnums.MEMBER:
            return this.loadMember();
          case communityMemberEnums.MODERATOR:
            return this.loadModerator();
          default:
            return Promise.resolve([]);
        }
      }
      load().then(record => {
        if (record.length > 0) {
          const userIds = record.map(r => r.userId);
          return this.$store.dispatch(`user/${userActions.FETCH_USER_NOT_EXISTS}`, {userIds});
        }
      })
    },
    loadMember() {
      if (!this.records.Member.loading || !this.records.Member.finished) {
        this.records.Member.loading = true;
        return getMember({
          role: communityMemberEnums.MEMBER.value,
          page: this.records.Member.page,
          communityId: this.communityId
        }).then(res => {
          if (res.code === 200) {
            const record = res.data.record;
            this.records.Member.record.push(...record);
            this.records.Member.finished = record.length <= 0;
            return record;
          }
          return [];
        }).finally(_ => {
          this.records.Member.page++;
          this.records.Member.loading = false;
        })
      }
      return Promise.resolve([]);
    },
    loadModerator() {
      if (!this.records.Moderator.loading || !this.records.Moderator.finished) {
        this.records.Moderator.loading = true;
        return getMember({
          role: communityMemberEnums.MODERATOR.value,
          page: this.records.Moderator.page,
          communityId: this.communityId
        }).then(res => {
          if (res.code === 200) {
            const record = res.data.record;
            this.records.Moderator.record.push(...record);
            this.records.Moderator.finished = record.length <= 0;
            return record;
          }
          return [];
        }).finally(_ => {
          this.records.Moderator.page++;
          this.records.Moderator.loading = false;
        });

      }
      return Promise.resolve([]);
    },
    init() {
      getCommunityDetail(this.communityId).then(async res => {
        if (res.code === 200) {
          const userId = res.data.record.userId;
          this.community = res.data.record;
          this.records.Moderator.record.unshift({
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
          await this.$store.dispatch(`user/${userActions.FETCH_USER_NOT_EXISTS}`, {userIds: [userId]});
        }
      })
      this.loadUser();
    },
    async remove(index) {

      const item = this.records[this.switchType].record[index];
      if (this.currentRole >= this.community.joinRange) {
        const res = await leaveCommunity({communityId: this.communityId, userId: item.userId});
        if (res.code === 200) {
          this.$message.success("移除成功");
          this.records[this.switchType].record.splice(index, 1);
        } else {
          this.$message.error(res.message);
        }
      }
    },
    async update(index, role) {
      const item = this.records[this.switchType].record[index];
      if (this.currentRole === communityMemberEnums.ADMIN.value) {
        const res = await updateRole({communityId: this.communityId, userId: item.userId, role: role});
        if (res.code === 200) {
          this.$message.success("修改成功");
          this.records[this.switchType].record[index].role = role;
        } else {
          this.$message.error(res.message)
        }
      }
    }
  },
  watch: {
    switchType() {
      if (this.records[this.switchType].page === 1) {
        this.loadUser();
      }
    }
  },
  created() {
    this.init();
  }
}
</script>
<style scoped>
.option-item :hover {
  background-color: #f4f4f4;

}

.switch-btn-bottom {
  height: 4px;

}
</style>