<template>
    <div class="password-form-wrapper">
      <el-form ref="form" :model="user" :rules="rules" label-width="150px" class="password-form">
       <el-form-item label="ログインID:" prop="id">
            <span>XXXXXX</span>
        </el-form-item>
        <el-form-item label="新パスワード" prop="newPassword">
            <el-input v-model="user.newPassword" placeholder="新パスワードを入力してください" type="password" show-password/>
        </el-form-item>
        <el-form-item label="パスワード確認" prop="confirmPassword">
            <el-input v-model="user.confirmPassword" placeholder="新パスワードを確認入力してください" type="password" show-password/>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="mini" @click="submit">パスワードを再設定する</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
    import { updateUserPwd } from "@/api/system/user";

    export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("パスワード確認を入力してください"));
      } else if (this.user.newPassword !== value) {
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
          { required: true, message: "新パスワードを入力してください", trigger: "blur" },
          { min: 6, max: 20, message: "文字数は6～20文字で入力してください", trigger: "blur" }
        ],
        confirmPassword: [
          { validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(response => {
            this.$modal.msgSuccess("更新成功");
            // 重置表单
            this.user = {
              oldPassword: undefined,
              newPassword: undefined,
              confirmPassword: undefined
            };
            this.$refs.form.resetFields();
          }).catch(() => {
            this.$modal.msgError("更新に失敗しました");
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

<style scoped>
/* 根容器设置全局字体，覆盖所有子元素 */
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
  /* 核心：设置 MS ゴシック字体，添加兜底字体 */
  font-family: "MS Gothic", "MS ゴシック", sans-serif;
  font-size: 14px;
  /* 移除加粗 */
  font-weight: normal;
}

/* 表单容器继承字体，并覆盖Element UI默认字体 */
.password-form {
  width: 600px;   
  padding: 30px;   
  background: #fff;
  border-radius: 8px; 
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  font-family: "MS Gothic", "MS ゴシック", sans-serif;
  font-weight: normal;
}

/* 覆盖Element UI组件的默认字体和加粗样式 */
::v-deep .el-form-item__label,
::v-deep .el-input__inner,
::v-deep .el-button,
::v-deep .el-form-item__error,
::v-deep span,
::v-deep .el-button span {
  font-family: "MS Gothic", "MS ゴシック", sans-serif !important;
  /* 强制移除所有加粗 */
  font-weight: normal !important;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .password-form {
    width: 90%;
  }
}
</style>