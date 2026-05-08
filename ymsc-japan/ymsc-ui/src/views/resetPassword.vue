<template>
  <div class="password-form-wrapper">
    <el-form ref="form" :model="user" :rules="rules" label-width="220px" class="password-form">
      <el-form-item label="ログインID:" prop="id">
        <span>{{userId}}</span>
      </el-form-item>
      <el-form-item label="新しいパスワード" prop="newPassword">
        <el-input v-model="user.newPassword" placeholder="パスワードを入力してください。" type="password" show-password style="width:100%"/>
      </el-form-item>
      <el-form-item label="新しいパスワード(確認用)" prop="confirmPassword" >
        <el-input v-model="user.confirmPassword" placeholder="もう一度入力してください。" type="password" show-password style="width:100%"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          @click="submit"
          :loading="submitting"
        >保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updatePassword } from "@/api/login";

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
        confirmPassword: undefined,
        username: undefined,
      },
      userId: null,
      submitting: false,

      rules: {
        newPassword: [
          { required: true, message: "パスワードを入力してください。", trigger: "blur" },
          { min: 8, max: 16, message: "文字数は8～16文字で入力してください", trigger: "blur" },
          { pattern: /^[\x21-\x7E]+$/, message: "英数記号のみ入力可能です", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "もう一度入力してください。", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.userId = this.$route.query.username;
    this.user.username = this.userId;
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submitting = true;
          updatePassword(this.user.username, this.user.newPassword)
            .then(response => {
              if (response && response.code === 200) {
                this.$modal.msgSuccess("保存しました。");
                this.handleAfterSuccess();
              } else {
                this.submitting = false;
                this.$modal.msgError(response?.msg || "更新失敗");
              }
            })
            .catch(error => {
              this.submitting = false;
              this.$modal.msgError("更新失敗: " + (error.message || "未知のエラー"));
            });
        }
      });
    },

    handleAfterSuccess() {
      this.submitting = false;

      setTimeout(() => {
        this.redirectToLogin();
      }, 1500);
    },

    redirectToLogin() {
      const loginUrl = '/login';
      try {
        window.location.replace(loginUrl);
      } catch (e) {
        try {
          window.location.href = loginUrl;
        } catch (e) {
          alert("更新成功しました。ログインページに移動してください。");
        }
      }
    }
  }
};
</script>

<style scoped>
.password-form-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.password-form {
  width: 600px;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}


.password-form .el-form-item__label {
  white-space: nowrap;
  text-align: right;
}


.password-form .el-input {
  width: 350px;
}

@media (max-width: 768px) {
  .password-form {
    width: 90%;
  }

  .password-form .el-form-item__label {
    white-space: normal;
    text-align: left;
  }

  .password-form .el-input {
    width: 100%;
  }
}
</style>
