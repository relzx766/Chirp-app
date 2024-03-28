<template>
  <div>
    <div class="d-flex flex-column position-relative overflow-hidden rounded-4">
      <el-image
          v-if="mediaType === supportMediaTypeEnums.IMAGE"
          :preview-src-list="[fileUrl]"
          :src="fileUrl"
          class="rounded-4"
          fit="cover"
          style="flex: 1"
      />
      <div
          v-else-if="mediaType === supportMediaTypeEnums.VIDEO"
          class="m-0"
          style="flex: 1"
      >
        <file-card
            :type="type"
            :url="fileUrl"
            class="rounded-4 overflow-hidden"
        />
      </div>
      <div
          class="p-1 z-index-1 position-absolute top-0 end-0  ">
        <div class="d-flex flex-column">
          <div class="text-end">
            <el-button
                circle
                class="p-1 bg-dark border-0 "
                type="info"
                @click="doRemove"
            ><i class="btn-remove text-white fw-bold fs-4 bi bi-x "
            /></el-button>
          </div>
          <div class="text-end mt-1">
            <el-progress
                :percentage="progress"
                :show-text="false"
                :status="progressBarStatus"
                :width="32"
                color="" stroke-width="4"
                type="circle"
            ></el-progress>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import {supportMediaTypeEnums, uploadStatusEnums} from "@/enums/enums";
import FileCard from "@/views/media/FileCard";
import ChunkFile from "@/util/uploadUtil";
import ProgressCircle from "@/component/ProgressCircle";

export default {
  name: "UploadingFile",
  computed: {
    supportMediaTypeEnums() {
      return supportMediaTypeEnums;
    },
    type() {
      return this.file.type;
    },
    mediaType() {
      return this.type.split("/").shift().toUpperCase();
    },
    fileUrl() {
      return URL.createObjectURL(this.file);
    },
    name() {
      return this.file.name;
    },
    progress() {
      if (this.chunk !== null) {
        if (this.chunk.complete) {
          return 100;
        }
        const finish = this.chunk.chunkList.filter(chunk => chunk.status === uploadStatusEnums.SUCCESS).length;
        return finish / this.chunk.chunkList.length * 100;
      }
      return 0;
    },
    progressBarStatus() {
      switch (this.uploadStatus) {
        case uploadStatusEnums.SUCCESS:
          return 'success';
        case uploadStatusEnums.ERROR:
          return 'exception';
        default:
          return '';
      }
    }
  },
  components: {
    FileCard,
    ProgressCircle,
  },
  props: {
    file: {},
  },
  data() {
    return {
      chunk: null,
      isChunk: false,
      uploadStatus: uploadStatusEnums.PENDING
    };
  },
  methods: {
    doUpload() {
      this.chunk = new ChunkFile(this.file, {
        onsuccess: (res) => {
          this.media = res.data.record;
          this.uploadStatus = uploadStatusEnums.SUCCESS;
          this.$emit("uploaded", res.data.record);
        },
        onerror: (e) => {
          this.uploadStatus = uploadStatusEnums.ERROR;
          this.$message.error("文件上传失败\n" + e);
        },
      });
      this.chunk.start();
    },
    doRemove() {
      this.chunk.break();
      this.$emit("remove");
    },
  },
  created() {
    this.doUpload();
  },
};
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

.upload-card-item {
  width: 30px;
  height: 30px;
}

#progress-box::before {
  content: "";
  position: absolute;
  top: 5%;
  left: 5%;
  width: 90%;
  height: 90%;
  border-radius: 100%;
  background: beige;
  backdrop-filter: blur(50px);
}
</style>
