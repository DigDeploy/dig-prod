<template>
  <div class="app-container-router">
      <el-form ref="form" :model="form" label-width="108px">
          <!-- タイトルバー -->
          <title-bar title="基本情報" is-top/>
          <el-row :gutter="10">
            <el-col :span="8">
                <el-form-item label="テンプレート番号" >
                  <el-input v-model="form.tmplCode" placeholder="テンプレート番号を入力してください" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="受信者" >
                  <el-input v-model="form.receiver" type="textarea" placeholder="内容を入力してください" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="Cc受信者" >
                  <el-input v-model="form.ccTo" type="textarea" placeholder="内容を入力してください" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="メールタイトル" >
                  <el-input v-model="form.title" placeholder="メールタイトルを入力してください" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="メール内容">
                  <editor v-model="form.content" :min-height="192"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="備考" >
                  <el-input v-model="form.remark" type="textarea" placeholder="内容を入力してください" />
                </el-form-item>
            </el-col>
          </el-row>

      </el-form>
      <div class="footer-back">
        <el-button @click="handleClose">戻る</el-button>
      </div>
  </div>
</template>

<script>
import { getPreview} from "@/api/emailPreview/preview";

export default {
  name: "PreviewDetail",
  dicts: ['email_status'],
  data() {
    return {
      fromRouterPath:'',
      fromRouterQuery:'',
      // フォームパラメータ
      form: {},
    };
  },
  // ルーティング遷移用（遷移元情報取得）
  beforeRouteEnter(to, from, next) {
      next(vm => {
          if(!vm.fromRouterPath) {
              vm.fromRouterPath = from.path;
              vm.fromRouterQuery = from.query;
          }
      });
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    if (id) {
      this.getInfo(id);
    }
  },

  methods: {

    getInfo(id){
      this.$modal.loading();
      getPreview(id).then(response => {
          this.form = response.data;
    }).catch((err) => console.log(err))
      .finally(() => this.$modal.closeLoading());
    },

    // 戻る・閉じる処理
    handleClose() {
      // 遷移設定
      const obj = {path: this.fromRouterPath, query: this.fromRouterQuery};
      // 現在のタブを閉じて指定タブを開く
      this.$tab.closeOpenPage(obj);
    },

  }
};
</script>