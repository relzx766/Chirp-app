<template>
  <div>
    <div class="d-flex align-items-start text-start position-relative">
      <el-avatar :src="user.smallAvatarUrl" fit="cover" size="medium"/>
      <div class="fs-7 ms-2 w-100 ">
        <div class="d-flex flex-nowrap w-100 ">
          <div class="flex-grow-1 ">
            <div class=" text-dark fw-bold src-dark finger"
                 @click="$router.push(`/profile?username=${user.username}`)">
              <span>{{ user.nickname }}</span>
              <span v-if="tag" class="badge bg-primary ms-1 fw-normal">{{ tag }}</span>
            </div>
            <div class="text-secondary">@{{ user.username }}</div>
          </div>
          <div class="">
            <follow-btn v-if="user.id!==currentUser.id" :user="user" round/>
          </div>
        </div>
        <div v-if="showDescription">{{ user.description }}</div>
      </div>

    </div>
  </div>
</template>
<script>
import FollowBtn from "@/component/FollowBtn.vue";
import {mapState} from "vuex";

export default {
  name: "UserInfoCard",
  components: {FollowBtn},
  props: {
    user: Object,
    tag: String,
    showDescription: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user
    })
  }
}
</script>
<style scoped>

</style>