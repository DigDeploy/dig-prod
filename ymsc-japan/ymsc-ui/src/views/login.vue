<template>
  <div class="login">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <div class="logo-container">
        <div class="text-group">
          <h3 class="title">営業支援システム</h3>
          <p class="sub-title">Sales Management System</p>
          <div class="divider-line"></div>
        </div>

        <img
          src="@/assets/images/logo.png"
          alt="logo"
          class="logo"
          style="position: absolute"
        />
      </div>

      <el-form-item prop="username" class="custom-input-item">
        <span class="input-label">ログインID</span>
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder=""
          class="custom-input"
        >
        </el-input>
      </el-form-item>

      <el-form-item prop="password" class="custom-input-item">
        <span class="input-label">パスワード</span>
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder=""
          class="custom-input"
          @keyup.enter.native="shokaiLogin"
        >
        </el-input>
      </el-form-item>

      <div style="text-align: center; margin-bottom: 15px">
        <el-checkbox v-model="loginForm.rememberMe"
          >ログイン情報を記憶する</el-checkbox
        >
      </div>

      <el-form-item
        style="width: 100%; text-align: center; margin-bottom: 10px"
      >
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 50%"
          @click.native.prevent="shokaiLogin"
        >
          <span>ログイン</span>
        </el-button>
      </el-form-item>

      <div style="text-align: center; margin-bottom: 15px">
        <a
          style="
            color: #409eff;
            text-decoration: none;
            font-size: 12px;
            cursor: pointer;
          "
          @click="openResetPasswordDialog"
        >
          パスワードをお忘れですか？
        </a>
      </div>
    </el-form>

    <el-dialog
      :title="certificationTitle"
      :visible.sync="openCertification"
      width="600px"
    >
      <div style="padding-bottom: 30px">
        {{ email }} に認証コードを送信しました。<br />
        メールを確認いただき、認証コードを入力して認証ボタンを押してください。
      </div>

      <div style="display: flex; align-items: center; margin-bottom: 20px">
        <span style="width: 80px">認証コード</span>
        <el-input
          v-model="form.authCode"
          placeholder=""
          style="width: 250px; margin-right: 130px"
          maxlength="6"
        />
        <el-button type="primary" @click="handleLogin">認証</el-button>
      </div>

      <div style="text-align: center">
        <a
          style="color: #409eff; text-decoration: none; cursor: pointer"
          @click="openResetPasswordFromCertification"
        >
          認証コード再設定
        </a>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="resetPasswordDialogVisible"
      width="480px"
      :close-on-click-modal="false"
      custom-class="reset-password-dialog"
      :show-close="false"
    >
      <div class="message-box-content">
        <div class="dialog-icon-wrapper">
          <i class="el-icon-message"></i>
        </div>

        <div class="dialog-title-row">
          <span class="message-box-title">{{ mailTitle }}</span>
        </div>

        <div class="message-content-text">
          <p>登録されたメールアドレスに設定用のリンクを送付します。</p>
          <p class="highlight-text">
            リンクを開いてパスワードの設定をおこなってください。
          </p>
        </div>
      </div>

      <div slot="footer" class="dialog-footer-buttons">
        <el-button
          type="primary"
          @click="sendResetLink"
          class="ok-button"
        >
          <i class="el-icon-check"></i>
          OK
        </el-button>
        <el-button @click="closeResetPasswordDialog" class="cancel-button">
          <i class="el-icon-close"></i>
          キャンセル
        </el-button>
      </div>
    </el-dialog>

    <div class="el-login-footer">
      <span>Copyright © 2022-2023 YMSC All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import {
  updatePwdUserBoo,
  sendEmail,
  sendPassword,
  checkIsFirstLogin,
  checkLogin,
} from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            message: "ログインIDを入力してください",
          },
        ],
        code: [
          {
            required: true,
            trigger: "change",
            message: "確認コードを入力してください",
          },
        ],
      },
      loading: false,

      register: false,
      redirect: undefined,
      certificationTitle: null,
      openCertification: false,
      email: null,
      mailTitle: "パスワードを設定します。",
      form: {
        authCode: "",
      },
      rules: {},

      resetPasswordDialogVisible: false,
      sendingResetLink: false,
      showValidationError: false,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCookie();
  },
  methods: {
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    openResetPasswordFromCertification() {
      this.$modal.loading();
      sendEmail(this.loginForm).then((response) => {
        if (response.code === 200) {
          this.certificationTitle = "第一技研 営業支援システム";
          this.$modal.msgSuccess(
            "認証コードを再送信しました。メールを確認してください。"
          );
        }
      }) .finally(() =>  this.$modal.closeLoading());
    },

    shokaiLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;

          checkIsFirstLogin(this.loginForm.username).then((response) => {
              if (response.code === 200 && response.isFirstLogin) {
                  this.mailTitle = "パスワード設定";
                  this.openResetPasswordDialog();
              } else {
                if (!this.loginForm.password) {
                  this.$modal.msgError("パスワードを入力してください。");
                  this.loading = false;
                  return;
                }
                this.email = response.email;
                checkLogin(this.loginForm).then((response) => {
                    this.certificationTitle = "第一技研 営業支援システム";
                    this.form.authCode = "";
                    sendEmail(this.loginForm).then((response) => {
                      if (response.code !== 200) {
                          this.$modal.msgError(response.msg || "送信失敗");
                      } else {
                          this.openCertification = true;
                          this.$modal.msgSuccess("送信に成功しました");
                      }
                    }).finally(() => {
                        this.loading = false;
                    });
                }).catch(() => {
                    this.loading = false;
                });
              }
            }).catch(() => {
              this.loading = false;
          });
        }
      });
    },

    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.loginForm.code = this.form.authCode;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              this.openCertification = false;
              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },

    openResetPasswordDialog() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          updatePwdUserBoo(this.loginForm.username).then((res) => {
            if (res.code == 200) {
              this.showValidationError = false;
              this.resetPasswordDialogVisible = true;
              this.$nextTick(() => {
                if (this.$refs.resetForm) {
                  this.$refs.resetForm.clearValidate();
                }
              });
            }
          }).finally(() =>this.loading = false);
        }
      });
    },

    closeResetPasswordDialog() {
      this.resetPasswordDialogVisible = false;

      this.sendingResetLink = false;
      this.showValidationError = false;
    },

    async sendResetLink() {
      this.$modal.loading();
      sendPassword(this.loginForm.username)
        .then((res) => {
          if (res.code === 200) {
            this.resetPasswordDialogVisible = false;
            this.$modal.msgSuccess("送信しました。メールを確認してください。");
          }
        }).finally(()=> this.$modal.closeLoading());
    },
    cancel() {
      this.openCertification = false;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.png");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 500px;
  padding: 5px 25px 5px 25px;
  border: 1px solid #000000;

  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.custom-input-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;

  .el-form-item__label {
    display: none !important;
    width: 0 !important;
    padding: 0 !important;
  }

  .el-form-item__content {
    width: 90%;
    margin-left: 0 !important;
    display: flex;
    align-items: center;
  }
}

.input-label {
  font-size: 16px;
  color: #333;
  white-space: nowrap;
  line-height: 1;
  text-align: left;
  min-width: 90px;
  margin-right: 15px;
  display: inline-block;
}

.custom-input-item .el-input__inner {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  height: 38px;
  line-height: 38px;
  padding: 0 15px;
  color: #333;
  transition: all 0.3s;

  &:focus {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px 0;
  box-sizing: border-box;
}
.divider-line {
  height: 1px;
  background-color: #000000;
  margin-top: 8px;
  margin-bottom: 10px;
  margin-left: -25px;
  margin-right: -25px;
}

.text-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

.title {
  margin: 0;
  text-align: left;
  color: #333333;
  font-size: 28px;
  font-weight: 900;
  white-space: nowrap;
  line-height: 1.2;
}

.sub-title {
  margin: 6px 0 0 0;
  text-align: left;
  color: #666666;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-left: 380px;
  margin-bottom: 30px;
  object-fit: contain;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}

.reset-password-dialog {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 30px 30px 15px;
  }

  .el-dialog__footer {
    padding: 0 30px 25px;
    border-top: none;
  }
}

.message-box-content {
  text-align: center;

  .dialog-icon-wrapper {
    margin-bottom: 12px;

    i {
      font-size: 36px;
      color: #409eff;
      opacity: 0.9;
    }
  }

  .dialog-title-row {
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
  }

  .message-box-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    display: block;
    letter-spacing: 0.3px;
  }

  .message-content-text {
    margin-bottom: 8px;

    p {
      margin: 8px 0;
      color: #666;
      font-size: 13px;
      line-height: 1.6;

      &.highlight-text {
        color: #409eff;
        font-weight: 500;
        margin-top: 12px;
      }
    }
  }
}

.dialog-footer-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 0;

  .el-button {
    min-width: 120px;
    height: 40px;
    padding: 10px 24px;
    font-size: 14px;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    i {
      font-size: 14px;
    }

    &.cancel-button {
      background-color: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;

      &:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
    }

    &.ok-button {
      background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
      border: none;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);

      &:hover {
        background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
        transform: translateY(-1px);
      }
    }
  }
}
</style>
