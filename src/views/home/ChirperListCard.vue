<template>
  <el-container>
    <el-main>
      <el-row>
        <el-row>
          <span style="float: left;font-weight: bold;font-size: 20px">主页</span>
        </el-row>
        <el-row>
          <el-menu default-active="forYou" mode="horizontal"
                   style="font-weight: bold;margin-bottom: 16px">
            <el-menu-item index="forYou" style="width: 50%"
                          @click="refreshPage()">
              <span>为你推荐</span>
            </el-menu-item>
            <el-menu-item :disabled="!isLogin" index="following" style="width: 50%">
              <span>正在关注</span>
            </el-menu-item>
          </el-menu>

        </el-row>
        <edit-card v-if="isLogin"
                   style="border-bottom: 2px solid #EBEEF5;"/>
        <el-row v-if="isLoading" style="text-align: center">
          <div class="loading-box">
            <div class="loading"/>
          </div>
        </el-row>
        <el-row v-for="item in chirper">
          <chirper-card
              :chirper="item" style="border-bottom: 1px solid #E4E7ED;z-index: 1"
              type="list"/>
        </el-row>
        <el-row>
          <span v-if="isBottom" style="color:#909399;">到底了</span>
        </el-row>
      </el-row>
    </el-main>
  </el-container>
</template>


<script>
import ChirperCard from "@/views/chirper/ChirperCard.vue";
import {getChirperPage} from "@/api/chirper";
import {getShortProfile} from '@/api/user';
import OriginCard from "@/views/edit/OriginCard.vue";

export default {
  name: "ChirperListCard",
  props: {
    isLogin: Boolean
  },
  data() {
    return {
      chirper: [],
      page: 1,
      isLoading: false,
      isBottom: false
    }
  },
  methods: {
    refreshPage() {
      this.page=1;
      this.isBottom=false;
      this.isLoading = true;
      let startTime = Date.now();
      this.getChirper(1).then((record) => {
        let loadTime = Date.now() - startTime;
        if (loadTime < 1000) {
          setTimeout(() => {
            this.chirper = record;
            this.isLoading = false;
          }, 1000 - loadTime);
        } else {
          this.chirper = record;
          this.isLoading = false;
        }
      })
    },
    loadPage() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight +10>= scrollHeight &&!this.isBottom &&!this.isLoading) {
        this.page++;
        this.isLoading=true;
        this.getChirper(this.page).then((data)=>{
          this.isBottom=data.length<=0;
          this.chirper.push(...data);
          this.isLoading=false;
        })
      }
    },
    async getChirper(page) {
      let chirpers = (await getChirperPage(page)).data.record;
      if (chirpers.length>0){
        let authorIds = [];
        for (let i = 0; i < chirpers.length; i++) {
          authorIds.push(chirpers[i].authorId);
        }
        let users = (await getShortProfile(authorIds)).data.record;
        return chirpers.map(chirper => {
          let user = users.find(u => u.id === chirper.authorId);
          chirper.mediaKeys=JSON.parse(chirper.mediaKeys);
          chirper.username = user.username;
          chirper.nickname = user.nickname;
          chirper.avatar = user.smallAvatarUrl;
          return chirper;
        });
      }
      return Promise.resolve([]);

    }
  },
  components: {
    'edit-card': OriginCard,
    'chirper-card': ChirperCard,
  },
  created() {
    this.refreshPage();
    window.addEventListener("scroll",this.loadPage,true);
  },
  destroyed() {
    window.removeEventListener("scroll",this.loadPage);
  }
}
</script>

<style scoped>
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