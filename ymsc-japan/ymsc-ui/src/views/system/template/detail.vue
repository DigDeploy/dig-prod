<template>
  <div class="app-container-router">
      <el-form ref="form" :model="form" label-width="108px">
          <!--  タイトルバー  -->
          <title-bar title="基本情報" is-top>
          <el-row :gutter="10">
            <el-col :span="8">
                <el-form-item label="テンプレート名" >
                  <el-input v-model="form.templateName" placeholder="" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="テンプレート内容">
                  <editor v-model="form.templateContent" :min-height="192"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="テンプレートファイルパス" >
                  <file-upload v-model="form.templateUrl"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="説明">
                  <editor v-model="form.remark" :min-height="192"/>
                </el-form-item>
            </el-col>
          </el-row>
          </title-bar>
      </el-form>
      <div class="footer-back">
        <el-button @click="handleClose">戻る</el-button>
      </div>
  </div>
</template>

<script>
import { getTemplate} from "@/api/system/template";

export default {
  name: "TemplateDetail",
  data() {
    return {
      fromRouterPath:'',
      fromRouterQuery:'',
      // フォームパラメータ
      form: {},
    };
  },
  // 遷移元のルート情報
  beforeRouteEnter(to, from, next) {
      next(vm => {
          if(!vm.fromRouterPath) {
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

    getInfo(templateId){
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

  }
};
</script>
