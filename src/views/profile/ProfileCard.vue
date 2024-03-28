<template>
  <el-row>
    <el-row style="width: 100%; height: 200px">
      <el-image
          v-if="user.profileBackUrl"
          :src="user.profileBackUrl"
          fit="cover"
          style="width: 100%; height:100%">
        <div slot="error" class="image-slot">
          &nbsp;
        </div>
      </el-image>
    </el-row>
    <el-row>
      <el-col :span="6">
        <div class="avatar-container">
          <el-image
              v-if="user.largeAvatarUrl"
              :preview-src-list="[user.largeAvatarUrl]"
              :src="user.largeAvatarUrl"
              class="profile-avatar"
              fit="cover">
            <div slot="error" class="image-slot">
              &nbsp;
            </div>
          </el-image>
          <div class="overlay"></div>
        </div>
        &nbsp;
      </el-col>
      <el-col :span="18" style="text-align: right;">
        <el-row v-if="getToken()!=null" style="margin-right: 16px;margin-top: 4px;">
          <el-button v-if="isSelf" class="border-1 fw-bold text-dark" round
                     size="medium" @click="editDialog=true">编辑个人资料
          </el-button>
          <el-row v-if="!isSelf">
            <el-popover
                :visible-arrow="false"
                placement="bottom"
                trigger="click"
                width="auto"
            >
              <div>
                <el-button v-if="user.relation!==relationEnums.BLOCK" class="d-flex text-dark fw-bold"
                           @click="doRelationChange(relationEnums.BLOCK)">
                  <i class="bi bi-ban"/> 屏蔽@{{ user.username }}
                </el-button>
                <el-button v-if="user.relation===relationEnums.BLOCK" class="d-flex text-dark fw-bold"
                           @click="doRelationChange">
                  <i class="bi bi-slash-circle"/> 取消屏蔽@{{ user.username }}
                </el-button>
              </div>
              <el-button slot="reference" circle class="ms-1 me-1" icon="el-icon-more"></el-button>
            </el-popover>

            <el-button v-if="getProfileViewable(user)" circle class="ms-1 me-1" icon="el-icon-message"
                       @click="toChat"></el-button>
            <el-button :class="followBtnClass" round @click="doFollow">{{ followBtnText }}</el-button>
          </el-row>
          <el-dialog
              :show-close="false"
              :visible.sync="editDialog"
              class="edit-dialog"
              width="40%">
            <el-row class="p-2" style="min-height: 70vh">
              <edit-card @doClose="editDialog=false" @doEditComplete="doEditComplete"/>
            </el-row>
          </el-dialog>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="mt-2" style="text-align: left;margin-left: 16px">
      <el-row class="fs-5 fw-bolder text-dark">
        {{ user.nickname }}
      </el-row>
      <el-row class="fs-7 text-secondary">
        @{{ user.username }}
      </el-row>
      <el-row class="fs-7 mt-1">
        {{ user.description }}
      </el-row>
      <el-row class="text-secondary mt-3 fs-7">
        <span v-if="user.birthday" class="me-1">
          <i class="bi bi-cake2"/>
          <span>&nbsp;{{ new Date(user.birthday).toLocaleDateString() }}&nbsp;出生</span>
        </span>
        <span>
          <i class="el-icon-date"/>
        <span>&nbsp;{{ new Date(user.createTime).toLocaleDateString() }}&nbsp;加入</span>
        </span>

      </el-row>
      <el-row class="mt-3">
        <el-link style="color:#000;" type="info" @click.native="followingDialog=true">{{ getCount(user.followingNum) }}
          <span style="color:#606266;"> 正在关注</span></el-link>
        <el-dialog
            :show-close="false"
            :visible.sync="followingDialog"
            width="40%">
          <div class="p-2">
            <h4>Ta的关注</h4>
            <follower-card :id="user.id" type="following"
                           @follow="follow"
                           @unfollow="unfollow"
                           @user-change="userChange"
            />
          </div>
        </el-dialog>
        <el-link style="margin-left: 20px;color:#000;" type="info" @click.native="followerDialog=true">
          {{ getCount(user.followNum) }}
          <span style="color:#606266;"> 关注者</span></el-link>
        <el-dialog
            :show-close="false"
            :visible.sync="followerDialog"
            width="40%">
          <div class="p-2">
            <h4>Ta的关注者</h4>
            <follower-card :id="user.id"
                           type="follower"
                           @follow="follow"
                           @unfollow="unfollow" @user-change="userChange"/>
          </div>
        </el-dialog>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import {getCount} from "@/util/tools";
import {block, follow, unBlock, unFollow} from "@/api/user";
import ProfileEditCard from "@/views/profile/ProfileEditCard.vue";
import FollowerCard from "@/views/profile/FollowerCard.vue";
import SendCard from "@/views/message/SendCard.vue";
import {getToken} from "@/util/auth";
import {mapState} from "vuex";
import {chatMutations, userMutations} from "@/config/vuex/mutation-types";
import {relationEnums} from "@/enums/enums";
import {getFollowable, getProfileViewable} from "@/util/userUtil";
import {getChatable} from "@/util/chatUtil";

export default {
  name: "ProfileCard",
  components: {
    'edit-card': ProfileEditCard,
    FollowerCard,
    SendCard
  },

  props: {
    value: {},
    isSelf: false
  },
  data() {
    return {
      user: {},
      followBtnText: '关注',
      followBtnClass: ['unfollowed'],
      editDialog: false,
      followerDialog: false,
      followingDialog: false
    }
  },
  computed: {
    relationEnums() {
      return relationEnums;
    },
    ...mapState({
      currentUser: state => state.user,
      chat: state => state.chat
    })
  },
  methods: {
    getProfileViewable,
    getChatable,
    getToken,
    getCount,
    userChange() {
      this.followerDialog = false;
      this.followingDialog = false;
    },
    /**
     * 子组件follow事件
     */
    follow() {
      this.user.followingNum++;
    },
    /**
     * 子组件unfollow事件
     */
    unfollow() {
      this.user.followingNum--;
    },
    doRelationChange(type) {
      switch (type) {
        case relationEnums.FOLLOW: {
          if (getFollowable(this.user)) {
            this.user.followNum++;
            this.user.relation = relationEnums.FOLLOW;
            this.changeFollowBtnText(relationEnums.FOLLOW);
            follow(this.user.id);
          }
        }
          break;
        case relationEnums.UNFOLLOW: {
          if (this.user.relation !== relationEnums.UNFOLLOW) {
            this.user.followNum--;
            this.user.relation = relationEnums.UNFOLLOW;
            this.changeFollowBtnText(relationEnums.UNFOLLOW);
            unFollow(this.user.id);
          }
        }
          break;
        case relationEnums.BLOCK: {
          this.$confirm(`他们将无法关注你或查看你的帖子，而你也将无法看到@${this.user.username}的帖子或通知`, `屏蔽@${this.user.username}`, {
            confirmButtonText: '屏蔽',
            cancelButtonText: '取消',
            type: 'error',
            iconClass: 'bi bi-exclamation-circle-fill text-danger',
            showClose: false,
            customClass: 'w-25 rounded text-left text-dark fw-bold',
            confirmButtonClass: 'btn text-white bg-danger border-0 row w-100 m-2 rounded-pill',
            cancelButtonClass: 'btn btn-outline-dark w-100 row m-2 rounded-pill'
          }).then(() => {
            if (this.user.relation !== relationEnums.BLOCK) {
              this.user.relation = relationEnums.BLOCK;
              this.changeFollowBtnText(relationEnums.BLOCK);
              if (this.user.relation === relationEnums.FOLLOW) {
                this.user.followNum--;
              }
              block(this.user.id);
            }
          }).catch(() => {

          });

        }
          break;
        default: {
          if (this.user.relation === relationEnums.BLOCK) {
            this.user.relation = relationEnums.UNFOLLOW;
            this.changeFollowBtnText();
            unBlock(this.user.id);
          }
        }
      }
      this.$store.commit(`user/${userMutations.SET_USER_TO_LIST}`, {user: this.user});
    },
    doFollow() {
      let type = this.user.relation;
      if (type === relationEnums.FOLLOW) {
        this.doRelationChange(relationEnums.UNFOLLOW);
      } else if (type === relationEnums.UNFOLLOW) {
        this.doRelationChange(relationEnums.FOLLOW);
      } else if (type === relationEnums.BLOCK) {
        this.doRelationChange();
      }
    },

    doEditComplete() {
      this.editDialog = false;
      this.user = this.user.id === this.currentUser.id ? this.currentUser : this.user;
    },
    changeFollowBtnText(type) {
      if (type === relationEnums.FOLLOW) {
        this.followBtnText = "正在关注";
        this.followBtnClass = ['bg-white', 'text-dark', 'fw-bold'];
      } else if (type === relationEnums.UNFOLLOW) {
        this.followBtnText = "关注";
        this.followBtnClass = ['bg-dark', 'text-white', 'fw-bold'];
      } else if (type === relationEnums.BLOCK) {
        this.followBtnText = "已屏蔽";
        this.followBtnClass = ['bg-danger', 'text-white', 'fw-bold'];
      } else {
        this.followBtnText = "关注";
        this.followBtnClass = ['bg-dark', 'text-white', 'fw-bold'];
      }
    },
    toChat() {
      let user = this.currentUser;
      let conversation = `${Math.min(this.user.id, user.id)}_${Math.max(this.user.id, user.id)}`;
      if (!this.chat.record[conversation]) {
        this.$store.commit(`chat/${chatMutations.INIT_CONVERSATION}`, {conversation});
      }
      this.$router.push('/message/chat/' + conversation);
    },

  },
  created() {
    this.user = this.value;
    this.changeFollowBtnText(this.user.relation);
  },
  mounted() {
  },
  watch: {
    value(val) {
      this.user = val;
      this.changeFollowBtnText(this.user.relation);
    }
  }
}
</script>

<style scoped>

.unfollowed {
  background-color: black;
  color: #FFFFFF;
  font-weight: bolder;
}

.unfollowed:hover {
  color: #FFFFFF;
  background-color: #212121;
}


.followed {
  font-weight: bolder;
  background-color: white;
}

.followed:hover {
  color: #ef5350;
  background-color: #ffccc7;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 100%;
}

.avatar-container {
  width: 120px;
  height: 120px;
  border: 4px solid #FFFFFF;
  background-color: #FFFFFF;
  border-radius: 100%;
  align-items: center;
  position: absolute;
  margin-top: -10%;
  left: 16px;
  z-index: 4;
  text-align: center;
}

.overlay {
  position: absolute;
  top: -2px;
  left: 0;
  width: 100%;
  height: 0;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 5;
}

.avatar-container:hover .overlay {
  height: 100%;
}


</style>
<style>

</style>
