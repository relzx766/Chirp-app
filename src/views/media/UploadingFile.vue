<template>
  <div style="position: relative; display: inline-block;">
    <el-image v-if="type==='image'"
              :preview-src-list="[fileUrl]"
              :src="fileUrl"
              fit="cover"
              style="border-radius: 20px;margin-bottom: 0"/>
    <div v-else-if="type==='video'||type==='application'" style="padding: 4px">
      <video-player :url="fileUrl"/>
    </div>
    <el-button circle class="btn-remove" icon="el-icon-close" style="padding: 0" type="info"
               @click="doRemove"></el-button>
    <div :style="progress" class="progress-bar"></div>
  </div>
</template>

<script>
import ChunkUpload, {getMd5} from "@/util/upload";
import {upload} from "@/api/media";
import VideoUploadCard from "@/views/media/VideoUploadCard.vue";

export default {
  name: "UploadingFile",
  components: {
    'video-player': VideoUploadCard
  },
  props: {
    file: {}
  },
  data() {
    return {
      chunk: null,
      isChunk: false,
      fileUrl: "",
      type: "",
      uploadComplate: false,
      progress: {
        width: "10%",
        backgroundColor: "#409EFF",
      }

    }
  },
  methods: {
    doUpload() {
      if (this.file.size < 2 * 1024 * 1024) {
        this.isChunk = false;
        getMd5(this.file).then(md5 => {
          let form = new FormData();
          form.append("file", this.file);
          form.append("hash", md5);
          upload(form).then(res => {
            if (res.code === 200 || res.code === 409) {
              this.progress = {
                width: "100%",
                backgroundColor: "#67C23A",
              };
              this.$emit("uploaded", res.data.record);
            } else {
              this.$message.error("文件上传失败\n" + res.message);
              this.progress = {
                width: "100%",
                backgroundColor: "#F56C6C",
              };
            }
          })
        })
      } else {
        this.isChunk = true;
        this.chunk = new ChunkUpload(this.file, {
          onSuccess: (res) => {
            if (!this.uploadComplate) {
              this.uploadComplate = true;
              this.media = res.data.record;
              this.progress = {
                width: "100%",
                backgroundColor: "#67C23A",
              };
              this.$emit("uploaded", res.data.record);
              this.chunk.stop();
            }
          },
          onError: (res) => {
            this.$message.error("文件上传失败\n" + res.message);
            this.progress = {
              width: "100%",
              backgroundColor: "#F56C6C",
            };
          },
          onProgress: ({total, finish}) => {
            console.log(total, finish);
            this.progress = {
              width: Math.ceil(finish / total) * 100 + "%",
              backgroundColor: "#409EFF",
            }
          }
        });
        this.chunk.start();
      }
    },
    doRemove() {
      if (this.isChunk) {
        this.chunk.stop();
      }
      this.$emit("remove");
    }
  },
  created() {
    this.fileUrl = URL.createObjectURL(this.file);
    this.type = this.file.type.split("/").shift();
    this.doUpload();
  }
}
</script>

<style scoped>
.btn-remove {
  position: absolute;
  top: 1.5%;
  right: 1.5%;
  height: auto;
  font-size: 100%;
  width: 10%;
  max-height: 100%;
  aspect-ratio: 1;
  max-width: 40px;
}

.progress-bar {
  margin-left: 20px;
  margin-top: -4px;
  max-width: calc(100% - 40px);
  height: 2px;
  z-index: 999
}

</style>
