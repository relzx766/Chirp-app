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
          <el-button v-if="isSelf" round size="medium"
                     class="border-1 fw-bold text-dark" @click="editDialog=true">编辑个人资料
          </el-button>
          <el-row v-if="!isSelf">
            <el-popover
                placement="bottom"
                width="auto"
                :visible-arrow="false"
                trigger="click"
            >
              <div>
                <el-button class="d-flex text-dark fw-bold">
                  <i class="bi bi-ban"/> 屏蔽@{{user.username}}</el-button>
              </div>
              <el-button slot="reference"   circle icon="el-icon-more" ></el-button>
            </el-popover>

            <el-button   circle icon="el-icon-message" @click="toChat" class="ms-2 me-1"></el-button>
            <el-button :class="followBtnClass" round @click="doFollow">{{ followBtnText }}</el-button>
          </el-row>
          <el-dialog
              :show-close="false"
              :visible.sync="editDialog"
              class="edit-dialog"
              width="40%">
            <el-row class="p-2" style="min-height: 70vh">
              <edit-card @doEditComplete="doEditComplete"  @doClose="editDialog=false"/>
            </el-row>
          </el-dialog>
        </el-row>
      </el-col>
    </el-row>
    <el-row style="text-align: left;margin-left: 16px">
      <el-row class="fs-5 fw-bolder text-dark">
        {{ user.nickname }}
      </el-row>
      <el-row class="fs-7 text-secondary">
        @{{ user.username }}
      </el-row>
      <el-row class="fs-7 mt-1">
        {{ user.description }}
      </el-row>
      <el-row class="text-secondary mt-3">
        <i class="el-icon-date"/>
        <span>&nbsp;{{ new Date(user.createTime).toLocaleDateString() }}&nbsp;加入</span>
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
                           @follow="follow"
                           @unfollow="unfollow"
                           @user-change="userChange" type="follower"/>
          </div>
        </el-dialog>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import {getCount} from "@/util/tools";
import {follow, unFollow} from "@/api/user";
import ProfileEditCard from "@/views/profile/ProfileEditCard.vue";
import FollowerCard from "@/views/profile/FollowerCard.vue";
import SendCard from "@/views/message/SendCard.vue";
import {getToken} from "@/util/auth";

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
      followBtnClass: 'unfollowed',
      editDialog: false,
      followerDialog: false,
      followingDialog: false
    }
  },
  methods: {
    getToken,
    getCount,
    userChange(){
      this.followerDialog=false;
      this.followingDialog=false;
    },
    /**
     * 子组件follow事件
     */
    follow(){
      this.user.followingNum++;
    },
    /**
     * 子组件unfollow事件
     */
    unfollow(){
      this.user.followingNum--;
    },
    doFollow() {
      let type = this.user.relation;
      if (type === 1) {
        unFollow(this.user.id).then(() => {
          this.user.followNum--;
          this.user.relation = 2;
          this.changeFollowBtnText(2);
        })
      } else if (type === 2) {
        follow(this.user.id).then(() => {
          this.user.followNum++;
          this.user.relation = 1;
          this.changeFollowBtnText(1);
        })
      }
    },
    doEditComplete(){
      this.editDialog=false;
      this.user=this.user.id===this.$store.getters.getUser.id?this.$store.getters.getUser:this.user;
      console.log(this.user)
    },
    changeFollowBtnText(type) {
      if (type === 1) {
        this.followBtnText = "正在关注";
        this.followBtnClass = "followed";
      }
      if (type === 2) {
        this.followBtnText = "关注";
        this.followBtnClass = "unfollowed";
      }
    },
    toChat(){
      let user=this.$store.getters.getUser;
      let conversation=`${Math.min(this.user.id,user.id)}_${Math.max(this.user.id,user.id)}`;
      this.$store.commit('setConvOption',{
        conversation:conversation,
        user:this.user
      });
      this.$router.push('/message?conversation='+conversation);
    }
  },
  created() {
    this.user = this.value;
    this.changeFollowBtnText(this.user.relation);
  },
  watch: {
    value(val) {
      this.user = val
      this.changeFollowBtnText(this.user.relation)
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
