<template>
  <el-dialog
    :visible.sync="visible"
    title="添付ファイルアップロード"
    width="600px"
    append-to-body
    :before-close="handleClose"
  >
    <div class="upload-file">
      <el-upload
        :ref="refNodes.upload"
        :action="uploadFileUrl"
        :before-upload="handleBeforeUpload"
        :file-list="fileList"
        :limit="limit"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        :on-success="handleUploadSuccess"
        :show-file-list="false"
        :headers="headers"
        drag
        multiple
        class="upload-file-uploader"
      >

        <!-- アップロードエリア -->
        <div class="el-upload-dragger">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">ファイルをここにドラッグするか、<em>クリックしてアップロード</em></div>
        </div>

        <!-- アップロードヒント -->
        <div class="el-upload__tip" slot="tip" v-if="showTip">
          以下の条件を満たすファイルをアップロードしてください
          <template v-if="fileSize">
            サイズが <b style="color: #f56c6c">{{ fileSize }}MB</b> を超えない
          </template>
<!--          <template v-if="fileType">-->
<!--            形式が <b style="color: #f56c6c">{{ fileType.join("/") }}</b> の-->
<!--          </template>-->
          ファイル
        </div>
      </el-upload>

      <!-- ファイルリスト -->
      <transition-group
        class="upload-file-list el-upload-list el-upload-list--text"
        name="el-fade-in-linear"
        tag="ul"
      >
        <li
          class="el-upload-list__item ele-upload-list__item-content"
          v-for="(file, index) in fileList"
          :key="uploadFileRowKey(file)"
        >
          <el-link @click="downFile(file)" :underline="false" target="_blank">
            <span class="el-icon-document"> {{ file.name }} </span>
          </el-link>
          <div class="ele-upload-list__item-content-action">
            <el-link
              :underline="false"
              @click="handleDelete(index)"
              type="danger"
            >削除
            </el-link>
          </div>
        </li>
      </transition-group>
    </div>

    <!-- dialog フッター -->
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        :disabled="!fileList.length"
        @click="handleSubmit"
      >確定
      </el-button>
      <el-button @click="handleClose">閉じる</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  name: "UploadFile",
  props: {
    // 表示状態
    visible: {
      type: Boolean,
      default: false,
    },
    // 数量制限
    limit: {
      type: Number,
      default: 9,
    },
    // サイズ制限(MB)
    fileSize: {
      type: Number,
      default: 100,
    },
    // ファイルタイプ、例:['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["doc", "xls", 'xlsx', "ppt", "txt", "pdf"],
    },
    // ヒントを表示するかどうか
    isShowTip: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      // refノード
      refNodes: {
        form: "form_" + Math.random() + new Date().getTime().toString(32).slice(0, 8),
        upload: "upload_" + Math.random() + new Date().getTime().toString(32).slice(0, 8),
      },

      // 基本データ
      baseInfo: {
        id: null,
        name: null,
        url: null,
        size: null,
        description: null,
        userName: this.loginUserName || this.$store.getters.nickName,
      },

      // 既にアップロードした数
      number: 0,
      // ファイルリスト
      fileList: [],
      // 中継ファイルリスト
      uploadList: [],
      // 接口
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/mfFile/upload", // ファイルアップロードサーバーアドレス
      // headers
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    };
  },

  /** 計算プロパティ */
  computed: {
    // ヒントを表示するかどうか
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },

    // 現在ログインしているユーザー名
    loginUserName() {
      return this.$store.getters.nickName;
    },
  },

  /** メソッド関数 */
  methods: {
    downFile(file) {
      this.$download.downloadAs(file.url, file.name);
    },
    /** ------------- 業務処理 ------------- */
    // アップロード成功コールバック
    handleUploadSuccess(res, file) {
      // 成功
      if (res.code === 200) {
        // コールバック情報を処理し、ファイルリストに保存
        this.uploadList.push(this.handleUploadResult(res, file));
        // アップロード完了処理
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs[this.refNodes.upload].handleRemove(file);
        this.uploadedSuccessfully();
      }
    },

    // アップロード完了処理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.uploadList = [];
        this.number = 0;
        this.$modal.closeLoading();
      }
    },

    // アップロード失敗
    handleUploadError(err) {
      this.$modal.msgError("ファイルのアップロードに失敗しました。再試行してください");
      this.$modal.closeLoading();
    },

    // ファイル削除
    handleDelete(index) {
      this.fileList.splice(index, 1);
    },

    // 確定
    handleSubmit() {
      // ファイルが存在しない場合
      if (!this.fileList.length) {
        // 警告メッセージ
        this.$modal.msgWarning("ファイルをアップロードしてください！");
        // 終了
        return;
      }

      // コピー
      let callback = _.cloneDeep(this.fileList);
      // 戻り値
      this.$emit("callback", callback);
      // 閉じる
      this.handleClose(true);
    },

    /** ------------- ファイル検証 ------------- */

    // アップロード前に形式とサイズを検証
    handleBeforeUpload(file) {
      // ファイルタイプを検証
      // if (this.fileType) {
      //   const fileName = file.name.split(".");
      //   const fileExt = fileName[fileName.length - 1];
      //   const isTypeOk = this.fileType.indexOf(fileExt) >= 0;
      //   if (!isTypeOk) {
      //     this.$modal.msgError(
      //       `ファイル形式が正しくありません。${this.fileType.join("/")}形式のファイルをアップロードしてください！`
      //     );
      //     return false;
      //   }
      // }

      // ファイルサイズを検証
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`アップロードするファイルのサイズは${this.fileSize} MBを超えてはなりません！`);
          return false;
        }
      }

      // 検証通過
      this.$modal.loading("ファイルをアップロード中です。しばらくお待ちください...");
      this.number++;
      return true;
    },

    // ファイル数が超過した場合
    handleExceed() {
      this.$modal.msgError(`アップロードするファイルの数は${this.limit}個を超えてはなりません！`);
    },

    /** ------------- データ処理 ------------- */
    // ファイル名を取得
    getFileName(resData) {
      // 名前
      let name = resData.dummyName || resData.url;
      // URLの場合、ファイル名を抽出
      name.lastIndexOf("/") > -1 && name.slice(name.lastIndexOf("/") + 1);
      // 戻り値
      return name;
    },

    // アップロード成功情報処理
    handleUploadResult(res, file) {

      // サイズをMに変換
      let size = file.size / (1024 * 1024);
      // 単位換算
      size = size < 1 ? (size * 1024).toFixed(2) + 'KB' : size.toFixed(2) + 'M';

      // データ統合
      return Object.assign(res.data, {
        id: null,
        name: file.name,
        currentName: this.getFileName(res.data),
        size: size,
        description: null,
        userName: this.loginUserName || this.$store.getters.nickName,
        // 操作に使用する一意識別子を追加
        uniqueKey: `upload-apply-file_${Math.random().toString(36).substr(3, 10)}`
      });
    },

    /** ------------- 基本メソッド ------------- */
    // 戻る・閉じる
    handleClose(submit) {
      // DOM描画完了
      this.$nextTick(() => {
        // ダイアログを閉じる
        this.$emit("update:visible", false);
        // ファイルをクリア
        this.$refs[this.refNodes.upload].clearFiles();
        this.fileList = [];
      });
    },

    // アップロードファイルリストrowKey
    uploadFileRowKey(row) {
      return row.uniqueKey || '' + "_" + row.name;
    },

  },
};
</script>

<style scoped lang="scss">
::v-deep .el-upload-dragger {
  width: 560px;
}

::v-deep .upload-file-uploader {
  margin-bottom: 5px;
}

::v-deep .upload-file-list {
  max-height: 210px;
  overflow: auto;
}

::v-deep .upload-file-list::-webkit-scrollbar {
  display: none
}

::v-deep.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}

::v-deep .upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

::v-deep .ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}

::v-deep.file-description-textarea {
  width: 100%;
}
</style>
