<template>
  <div>
    <el-row v-if="isLoading" style="text-align: center">
      <div class="loading-box">
        <div class="loading"/>
      </div>
    </el-row>
    <el-card v-for="(item,index) in users" :key="`${userList[item].id}&${userList[item].relation}`" shadow="hover"
             style="border: none;border-radius: 12px;margin-bottom: 4px">
      <user-info-card
          :user="userList[item]"
      />
    </el-card>

  </div>
</template>

<script>
import UserInfoCard from "@/component/UserInfoCard.vue";
import {userMutations} from "@/config/vuex/mutation-types";
import {mapState} from "vuex";
import {search} from "@/api/user";

export default {
  name: "SearchUserCard",
  components: {UserInfoCard},
  props: {
    keyword: "",
    page: {
      type: Number,
      default: 1
    }
  },
  computed: {
    ...mapState({
      userList: state => state.user.userList
    })
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
          if (res.code === 200) {
            const users = res.data.record;
            this.isBottom = users.length > 0;
            users.forEach(user => {
              this.users.push(user.id);
              this.$store.commit(`user/${userMutations.SET_USER_TO_LIST}`, {user});
            })
          }
        }).finally(_ => {
          this.isLoading = false;
        })
      }
    },
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