<template>
  <div>
    <el-button :class="btnClass" class="fw-bold" v-bind="$attrs" @click="handlerClick"></el-button>
  </div>
</template>
<script>
import {relationEnums} from "@/enums/enums";
import {block, follow, unBlock, unFollow} from "@/api/user";
import {mapState} from "vuex";
import {userMutations} from "@/config/vuex/mutation-types";

export default {
  name: "FollowBtn",
  props: {
    user: Object,
  },
  computed: {
    btnClass() {
      switch (this.relation) {
        case relationEnums.UNFOLLOW:
          return ["bg-dark", "text-white", "border-0", "follow-button"];
        case relationEnums.FOLLOW:
          return ["text-dark", "bg-none", "unfollow-button"];
        case relationEnums.BLOCK:
          return ["bg-danger", "text-white", "block-button"];
        default:
          return ["bg-dark", "text-white", "border-0", "follow-button"];
      }
    },
    ...mapState({
      userList: state => state.user.userList,
    })
  },
  data() {
    return {
      loading: false,
      relation: relationEnums.UNFOLLOW,
    }
  },
  methods: {
    handlerClick() {
      const doClick = () => {
        switch (this.relation) {
          case relationEnums.UNFOLLOW:
            return this.follow();
          case relationEnums.FOLLOW:
            return this.unfollow();
          case relationEnums.BLOCK:
            return this.unblock();
          default:
            break;
        }
      }
      if (!this.loading) {
        this.loading = true;
        doClick().finally(() => {
          this.loading = false;
        })
      }
    },
    follow() {
      const user = this.user;
      return follow(user.id).then(res => {
        if (res.code === 200) {
          this.relation = relationEnums.FOLLOW;
          user.relation = relationEnums.FOLLOW;
          this.$store.commit(`user/${userMutations.SET_USER_TO_LIST}`, {user});
          this.$emit("follow");
        } else {
          this.$message.error(res.message);
        }
      })

    },
    unfollow() {
      const user = this.user;
      return unFollow(user.id).then(res => {
        if (res.code === 200) {
          this.relation = relationEnums.UNFOLLOW;
          user.relation = relationEnums.UNFOLLOW;
          this.$store.commit(`user/${userMutations.SET_USER_TO_LIST}`, {user});
          this.$emit("unfollow");
        } else {
          this.$message.error(res.message);
        }
      });
    },
    block() {
      const user = this.user;
      return block(user.id).then(res => {
        if (res.code === 200) {
          this.relation = relationEnums.BLOCK;
          user.relation = relationEnums.BLOCK;
          this.$store.commit(`user/${userMutations.SET_USER_TO_LIST}`, {user});
          this.$emit("block");
        } else {
          this.$message.error(res.message);
        }
      });
    },
    unblock() {
      const user = this.user;
      return unBlock(user.id).then(res => {
        if (res.code === 200) {
          this.relation = relationEnums.UNFOLLOW;
          user.relation = relationEnums.UNFOLLOW;
          this.$store.commit(`user/${userMutations.SET_USER_TO_LIST}`, {user});
          this.$emit("unblock");
        } else {
          this.$message.error(res.message);
        }
      });

    }
  },
  created() {
    this.relation = this.user.relation;
  }
}
</script>
<style scoped>
.follow-button::before {
  content: '关注';
  display: inline;
}

.unfollow-button::before {
  content: '正在关注';
  display: inline;
}

.unfollow-button::after {
  content: '取消关注';
  display: none;
}

.unfollow-button:hover {

  background-color: #ffccc7;
}

.unfollow-button:hover::after {
  color: #ef5350;
  display: inline;
}

.unfollow-button:hover::before {
  display: none;
}

.block-button::before {
  content: '已屏蔽';
  display: inline;
}

.block-button::after {
  content: '取消屏蔽';
  display: none;
}

.block-button:hover::after {
  display: inline;
}

.block-button:hover::before {
  display: none;
}
</style>