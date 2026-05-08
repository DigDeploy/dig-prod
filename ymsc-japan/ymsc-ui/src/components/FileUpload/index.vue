 <template>
  <div class="upload-file">
    <div class="upload-row">
      <el-upload
        multiple
        :action="uploadFileUrl"
        :before-upload="handleBeforeUpload"
        :file-list="fileList"
        :limit="limit"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        :on-success="handleUploadSuccess"
        :show-file-list="false"
        :headers="headers"
        class="upload-file-uploader"
        ref="fileUpload"
      >
        <el-tooltip
          :content="tooltipContent"
          placement="top"
          effect="dark"
          :enter-delay="500"
        >
          <el-button style="margin-left: 30px" type="primary" :disabled="mode ==='view'">{{title}}</el-button>
        </el-tooltip>
        <div class="el-upload__tip" slot="tip" v-if="showTip">
          以下の条件を満たすファイルをアップロードしてください
          <template v-if="fileSize"> サイズが <b style="color: #f56c6c">{{ fileSize }}MB</b> を超えてはなりません！</template>
          <template v-if="fileType"> 形式が <b style="color: #f56c6c">{{ fileType.join("/") }}</b> の</template>
          ファイル
        </div>
      </el-upload>

      <div v-if="fileList.length > 0" class="first-file-wrapper">
        <li class="el-upload-list__item ele-upload-list__item-content">
          <el-link :href="`${baseUrl}${fileList[0].url}`" :underline="false" target="danger">
            <span class="el-icon-document"> {{ getFileName(fileList[0].name) }} </span>
          </el-link>
          <div class="ele-upload-list__item-content-action">
            <el-link :underline="false" @click="handleDelete(0)" type="danger">削除</el-link>
          </div>
        </li>
      </div>
    </div>

    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <li :key="file.url" class="el-upload-list__item ele-upload-list__item-content"
          v-for="(file, index) in fileList.slice(1)">
        <el-link :href="`${baseUrl}${file.url}`" :underline="false" target="_blank">
          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link :underline="false" @click="handleDelete(index + 1)" type="danger">削除</el-link>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
    import {getToken} from "@/utils/auth";

    export default {
        name: "FileUpload",
        props: {
            value: [String, Object, Array],
            limit: {
                type: Number,
                default: 10,
            },
            fileSize: {
                type: Number,
                default: 100,
            },
            fileType: {
                type: Array,
                // default: () => ["doc", "xls", "ppt", "txt", "pdf"],
            },
            isShowTip: {
                type: Boolean,
                default: true
            },
            title: {
                type: String,
                default: 'ファイルを選択'
            },
            mode: {
                type: String,
                default: 'edit',
                validator: function(value) {
                    return ['edit', 'view'].indexOf(value) !== -1;
                }
            }
        },
        data() {
            return {
                number: 0,
                uploadList: [],
                baseUrl: process.env.VUE_APP_BASE_API,
                uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload",
                headers: {
                    Authorization: "Bearer " + getToken(),
                },
                fileList: [],
            };
        },
        watch: {
            value: {
                handler(val) {
                    if (val) {
                        let temp = 1;
                        const list = Array.isArray(val) ? val : this.value.split(',');
                        this.fileList = list.map(item => {
                            if (typeof item === "string") {
                                item = {name: item, url: item};
                            }
                            item.uid = item.uid || new Date().getTime() + temp++;
                            return item;
                        });
                    } else {
                        this.fileList = [];
                        return [];
                    }
                },
                deep: true,
                immediate: true
            }
        },
        computed: {
            showTip() {
                return this.isShowTip && (this.fileType || this.fileSize);
            },
            tooltipContent() {
                let content = '以下の条件を満たすファイルをアップロードしてください'
                if (this.fileSize) {
                    content += '\nサイズが ' + this.fileSize + 'MB を超えない'
                }
                if (this.fileType && this.fileType.length > 0) {
                    content += '\n形式が ' + this.fileType.join('/') + ' のファイル'
                }
                return content
            }
        },
        methods: {
            handleBeforeUpload(file) {
                if (this.fileSize) {
                    const isLt = file.size / 1024 / 1024 < this.fileSize;
                    if (!isLt) {
                        this.$modal.msgError(`アップロードするファイルのサイズは${this.fileSize} MBを超えてはなりません！`);
                        return false;
                    }
                }
                this.$modal.loading("ファイルをアップロード中です。しばらくお待ちください...");
                this.number++;
                return true;
            },
            handleExceed() {
                this.$modal.msgError(`アップロードするファイルの数は${this.limit}個を超えてはなりません！`);
            },
            handleUploadError(err) {
                this.$modal.msgError("ファイルのアップロードに失敗しました。再試行してください");
                this.$modal.closeLoading()
            },
            handleUploadSuccess(res, file) {
                if (res.code === 200) {
                    this.uploadList.push({name: res.fileName, url: res.fileName});
                    this.uploadedSuccessfully();
                } else {
                    this.number--;
                    this.$modal.closeLoading();
                    this.$modal.msgError(res.msg);
                    this.$refs.fileUpload.handleRemove(file);
                    this.uploadedSuccessfully();
                }
            },
            handleDelete(index) {
                this.fileList.splice(index, 1);
                this.$emit("input", this.listToString(this.fileList));
            },
            uploadedSuccessfully() {
                if (this.number > 0 && this.uploadList.length === this.number) {
                    this.fileList = this.fileList.concat(this.uploadList);
                    this.uploadList = [];
                    this.number = 0;
                    this.$emit("input", this.listToString(this.fileList));
                    this.$modal.closeLoading();
                }
            },
            getFileName(name) {
                if (name.lastIndexOf("/") > -1) {
                    return name.slice(name.lastIndexOf("/") + 1);
                } else {
                    return "";
                }
            },
            listToString(list, separator) {
                let strs = "";
                separator = separator || ",";
                for (let i in list) {
                    strs += list[i].url + separator;
                }
                return strs !== '' ? strs.substr(0, strs.length - 1) : '';
            }
        }
    };
</script>

<style scoped lang="scss">
  .upload-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }

  .upload-file-uploader {
    flex-shrink: 0;
  }

  .first-file-wrapper {
    flex: 1;
    min-width: 280px;
  }

  .first-file-wrapper .el-upload-list__item {
    margin: 0;
    border: 1px solid #e4e7ed;
    line-height: 2;
    position: relative;
    padding: 0 10px;
  }

  .first-file-wrapper .ele-upload-list__item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: inherit;
  }

  .upload-file-list {
    margin-left: calc(120px + 20px);
  }

  .upload-file-list .el-upload-list__item {
    border: 1px solid #e4e7ed;
    line-height: 2;
    margin-bottom: 10px;
    position: relative;
    padding: 0 10px;
  }

  .upload-file-list .ele-upload-list__item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: inherit;
  }

  .ele-upload-list__item-content-action .el-link {
    margin-right: 0;
  }

  @media (max-width: 768px) {
    .upload-row {
      flex-wrap: wrap;
    }

    .first-file-wrapper {
      width: 100%;
      min-width: auto;
    }

    .upload-file-list {
      margin-left: 0;
    }
  }
</style>
