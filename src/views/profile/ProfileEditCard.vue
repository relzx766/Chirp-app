<template>
  <el-row>
    <el-row style="text-align: left">
      <el-button
          circle
          icon="el-icon-close"
          style="
          border: none;
          color: #000000;
          font-size: 20px;
          font-weight: bolder;
        "
          @click="doClose()"
      ></el-button>
      <span
          style="
          margin-left: 30px;
          font-size: 20px;
          font-weight: bolder;
          color: #000000;
        "
      >编辑个人资料</span
      >
      <el-button
          round
          size="medium"
          style="
          border: none;
          color: #ffffff;
          background-color: #000000;
          float: right;
          margin-top: 10px;
          margin-right: 6px;
          font-weight: bolder;
        "
          @click="doPost()"
      >
        保存
      </el-button>
    </el-row>

    <el-upload
        :data="{ index: 0 }"
        :http-request="doUpload"
        :show-file-list="false"
        action="#"
        class="container-cover-edit"
    >
      <el-image
          :src="editUser.profileBackUrl"
          class="cover-edit"
          fit="cover"
          style="width: 100%; height: 160px"
      >
        <div slot="error" class="image-slot">&nbsp;</div>
      </el-image>
      <div class="overlay-edit-cover">
        <el-button
            circle
            class="btn-file"
            icon="el-icon-camera"
            type="info"
        ></el-button>
      </div>
    </el-upload>
    <el-upload
        :data="{ index: 1 }"
        :http-request="doUpload"
        :show-file-list="false"
        action="#"
        class="avatar-container"
        style="margin-top: 110px"
    >
      <el-image
          :src="editUser.largeAvatarUrl"
          class="profile-avatar"
          fit="cover"
      >
        <div slot="error" class="image-slot">&nbsp;</div>
      </el-image>
      <div class="overlay-edit-avatar">
        <el-button
            circle
            class="btn-file"
            icon="el-icon-camera"
            type="info"
        ></el-button>
      </div>
    </el-upload>
    <el-row style="margin-top: 260px">
      <el-input
          v-model="editUser.nickname"
          maxlength="40"
          placeholder="昵称"
          show-word-limit
      >
      </el-input>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-input
          v-model="editUser.description"
          :autosize="{ minRows: 2 }"
          maxlength="255"
          placeholder="简介"
          show-word-limit
          type="textarea"
      >
      </el-input>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="12" style="text-align: left">
        <el-date-picker
            v-model="editUser.birthday"
            :picker-options="pickerOptions"
            format="yyyy 年 MM 月 dd 日"
            placeholder="生日"
            type="date"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="12">
        <el-radio-group v-model="editUser.gender" fill="#e3f2fd">
          <el-radio-button label="男"
          ><i class="el-icon-male" style="color: #409eff"
          /></el-radio-button>
          <el-radio-button label="女"
          ><i class="el-icon-female" style="color: #ff80ab"
          /></el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-input
          v-model="editUser.gender"
          maxlength="30"
          placeholder="how dare you assume my gander!😡"
          show-word-limit
      />
    </el-row>
  </el-row>
</template>

<script>
import {putProfile} from "@/api/user";
import {mapState} from "vuex";
import {userMutations} from "@/config/vuex/mutation-types";
import ChunkFile from "@/util/uploadUtil";

export default {
  name: "ProfileEditCard",

  data() {
    return {
      editUser: {},
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
        selectableRange:
            "00:00:00 - " +
            new Date().getHours() +
            ":" +
            (new Date().getMinutes() + 1) +
            ":00",
      },
      uploadOption: [],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  methods: {
    doPost() {
      putProfile(JSON.stringify(this.editUser)).then((res) => {
        this.$message({
          message: "已修改个人资料🥳🥳🥳",
          type: "success",
        });
        this.$store.commit(`user/${userMutations.SET_USER}`, {
          user: this.editUser,
        });
        this.$emit("doEditComplete");
      });
    },
    doClose() {
      this.$emit("doClose");
    },
    doUpload({data, file}) {
      let chunkUpload = new ChunkFile(file, {
        onsuccess: (res) => {
          if (data.index === 0) {
            this.editUser.profileBackUrl = res.data.record.url;
          } else {
            this.editUser.largeAvatarUrl = res.data.record.url;
          }
        },
        onerror: (res) => {
          this.$message.error(res.message);
        },
      });
      chunkUpload.start();
    },
  },
  created() {
    this.editUser = JSON.parse(JSON.stringify(this.user));
  },
};
</script>

<style scoped>
.profile-avatar {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 100%;
}

.avatar-container {
  width: 120px;
  height: 120px;
  border: 4px solid #ffffff;
  background-color: #ffffff;
  border-radius: 100%;
  position: absolute;
  margin-top: -10%;
  left: 16px;
  z-index: 4;
  text-align: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 2px;
  width: 116px;
  height: 0;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 5;
}

.avatar-container:hover .overlay {
  height: 116px;
}

.overlay-edit-avatar {
  position: absolute;
  top: 0;
  left: 2px;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
  z-index: 5;
}

.btn-file {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: none;
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 20px;
  color: #ffffff;
}

.container-cover-edit {
  width: 100%;
  height: 170px;
  margin-top: 10px;
  position: absolute;
  text-align: center;
}

.cover-edit {
  width: 100%;
  height: 160px;
  position: absolute;
  left: 50%;
  right: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.overlay-edit-cover {
  position: absolute;
  width: 100%;
  height: 160px;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
  z-index: 2;
  left: 50%;
  right: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
