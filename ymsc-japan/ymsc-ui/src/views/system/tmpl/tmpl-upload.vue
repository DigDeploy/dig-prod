<template>
  <el-dialog
    width="30%"
    :title="!dataForm.titleId ? 'インポート/エクスポートテンプレート新規作成' : 'インポート/エクスポートテンプレート更新'"
    :close-on-click-modal="false"
    @close="closeDialog"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px" class="tenant-dialog-form">
      <el-form-item label="コード" prop="code">
        <el-input v-model="dataForm.code" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="名前" prop="name">
        <el-input v-model="dataForm.name" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="順序" prop="tmplSort">
<!--        <el-input v-model="dataForm.tmplSort" placeholder=""></el-input>-->
        <el-input-number v-model="dataForm.tmplSort" placeholder="" :precision="0" :min="0"
                         style="width: 30%"  :controls-position="'right'"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="ファイルテンプレート">
        <span slot="label"><span class="text-danger">*</span>ファイルテンプレート</span>
        <el-upload
          ref="upload"
          :auto-upload="false"
          drag
          action
          :limit="limit"
          :http-request="upload"
          :on-exceed="handleExceed"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">ファイルをここにドラッグ＆ドロップするか、<em>クリックしてアップロード</em></div>
          <div class="el-upload__tip" slot="tip">
            <template v-if="fileType"><b style="color: #f56c6c">*</b> 形式は <b
              style="color: #f56c6c">{{ fileType.join("/") }}</b> です（ファイルは1つのみアップロード可能）
            </template>
          </div>
        </el-upload>

      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">キャンセル
      </el-button>
      <el-button size="small" type="primary" @click="dataFormSubmit()">確定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {uploadFileTemplate} from '@/api/file/tmpl'

export default {
  props: {
    // サイズ制限(MB)
    fileSize: {
      type: Number,
      default: 10,
    },
    // 数量制限
    limit: {
      type: Number,
      default: 2,
    },
    // ファイルタイプ 例: ['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      // "doc", "xls", "ppt", "txt", "pdf"
      default: () => ["doc", "docx", "xls", "xlsx"],
    },
  },
  data() {
    return {
      visible: false,
      fileList: [],
      dataForm: {
        titleId: 0,
        code: '',
        name: '',
        status: 1,
        tmplSort:0
      },
      dataRule: {
        code: [
          {required: true, message: 'テンプレートコードを入力してください', trigger: 'blur'}
        ],
        name: [
          {required: true, message: 'テンプレート名を入力してください', trigger: 'blur'}
        ]
      },
    }
  },
  created() {
    let dataForm = this.dataForm
  },
  methods: {
    handleExceed(files, fileList) {
      this.$modal.msgWarning(`現在選択上限は ${this.limit} ファイルで、今回 ${files.length} ファイルを選択し、合計 ${files.length + fileList.length} ファイルを選択しました`);
    },
    upload(obj) {
      // ファイルサイズ検証
      if (this.fileSize) {
        const isLt = obj.file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`アップロードファイルサイズは ${this.fileSize} MBを超えることができません！`);
          return false;
        }
      }
      // ファイルタイプ検証
      if (this.fileType) {
        const fileName = obj.file.name.split('.');
        const fileExt = fileName[fileName.length - 1];
        const isTypeOk = this.fileType.indexOf(fileExt) >= 0;
        if (!isTypeOk) {
          this.$modal.msgError(`ファイル形式が正しくありません。${this.fileType.join("/")}形式のファイルをアップロードしてください！`);
          return false;
        }
      }
      var that = this
      let id = that.dataForm.titleId
      let formData = new FormData()
      formData.set('id', id)
      formData.set('file', obj.file)
      formData.set('tmplCode', this.dataForm.code)
      formData.set('tmplName', this.dataForm.name)
      formData.set('sort', this.dataForm.tmplSort)
      uploadFileTemplate(formData).then(data => {
        if (data.code === 200) {
          this.$refs.upload.clearFiles();
          this.$modal.msgSuccess('投稿成功');
          this.visible = false;
          this.$emit('refreshDataList');
        }
      })
    },
    init(id, code, name,tmplSort) {
      this.dataForm.titleId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.titleId) {
          this.dataForm.code = code
          this.dataForm.name = name
          this.dataForm.tmplSort = tmplSort
        }
      })
    },
    closeDialog() {
      this.$refs.upload.clearFiles()
    },
    // フォーム送信
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let file = this.$refs.upload.uploadFiles
          if (file.length>0){
            this.$refs.upload.submit();
          }else {
            this.$modal.msgError("テンプレートファイルをアップロードしてください")
            return
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.el-dialog__body {
  .tenant-dialog-form {
    width: 90%;
  }

  .el-upload-dragger, .el-upload {
    width: 100%;
  }
}
</style>