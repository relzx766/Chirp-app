<template>
  <div class=" text-center">
    <el-container>
      <el-main>
        <div class="row">
          <div class="col-4" style="text-align: left">
            <span style="font-size: 20px;font-weight: bold;color: #303133">新私信</span>
          </div>
          <div class="col-4">
          </div>
          <div class="col-4" style="text-align: right">
            <el-button v-if="!step2" :disabled="Object.keys(receivers).length<=0" round size="small"
                       style="font-weight: bold;font-size: 14px"
                       type="info" @click="step2=true">下一步
            </el-button>
            <el-button v-if="step2" round size="small" style="font-weight: bold;font-size: 14px"
                       type="primary" @click="step2=false">上一步
            </el-button>
          </div>
        </div>
        <el-row style="margin-top: 14px;border-bottom: 1px #DCDFE6 solid">
          <el-input v-model="keyword" class="rounded-pill" placeholder="搜索用户"
                    @keyup.enter.native="init();doSearch()">
            <el-button slot="prepend" icon="el-icon-search" style="color: #409EFF;font-size: 18px;padding-left: 0"
                       @click="init();doSearch()"></el-button>
          </el-input>
          <el-row style="text-align: left">
            <div v-for="item in Object.values(receivers)"
                 :key="item.id"
                 style="display: inline-block">
              <button class="btn btn-light rounded-pill" style="display: flex;align-items: center;padding: 2px"
                      type="button"
                      @click="$delete(receivers,item.id)">
                <el-avatar :src="item.smallAvatarUrl" size="small"/>
                <span style="margin-left: 8px;font-weight: bold">{{ item.nickname }}</span>
                <i class="el-icon-close"
                   style="color: #409EFF;font-weight: bold;font-size:16px;margin-left: 12px;margin-right: 12px"/>
              </button>
            </div>
          </el-row>
        </el-row>

        <div v-show="loading" aria-valuemax="100" aria-valuemin="0" aria-valuenow="75" class="progress"
             role="progressbar" style="height: 4px">
          <div class="progress-bar progress-bar-striped progress-bar-animated " style="width: 100%;height: 4px"></div>
        </div>
      </el-main>
    </el-container>

    <div v-if="!step2||Object.keys(receivers).length<=0" style="height: 60vh;border: none;overflow-x: hidden">
      <div v-for="item in users" :key="item.id"
           class="row user-item"
           @click="$set(receivers,item.id,item)"
           :class="!canBeChat(item)?['pe-none','bg-light']:[]"
           >
<!--        //style="pointer-events: none;"-->
        <div class="col-1" style="text-align: left;">
          <el-avatar :src="item.smallAvatarUrl"/>
        </div>
        <div class="col-11" style="text-align: left;">
          <div style="margin-left: 12px">
            <el-row style="font-weight: bold;color: #303133">{{ item.nickname }}</el-row>
            <el-row v-if="!canBeChat(item)">不可以向 @{{ item.username }} 发私信</el-row>
            <el-row v-else>@{{ item.username }}</el-row>
          </div>

        </div>
      </div>
    </div>
    <div v-if="step2&&Object.keys(receivers).length>0" style="padding: 8px;">
      <send-card :receiver="Object.values(receivers)" emoji-pos="left-start" style="border-radius: 12px"/>
    </div>
  </div>
</template>
<script>
import {getRelations, search} from "@/api/user";
import SendCard from "@/views/message/SendCard.vue";
import {getChatSettings} from "@/api/advice";
import {chatAllowEnum, relationEnums} from "@/enums/enums";

export default {
  name: "NewChatCard",
  computed: {
    chatAllowEnum() {
      return chatAllowEnum
    }
  },
  components: {SendCard},

  data() {
    return {
      keyword: "",
      loading: false,
      page: 1,
      isBottom: false,
      users: [],
      receivers: {},
      step2: false
    }
  },
  methods: {
    init() {
      this.users = [];
      this.page = 1;
      this.isBottom = false;
      this.loading = false;
    },
    canBeChat(user){
     return ((user.chatSetting.allow===chatAllowEnum.ANYONE&&relationEnums.BLOCK!==user.relation)
          ||user.id===this.$store.getters.getUser.id
          ||user.relation===relationEnums.FOLLOW)
      &&user.chatSetting.chatReady;
    },
    doSearch() {
      this.loading = true;
      let users=[];
      search(this.keyword, this.page).then(res => {
        if (res.code===200) {
          users = res.data.record;
          this.isBottom = users.length <= 0;
        }
        return users.map(r=>r.id);
      }).then(userIds=>{
        return Promise.all([
            getChatSettings(userIds),
            getRelations(userIds)
        ])
      }).then(([chatRes,relaRes])=>{
        if (chatRes.code===200&&relaRes.code===200){
          let settings = chatRes.data.record;
          settings=settings.reduce((setting,item)=>{
            setting[item.userId]=item;
            return setting;
          },{});
          let relations=relaRes.data.record.reduce((relation,item)=>{
            relation[item.fromId]=item;
            return relation;
          },{});
          users.forEach(user=>{
            user.chatSetting=settings[user.id];
            user.relation=relations[user.id]?relations[user.id].status:relationEnums.UNFOLLOW;
            this.users.push(user);
          });
          this.loading = false;
          this.page++;
        }

      })
    },
    loadMore() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight + 10 >= scrollHeight && !this.isBottom && !this.loading) {
        this.doSearch();
      }
    },
    addReceiver(item) {
      this.$set(this.receivers, item.id, item);
    }
  },
  created() {
    window.addEventListener("scroll", this.loadMore, true);
  },
  destroyed() {
    window.removeEventListener("scroll", this.loadMore);
  }
}
</script>
<style scoped>
::v-deep .el-input__inner {
  border: none;
}

::v-deep .el-input-group__prepend {
  background: none;
  border: none;
}

.user-item {
  padding: 12px;
  cursor: pointer;
}

.user-item:hover {
  background-color: #f4f4f4;

}
</style>
