<template>
  <div class="container">
    <el-form ref="communityForm" :model="community" :rules="communityFormRules" label-position="top">
      <div class="row">
        <div class="text-dark fw-bold fs-6">创建一个新的社群</div>
        <div class="col">

          <el-form-item prop="name">
            <div class="text-dark fw-bold ">社群名称</div>
            <el-input v-model="community.name" placeholder="社群名称"></el-input>
          </el-form-item>
          <el-form-item prop="cover">
            <div class="text-dark fw-bold  ">社群封面</div>
            <el-upload
                :data="{ index: 0 }"
                :http-request="doUpload"
                :show-file-list="false"
                action="#"
                class="rounded-4 overflow-hidden position-relative container-cover-edit  d-flex align-items-center justify-content-center"
            >
              <el-image
                  :src="community.cover"
                  class="position-absolute w-100 h-100 top-50 start-50 translate-middle"
                  fit="cover"

              >
                <div slot="error" class="image-slot">&nbsp;</div>
              </el-image>
              <div
                  class=" position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center bg-modal w-100 h-100">
                <el-button
                    circle
                    class=" position-absolute"
                    icon="el-icon-camera"
                    type="info"
                ></el-button>
              </div>
            </el-upload>
          </el-form-item>


          <el-form-item prop="description">
            <div class="text-dark fw-bold ">社群介绍</div>
            <el-input v-model="community.description"
                      :autosize="{ minRows: 2, maxRows: 8}"
                      maxlength="1000"
                      placeholder="社群介绍"
                      show-word-limit
                      type="textarea"></el-input>
          </el-form-item>
        </div>
        <div class="col">
          <el-form-item prop="joinRange">
            <div class="">
              <div class="text-dark fw-bold ">谁可以加入这个社群</div>
              <el-select v-model="community.joinRange" class="w-100">
                <el-option
                    v-for="item in communityJoinRangeEnums"
                    :key="item.value"
                    :label="item.alias"
                    :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item prop="postRange">
            <div class="">
              <div class="text-dark fw-bold ">谁可以在这个社群发布、点赞和回复</div>

              <el-select v-model="community.postRange" class="w-100">
                <el-option
                    v-for="item in communityPostRangeEnums"
                    :key="item.value"
                    :label="item.alias"
                    :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item prop="rules">
            <div class="">
              <div class="text-dark fw-bold text-start">社群规则</div>

              <div v-for="(rule,index) in community.rules"
                   :key="rule.name"
                   class="row d-flex align-items-center mt-1 mb-1">
                <div class="text-dark fw-bold col-1 "><span
                    class="rounded-circle bg-light badge text-dark fw-bold fs-6 ">{{ index + 1 }}</span></div>
                <div class="col d-flex flex-column">
                  <span class="text-dark fs-7 fw-bold lh-1">{{ rule.name }}</span>
                  <span class="text-secondary fs-7 lh-1">{{ rule.description }}</span>
                </div>
                <div class="col-2 text-end ">
                  <el-button circle class="border-0" @click="removeRule(index)"><i
                      class="bi bi-x fw-bold text-dark fs-6"/></el-button>
                </div>
              </div>
              <div>

                <el-form v-if="ruleInputVisible" ref="roleForm" :model="ruleForm" :rules="ruleFormRules"
                         class="border rounded-4 p-4"
                         label-position="top">
                  <div class="text-dark fw-bold text-start">增加新的规则</div>
                  <el-form-item class="mb-4" prop="name">
                    <el-input
                        v-model="ruleForm.name"
                        placeholder="规则名称"
                        @keyup.enter.native="handleInputConfirm"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="description">
                    <el-input
                        v-model="ruleForm.description"
                        placeholder="规则描述"
                        @keyup.enter.native="handleInputConfirm">
                    </el-input>
                  </el-form-item>
                  <el-form-item class="mt-2">
                    <el-button
                        class="fw-bold" round type="primary"
                        @click="handleInputConfirm">确定
                    </el-button>
                    <el-button
                        class="fw-bold"
                        round @click="ruleInputVisible = false">取消
                    </el-button>
                  </el-form-item>
                </el-form>

                <el-button v-else class="tag border-secondary text-dark bg-none fw-bold  border p-1"
                           round @click="ruleInputVisible=true">+ New Rule
                </el-button>
              </div>

            </div>
          </el-form-item>
          <el-form-item label="社区标签" prop="tags">
            <div>
              <el-button
                  v-for="(tag,index) in community.tags"
                  :key="tag"
                  class="tag border-secondary text-dark bg-none fw-bold  border p-1"
                  round

                  @click="removeTag(index)">

                <span> {{ tag }}</span>
                <i class="bi bi-x"/>
              </el-button>
              <el-input
                  v-if="tagInputVisible"
                  ref="tagInput"
                  v-model="tagInputValue"
                  class="input-new-tag"
                  size="small"
                  @blur="handleTagInputConfirm"
                  @keyup.enter.native="handleTagInputConfirm"
              >
              </el-input>
              <el-button v-else class="tag border-secondary text-dark bg-none fw-bold  border p-1"
                         round
                         @click="showTagInput">+ New Tag
              </el-button>

            </div>
          </el-form-item>
        </div>
      </div>


      <el-divider></el-divider>
      <el-form-item class="text-end">
        <el-button class="fw-bold" round type="primary" @click="submit">save</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {communityJoinRangeEnums, communityPostRangeEnums} from "@/enums/enums";
import ChunkFile from "@/util/uploadUtil";
import {addCommunity, updateCommunity} from "@/api/community";

export default {
  name: "NewCommunityCard",
  computed: {
    communityPostRangeEnums() {
      return communityPostRangeEnums
    },
    communityJoinRangeEnums() {
      return communityJoinRangeEnums
    }
  },
  props: {
    editCommunity: Object
  },
  data() {
    return {
      community: {
        name: '',
        description: '',
        cover: '',
        rules: [
          {
            name: 'Be kind & respectful',
            description: 'Be respectful to all the members in this community. Drama is discouraged. Discrimination (racism, sexism, etc.) in any matter is not allowed.'
          },
          {
            name: 'No spam, advertising, or self-promotion',
            description: 'No spam, advertising, or self-promotion. Spamming is not allowed. Advertising for your personal business is not allowed.'
          }
        ],
        joinRange: communityJoinRangeEnums.ANYONE.value,
        postRange: communityPostRangeEnums.MEMBER.value,
        tags: []
      },
      communityFormRules: {
        name: [{required: true, message: 'Community name is required', trigger: 'blur'}],
        cover: [{required: true, message: 'Community cover is required', trigger: 'blur'}],
        joinRange: [{required: true, message: 'Community join range is required', trigger: 'blur'}],
        postRange: [{required: true, message: 'Community post range is required', trigger: 'blur'}]
      },
      ruleInputVisible: false,
      ruleForm: {
        name: '',
        description: ''
      },
      ruleFormRules: {
        name: [{required: true, message: 'Rule name is required', trigger: 'blur'}]
      },
      ruleInputValue: {name: '', description: ''},
      tagInputVisible: false,
      tagInputValue: ''
    }
  },
  methods: {
    removeRule(index) {
      this.community.rules.splice(index, 1);
    },

    handleInputConfirm() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          let inputValue = this.ruleForm;
          if (inputValue.name) {
            this.community.rules.push(inputValue);
          }
          this.ruleInputVisible = false;
          this.ruleForm = {name: '', description: ''};
        } else {
          return false;
        }
      })

    },
    removeTag(index) {
      this.community.tags.splice(index, 1);
    },
    showTagInput() {
      this.tagInputVisible = true;

      this.$nextTick(_ => {
        this.$refs.tagInput.$refs.input.focus();
      })
    },
    handleTagInputConfirm() {
      let inputValue = this.tagInputValue;

      if (inputValue) {
        this.community.tags.push(inputValue);
      }
      this.tagInputVisible = false;
      this.tagInputValue = '';
    },
    doUpload({file}) {
      let chunkUpload = new ChunkFile(file, {
        onsuccess: (res) => {
          this.community.cover = res.data.record.url;
        },
        onerror: (res) => {
          this.$message.error(res.message);
        },
      });
      chunkUpload.start();
    },
    submit() {
      this.$refs.communityForm.validate((valid) => {
        if (valid) {
          const save = () => {
            if (this.editCommunity == null) {
              return addCommunity(this.community);
            } else {
              return updateCommunity(this.community);
            }
          }
          save().then(res => {
            if (res.code === 200) {
              this.$message.success("success");
              this.$emit('success', this.community);
              if (this.editCommunity == null) {
                Object.assign(this.$data, this.$options.data.call(this));
              }
            } else {
              this.$message.error(res.message);
            }
          })
        } else {
          return false;
        }
      })
    }
  },
  created() {
    if (this.editCommunity != null) {
      Object.assign(this.community, this.editCommunity);
    }
  }
}
</script>

<style scoped>
::v-deep .el-input__inner {
  border-radius: 6px;
}

::v-deep .el-textarea__inner {

  resize: none;
}

.tag {
  min-width: 30px;
}

.tag + .tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.container-cover-edit {
  width: 100%;
  height: 170px;
  margin-top: 10px;
  text-align: center;
}
</style>