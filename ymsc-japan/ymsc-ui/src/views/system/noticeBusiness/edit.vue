<template>
  <div class="app-container-router">
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
          <!--  タイトルバー  -->
          <title-bar title="基本情報" is-top/>
          <el-row :gutter="10">
            <el-col :span="8">
            </el-col>
            <el-col :span="8">
                <el-form-item label="メッセージ内容">
                  <editor v-model="form.noticeContent" :min-height="192"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
            </el-col>
            <el-col :span="8">
                <el-form-item label="送信者ID" prop="sender">
                  <el-input v-model="form.sender" type="textarea" placeholder="" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="受信者ID" prop="receiver">
                  <el-input v-model="form.receiver" type="textarea" placeholder="" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="部署ID" prop="deptId">
                  <el-input v-model="form.deptId" placeholder="部署IDを入力してください" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="備考" prop="remark">
                  <el-input v-model="form.remark" placeholder="備考を入力してください" />
                </el-form-item>
            </el-col>
          </el-row>

      </el-form>
      <div class="footer-back">
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button @click="handleClose">戻る</el-button>
      </div>
  </div>
</template>

<script>
import { getNoticeBusiness, updateNoticeBusiness} from "@/api/system/noticeBusiness";

export default {
  name: "NoticeBusinessEdit",
  data() {
    return {
      fromRouterPath:'',
      fromRouterQuery:'',
      // フォームパラメータ
      form: {},
      // フォーム検証
      rules: {
      }
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
    const id = this.$route.params && this.$route.params.id;
    if (id) {
      this.getInfo(id);
    }
  },

  methods: {

    getInfo(id){
      this.$modal.loading();
      getNoticeBusiness(id).then(response => {
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
          updateNoticeBusiness(this.form).then(response => {
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
