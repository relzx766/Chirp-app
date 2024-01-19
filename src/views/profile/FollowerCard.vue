<template>
  <div>
    <el-card v-for="(item,index) in record" shadow="hover" style="border: none;border-radius: 12px;margin-top: 4px">
      <el-col :span="2">
        <el-avatar :src="item.smallAvatarUrl"/>
      </el-col>
      <el-col :span="22">
        <el-row>
          <el-col :span="16" class="text-start">
            <el-link @click="doToProfile(item.id)"  style="color: #212121">{{ item.nickname }}</el-link>
            <el-row style="color: #606266">@{{ item.username }}</el-row>
          </el-col>
          <el-col :offset="4" :span="2">
            <el-button v-if="item.id===$store.getters.getUser.id" disabled round>自己</el-button>
            <el-button v-else-if="item.relation===2" round
                       style="background-color: #212121;color: white;font-weight:bold"
                       @click="follow(index);">关注
            </el-button>
            <el-button v-else-if="item.relation===1" round style="font-weight: bold" type="primary"
                       @click="unfollow(index);">已关
            </el-button>
          </el-col>
        </el-row>
        <el-row >{{ item.description }}</el-row>
      </el-col>
    </el-card>
  </div>
</template>
<script>
import {follow, getFollower, getFollowing, unFollow} from "@/api/user";

export default {
  name: "FollowerCard",
  props: {
    id: '',
    /**
     * follower or following
     */
    type: String
  },
  data() {
    return {
      record: [],
      page: 1,
      isBottom: false,
      isLoading: false
    }
  },
  methods: {
    doToProfile(id){
      this.$emit('user-change')
      this.$router.push(`/profile?id=${id}`);
    },
    unfollow(index){
      this.record[index].relation=2;
      this.$emit('unfollow');
      unFollow(this.record[index].id);
    },
    follow(index){
      this.record[index].relation=1;
      this.$emit('follow');
      follow(this.record[index].id);
    },
    getFollower(page) {
      this.isLoading = true;
      getFollower(this.id, page).then(res => {
        if (res.code===200) {
          this.record.push(...res.data.record);
          this.isLoading = false;
          this.isBottom = res.data.record.length <= 0;
        }
      })
    },
    getFollowing(page) {
      this.isLoading = true;
      getFollowing(this.id, page).then(res => {
        if (res.code===200) {
          this.record.push(...res.data.record);
          this.isLoading = false;
          this.isBottom = res.data.record.length <= 0;
        }
      })
    },
    init() {
      if ('follower' === this.type) {
        this.getFollower(this.page);
        this.page++;
      }
      if ('following' === this.type) {
        this.getFollowing(this.page);
        this.page++;
      }
    },
    loadMore() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight + 10 >= scrollHeight && !this.isLoading && !this.isBottom) {
        if ('follower' === this.type) {
          this.getFollower(this.page);
          this.page++;
        }
        if ('following' === this.type) {
          this.getFollowing(this.page);
          this.page++;
        }
      }

    }
  },
  created() {
    this.init();
    window.addEventListener("scroll", this.loadMore, true)
  },
  destroyed() {
    window.removeEventListener("scroll", this.loadMore)

  }
}
</script>
<style scoped>

</style>
