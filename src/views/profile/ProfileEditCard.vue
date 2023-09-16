<template>
  <el-row>
    <el-row style="text-align: left">
      <el-button
          circle icon="el-icon-close" style="border: none;color: #000000;
                  font-size: 20px;font-weight: bolder"
          @click="doClose()"></el-button>
      <span style="margin-left: 30px;font-size: 20px;font-weight: bolder;color: #000000">编辑个人资料</span>
      <el-button round size="medium" style="border: none;color: #FFFFFF;
               background-color: #000000;float: right;margin-top: 10px;margin-right: 6px;
                  font-weight: bolder" @click="doPost()">
        保存
      </el-button>
    </el-row>

    <el-upload
        :data="{index:0}"
        :http-request="doUpload"
        :show-file-list="false"
        action="#"
        class="container-cover-edit">
      <el-image
          :src="user.profileBackUrl"
          class="cover-edit"
          fit="cover"
          style="width: 100%; height: 160px;">
        <div slot="error" class="image-slot">
          &nbsp;
        </div>
      </el-image>
      <div class="overlay-edit-cover">
        <el-button circle class="btn-file" icon="el-icon-camera" type="info"></el-button>
      </div>
    </el-upload>
    <el-upload
        :data="{index:1}"
        :http-request="doUpload"
        :show-file-list="false"
        action="#"
        class="avatar-container"
        style="margin-top: 110px">
      <el-image
          :src="user.largeAvatarUrl"
          class="profile-avatar"
          fit="cover">
        <div slot="error" class="image-slot">
          &nbsp;
        </div>
      </el-image>
      <div class="overlay-edit-avatar">
        <el-button circle class="btn-file" icon="el-icon-camera" type="info"></el-button>
      </div>
    </el-upload>
    <el-row style="margin-top: 260px">
      <el-input v-model="user.nickname" maxlength="40" placeholder="昵称" show-word-limit>
      </el-input>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-input
          v-model="user.description"
          :autosize="{ minRows: 2}"
          maxlength="255"
          placeholder="简介"
          show-word-limit
          type="textarea"
      >
      </el-input>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-col :span="12" style="text-align: left">
        <el-date-picker
            v-model="user.birthday"
            :picker-options="pickerOptions"
            format="yyyy 年 MM 月 dd 日"
            placeholder="生日"
            type="date">
        </el-date-picker>
      </el-col>
      <el-col :span="12">
        <el-radio-group v-model="user.gender" fill="#e3f2fd">
          <el-radio-button label="男"><i class="el-icon-male" style="color:#409EFF "/></el-radio-button>
          <el-radio-button label="女"><i class="el-icon-female" style="color: #ff80ab"/></el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-input v-model="user.gender"
                maxlength="30"
                placeholder="我认为我是啥🅱我就是啥🅱😅"
                show-word-limit/>
    </el-row>
  </el-row>
</template>

<script>
import {putProfile} from "@/api/user";
import {upload} from "@/api/media";
import ChunkUpload, {getMd5} from "@/util/upload";

export default {
  name: "ProfileEditCard",
  props: {
    value: {},
  },
  data() {
    return {
      user: {},
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        },
        selectableRange: '00:00:00 - ' + new Date().getHours() + ':' + (new Date().getMinutes() + 1) + ':00'
      },
      uploadOption: []
    }
  },
  methods: {
    doPost() {
      putProfile(JSON.stringify(this.user)).then((res) => {
        this.$message({
          message: '已修改个人资料🥳🥳🥳',
          type: 'success'
        });
        this.$store.commit("setUser", this.user);
        this.user = {};
        this.$router.go(0);
      })
    },
    doClose() {
      this.$emit('doClose')
    },
    doUpload({data, file}) {
      if (file.size < 2 * 1024 * 1024) {
        getMd5(file).then(md5 => {
          let form = new FormData();
          form.append("file", file);
          form.append("hash", md5);
          upload(form).then(res => {
            if (res.code === 200 || res.code === 409) {
              if (data.index === 0) {
                this.user.profileBackUrl = res.data.record.url;
              } else {
                this.user.largeAvatarUrl = res.data.record.url;
              }
            } else {
              this.$message.error("文件上传失败");
            }
          })
        })
      } else {
        let chunkUpload = new ChunkUpload(file, {
          onSuccess: (res) => {
            if (data.index === 0) {
              this.user.profileBackUrl = res.data.record.url;
            } else {
              this.user.largeAvatarUrl = res.data.record.url;
            }
          },
          onError: (res) => {
            this.$message.error(res.message)
          }
        });
        chunkUpload.start();
      }
    }
  },
  watch: {
    value(val) {
      this.user = JSON.parse(JSON.stringify(this.value));
    }
  },
  created() {
    this.user = JSON.parse(JSON.stringify(this.value))
  }
}
</script>

<style scoped>
.profile-avatar {
  width: 116px;
  height: 116px;
  border-radius: 100%;
}

.avatar-container {
  width: 120px;
  height: 120px;
  border: 4px solid #FFFFFF;
  background-color: #FFFFFF;
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
  width: 116px;
  height: 116px;
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
  color: #FFFFFF;
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