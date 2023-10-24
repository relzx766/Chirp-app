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
            <div v-for="item in Object.values(receivers)" :key="item.id" style="display: inline-block">
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

        <div v-show="loading" aria-valuemax="100" aria-valuemin="0" aria-valuenow="100" class="progress"
             role="progressbar" style="height: 4px">
          <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
        </div>
      </el-main>
    </el-container>

    <div v-if="!step2||Object.keys(receivers).length<=0" style="height: 60vh;border: none;overflow-x: hidden">
      <div v-for="item in users" :key="item.id" class="row user-item" @click="$set(receivers,item.id,item)">
        <div class="col-1" style="text-align: left;">
          <el-avatar :src="item.smallAvatarUrl"/>
        </div>
        <div class="col-11" style="text-align: left;">
          <div style="margin-left: 12px">
            <el-row style="font-weight: bold;color: #303133">{{ item.nickname }}</el-row>
            <el-row>@{{ item.username }}</el-row>
          </div>

        </div>
      </div>
    </div>
    <div v-if="step2&&Object.keys(receivers).length>0" style="padding: 8px;">
      <send-card :receiver="Object.values(receivers)" style="border-radius: 12px"/>
    </div>
  </div>
</template>
<script>
import {search} from "@/api/user";
import SendCard from "@/views/message/SendCard.vue";

export default {
  name: "NewChatCard",
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
    doSearch() {
      this.loading = true;
      search(this.keyword, this.page).then(res => {
        this.loading = false;
        this.page++;
        this.isBottom = res.data.record.length <= 0;
        this.users.push(...res.data.record);
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
