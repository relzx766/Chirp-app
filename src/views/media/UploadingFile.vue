<template>

  <div class="d-flex flex-column position-relative" >
    <el-image v-if="type==='image'"
              :preview-src-list="[fileUrl]"
              :src="fileUrl"
              fit="cover"
              class="rounded-4"
              style="flex: 1"/>
    <div v-else-if="type==='video'||type==='application'" class="m-0 " style="flex: 1">
      <video-player class="rounded-4" :url="fileUrl"/>
    </div>
    <el-button circle class="btn-remove position-absolute top-0 end-0 p-0"
               icon="el-icon-close"  type="info"
               @click="doRemove"></el-button>
    <div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"
    style="height: 4px;">
      <div :class="uploadStatus" class="progress-bar " :style="progress"></div>
    </div>

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
      uploadComplete: false,
      progress: {
        width: "1%",
      },
      uploadStatus:['progress-bar-striped','progress-bar-animated']

    }
  },
  methods: {
    doUpload() {
        this.isChunk = true;
        this.chunk = new ChunkUpload(this.file, {
          onSuccess: (res) => {
            if (!this.uploadComplete) {
              this.uploadComplete = true;
              this.media = res.data.record;
              this.progress = {
                width: "100%"};
              this.uploadStatus=['bg-success'];
              this.$emit("uploaded", res.data.record);
              this.chunk.stop();
            }
          },
          onError: (res) => {
            this.$message.error("文件上传失败\n" + res.message);
            this.progress = {
              width: "100%"};
            this.uploadStatus=['bg-danger'];
          },
          onProgress: ({total, finish}) => {
            console.log(finish /total)
            this.progress = {
              width: finish / total * 100 + "%"};
            this.uploadStatus=['progress-bar-striped','progress-bar-animated'];
          }
        });
        this.chunk.start();
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
  height: auto;
  font-size: 100%;
  width: 10%;
  max-height: 100%;
  aspect-ratio: 1;
  max-width: 40px;
}



</style>
