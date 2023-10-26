<template>
  <el-row>

    <waterfall :col="fileList.length>2?2:fileList.length"

               :data="fileList"
               :isTransition="false"
               style="margin-bottom: 12px;width:100%;overflow-x: hidden;">
      <div v-for="(file,index) in fileList" :key="file.name" style="margin-top: 10px;">
        <uploading-card
            :file="file.raw"
            @remove="removeFile(index)"
            @uploaded="media=>{addMediaKey(media);}"/>
      </div>

    </waterfall>
    <el-row>
      <el-col :span="14">
        <el-upload
            :auto-upload="false"
            :limit="9"
            :on-change="handlerFileChange"
            :show-file-list="false"
            action="#"
            multiple
            style="display: inline-block">
          <el-button circle size="small" style="border: none">
            <img class="bt-icon" src="../../assets/image.svg">
          </el-button>
        </el-upload>


      </el-col>
      <el-col :span="10" style="text-align: right">
        <el-button ref="btn-post" :disabled="postBtnDisabled" icon="el-icon-s-promotion"
                   round size="small" type="primary" @click="doSend()">发布
        </el-button>
      </el-col>
    </el-row>

  </el-row>
</template>

<script>
import UploadingFile from "@/views/media/UploadingFile.vue";

export default {
  name: "EditBar",
  props: {
    postBtnDisabled: true
  },
  components: {
    'uploading-card': UploadingFile
  },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    doSend() {
      this.fileList = [];
      this.$emit('post');
    },
    handlerFileChange(file, fileList) {
      let type = file.raw.type.split("/").shift();
      if (type !== 'image' && type !== 'video') {
        this.$message.warning("不支持的文件类型");
      } else {
        if (this.fileList.length >= 4) {
          this.$message.warning("最多支持4张图片或者1个视频");
        } else if (this.fileList.length > 0 && this.fileList[0].raw.type.split("/").shift() === 'video') {
          this.$message.warning("最多支持4张图片或者1个视频");
        } else if (this.fileList.length > 0 && type === 'video') {
          this.$message.warning("最多支持4张图片或者1个视频");
        } else {
          this.fileList.push(file);
        }
      }
    },
    removeFile(index) {
      this.fileList.splice(index, 1);
      this.$emit("removeMedia", index);
    },
    addMediaKey(media) {
      this.$emit("addMedia", media);
    }
  }
}
</script>

<style scoped>
.bt-icon {
  width: 20px;

}
</style>
