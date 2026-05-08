<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧パスワード" prop="oldPassword">
      <el-input v-model="user.oldPassword" placeholder="旧パスワードを入力してください" type="password" show-password/>
    </el-form-item>
    <el-form-item label="新しいパスワード" prop="newPassword">
      <el-input v-model="user.newPassword" placeholder="新しいパスワードを入力してください" type="password" show-password/>
    </el-form-item>
    <el-form-item label="新しいパスワード(確認用)" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="新しいパスワードを確認入力してください" type="password" show-password/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">閉じる</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("入力されたパスワードが一致しません"));
      } else {
        callback();
      }
    };
    return {
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // フォーム検証
      rules: {
        oldPassword: [
          { required: true, message: "旧パスワードを入力してください", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新しいパスワードを入力してください", trigger: "blur" },
          { min: 6, max: 20, message: "文字数は6～20文字で入力してください", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "新しいパスワード確認を入力してください", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(response => {
            this.$modal.msgSuccess("保存しました。");
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    }
  }
};
</script>
