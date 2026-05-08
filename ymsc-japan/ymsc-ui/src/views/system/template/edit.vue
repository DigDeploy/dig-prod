<template>
  <div class="app-container-router">
    <el-form ref="form" :model="form" :rules="rules" label-width="148px">
      <!--  タイトルバー  -->
      <title-bar title="基本情報" is-top>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="テンプレートコード" prop="templateCode">
            <el-input v-model="form.templateCode" maxlength="50" :disabled="true" placeholder=""/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="テンプレート名" prop="templateName">
            <el-input v-model="form.templateName" maxlength="200" placeholder=""/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="テンプレート内容" prop="templateContent">
            <el-input type="textarea" v-model="form.templateContent" maxlength="2000" :autosize="{ minRows: 15, maxRows: 15}" placeholder=""/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="説明">
            <el-input type="textarea" v-model="form.remark" maxlength="200" placeholder=""/>
          </el-form-item>
        </el-col>
      </el-row>
      </title-bar>
    </el-form>
    <div class="footer-back">
      <el-button type="primary" @click="submitForm">確定</el-button>
      <el-button @click="handleClose">戻る</el-button>
    </div>
  </div>
</template>

<script>
import {getTemplate, updateTemplate} from "@/api/system/template";

export default {
  name: "TemplateEdit",
  data() {
    return {
      fromRouterPath: '',
      fromRouterQuery: '',
      // フォームパラメータ
      form: {},
      // フォーム検証
      rules: {
        templateCode: [
          {required: true, message: "テンプレートコードを入力してください", trigger: "blur"}
        ],
        templateName: [
          {required: true, message: "テンプレート名を入力してください", trigger: "blur"}
        ],
        templateContent: [
          {required: true, message: "テンプレート内容を入力してください", trigger: "blur"}
        ],
      }
    };
  },
  // 遷移元のルート情報
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.fromRouterPath) {
        vm.fromRouterPath = from.path;
        vm.fromRouterQuery = from.query;
      }
    });
  },
  created() {
    const templateId = this.$route.params && this.$route.params.templateId;
    if (templateId) {
      this.getInfo(templateId);
    }
  },

  methods: {
    getInfo(templateId) {
      this.$modal.loading();
      getTemplate(templateId).then(response => {
        this.form = response.data;
      }).catch((err) => console.log(err))
        .finally(() => this.$modal.closeLoading());
    },

    // 戻る・閉じる
    handleClose() {
      // 遷移設定
      const obj = {path: this.fromRouterPath, query: this.fromRouterQuery};
      // 現在のタブを閉じて指定タブを開く
      this.$tab.closeOpenPage(obj);
    },

    /** 送信ボタン */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$modal.loading();
          updateTemplate(this.form).then(response => {
            this.$modal.closeLoading();
            this.$modal.msgSuccess("保存しました。");
            this.handleClose();
          }).catch((err) => console.log(err))
            .finally(() => this.$modal.closeLoading());
        }
      });
    },
  }
};
</script>
