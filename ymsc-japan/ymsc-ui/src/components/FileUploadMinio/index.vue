<template>
  <div class="upload-file">
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
      <!-- アップロードボタン -->
      <el-button size="mini" type="primary">ファイルを選択</el-button>
      <!-- アップロードヒント -->
      <div class="el-upload__tip" slot="tip" v-if="showTip">
        以下の条件を満たすファイルをアップロードしてください
        <template v-if="fileSize"> サイズが <b style="color: #f56c6c">{{ fileSize }}MB</b> を超えない </template>
        <template v-if="fileType"> 形式が <b style="color: #f56c6c">{{ fileType.join("/") }}</b> の </template>
        ファイル
      </div>
    </el-upload>

    <!-- ファイルリスト -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <li :key="file.url" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
        <el-link :href="`${baseUrl}${file.url}`" :underline="false" target="_blank">
          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link :underline="false" @click="handleDelete(index)" type="danger">削除</el-link>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  name: "FileUpload2Minio",
  props: {
    // 値
    value: [String, Object, Array],
    // 数量制限
    limit: {
      type: Number,
      default: 5,
    },
    // サイズ制限(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // ファイルタイプ、例:['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["doc","docx","xls","xlsx"],
    },
    // ヒントを表示するかどうか
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 既にアップロードした数
      number: 0,
      // 中継ファイルリスト
      uploadList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      // ファイルアップロードサーバーアドレス
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/system/tmpl/uploadFile",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      // ファイルリスト
      fileList: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          let temp = 1;
          // まず値を配列に変換
          const list = Array.isArray(val) ? val : this.value.split(',');
          // 次に配列をオブジェクト配列に変換
          this.fileList = list.map(item => {
            if (typeof item === "string") {
              item = { name: item, url: item };
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
    // ヒントを表示するかどうか
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  methods: {
    // アップロード前に形式とサイズを検証
    handleBeforeUpload(file) {
      // ファイルタイプを検証
      if (this.fileType) {
        const fileName = file.name.split('.');
        const fileExt = fileName[fileName.length - 1];
        const isTypeOk = this.fileType.indexOf(fileExt) >= 0;
        if (!isTypeOk) {
          this.$modal.msgError(`ファイル形式が正しくありません。${this.fileType.join("/")}形式のファイルをアップロードしてください！`);
          return false;
        }
      }
      // ファイルサイズを検証
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
    // ファイル数が超過した場合
    handleExceed() {
      this.$modal.msgError(`アップロードするファイルの数は${this.limit}個を超えてはなりません！`);
    },
    // アップロード失敗
    handleUploadError(err) {
      this.$modal.msgError("ファイルのアップロードに失敗しました。再試行してください");
      this.$modal.closeLoading()
    },
    // アップロード成功コールバック
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.uploadList.push({ name: res.fileName, url: res.fileName });
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.fileUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // ファイル削除
    handleDelete(index) {
      this.fileList.splice(index, 1);
      this.$emit("input", this.listToString(this.fileList));
    },
    // アップロード完了処理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.uploadList = [];
        this.number = 0;
        this.$emit("input", this.listToString(this.fileList));
        this.$modal.closeLoading();
      }
    },
    // ファイル名を取得（パスからファイル名を抽出）
    getFileName(name) {
      if (name.lastIndexOf("/") > -1) {
        return name.slice(name.lastIndexOf("/") + 1);
      } else {
        return "";
      }
    },
    // オブジェクトを指定した文字列区切りに変換
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
.upload-file-uploader {
  margin-bottom: 5px;
}
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>
