<template>
  <div>
    <el-row v-if="isLoading" style="text-align: center">
      <div class="loading-box">
        <div class="loading"/>
      </div>
    </el-row>
    <el-card v-for="(item,index) in users" shadow="hover" style="border: none;border-radius: 12px;margin-bottom: 4px"
             @click.native="$router.push('/profile?id='+item.id)">
      <el-row style="text-align: left">
        <el-col :span="2">
          <el-avatar :src="item.smallAvatarUrl"/>
        </el-col>
        <el-col :span="16">
          <el-row style="color:#303133;">{{ item.nickname }}</el-row>
          <el-row style="font-size: 14px;color:#909399;">@{{ item.username }}</el-row>
          <el-row>{{ item.description }}</el-row>
        </el-col>
        <el-col :span="6" style="text-align: right">
          <el-button v-if="item.relation===1" class="followed" round @click.stop="doFollow(index)">正在关注</el-button>
          <el-button v-if="item.relation===2" class="unfollowed" round @click.stop="doFollow(index)">关注</el-button>
        </el-col>
      </el-row>
    </el-card>

  </div>
</template>

<script>
import {follow, search, unFollow} from "@/api/user";

export default {
  name: "SearchUserCard",
  props: {
    keyword: "",
    page: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      users: [],
      isLoading: true,
      isBottom: false,
      followBtnText: '关注',
      followBtnClass: 'unfollowed',
    }
  },
  methods: {
    init() {
      this.users = [];
      this.isLoading = true;
      this.isBottom = false;
    },
    search() {
      if (!this.isBottom) {
        this.isLoading = true;
        search(this.keyword, this.page).then(res => {
          this.users.push(...res.data.record);
          this.isBottom = res.data.record.length > 0;
          this.isLoading = false;
        })
      }
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
    doFollow(index) {
      let user = this.users[index];
      if (user.relation === 1) {
        unFollow(user.id).then(() => {
          user.relation = 2;
        })
      } else if (user.relation === 2) {
        follow(user.id).then(() => {
          user.relation = 1;
        })
      }

    }
  },
  watch: {
    keyword(val) {
      this.init();
      this.search();
    },
    page(val) {
      this.search();
    }
  },
  created() {
    this.search();
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

.loading {
  display: inline-flex;
  width: 16px;
  height: 16px;
  border: 2px solid #409EFF;
  border-top-color: transparent;
  border-radius: 100%;
  margin-top: 6px;
  animation: circle infinite 0.75s linear;
}

.loading-box {
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background-color: #FFFFFF;
}

@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>