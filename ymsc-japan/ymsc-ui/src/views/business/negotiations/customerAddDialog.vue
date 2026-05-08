<template>
  <el-dialog
    title="得意先登録"
    :visible.sync="visible"
    width="1200px"
    style="overflow: hidden"
    append-to-body
    :before-close="handleClose"
  >
    <div
      style="
        max-height: calc(95vh - 220px);
        overflow-y: auto;
        padding-right: 10px;
      "
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <title-bar title="得意先登録" is-top>
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="得意先番号" prop="customerNo">
                <el-input
                  v-model="form.customerNo"
                  placeholder=""
                  show-word-limit
                  maxlength="6"
                  @input="form.customerNo = form.customerNo.replace(/[^0-9]/g, '')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-button
                type="primary"
                :disabled="!form.customerNo"
                style="flex: 1; margin: 0"
                @click="checkGetData"
                >一覧呼び出し・検索</el-button
              >
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="予実得意先番号" prop="yushiNo">
                <el-input
                  v-model="form.yushiNo"
                  placeholder=""
                  show-word-limit
                  maxlength="8"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <div style="display: flex; gap: 0; width: 99%">
                <el-form-item label="有効期限開始" prop="expDateStart">
                  <el-date-picker
                    clearable
                    v-model="form.expDateStart"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="YYYY-MM-DD"
                    style="width: 160px"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item
                  label="有効期限終了"
                  prop="expDateEnd"
                  label-width="120px"
                  style="flex: 15"
                >
                  <el-date-picker
                    clearable
                    v-model="form.expDateEnd"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="YYYY-MM-DD"
                    style="width: 160px"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="16">
              <el-form-item label="名称" prop="customerName">
                <el-input
                  v-model="form.customerName"
                  placeholder=""
                  show-word-limit
                  maxlength="60"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="略名" prop="cusNameShort">
                <el-input
                  v-model="form.cusNameShort"
                  placeholder=""
                  show-word-limit
                  maxlength="20"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <div style="display: flex; gap: 0; ">
                <el-form-item label="郵便番号" prop="zipcode1" style="flex: 7">
                  <el-input
                    v-model="form.zipcode1"
                    placeholder=""
                    show-word-limit
                    maxlength="3"
                    @input="form.zipcode1 = form.zipcode1.replace(/[^0-9]/g, '')"
                  />
                </el-form-item>
                <el-form-item
                  label=""
                  label-width="10px"
                  prop="zipcode2"
                  style="flex: 5"
                >
                  <el-input
                    v-model="form.zipcode2"
                    placeholder=""
                    show-word-limit
                    maxlength="4"
                    @input="form.zipcode2 = form.zipcode2.replace(/[^0-9]/g, '')"
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="16 ">
              <el-form-item label="住所" prop="address">
                <el-input
                  v-model="form.address"
                  placeholder=""
                  show-word-limit
                  maxlength="60"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="電話番号" prop="customerTel">
                <el-input
                  v-model="form.customerTel"
                  placeholder=""
                  show-word-limit
                  maxlength="17"
                  @input="form.customerTel = form.customerTel.replace(/[^0-9]/g, '')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                label="FAX番号"
                prop="customerFax"
                label-width="120px"
              >
                <el-input
                  v-model="form.customerFax"
                  placeholder=""
                  show-word-limit
                  maxlength="17"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <div style="display: flex; gap: 0; width: 99%">
                <el-form-item
                  label="課（社内の場合）"
                  prop="customerDept1"
                >
                  <el-input
                    v-model="form.customerDept1"
                    placeholder=""
                    show-word-limit
                    maxlength="8"
                  />
                </el-form-item>
                <el-form-item
                  label=""
                  label-width="10px"
                  prop="customerDept2"
                >
                  <el-input
                    v-model="form.customerDept2"
                    placeholder=""
                    show-word-limit
                    maxlength="8"
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="インボイス番号" prop="invoiceNum">
                <el-input
                  v-model="form.invoiceNum"
                  placeholder=""
                  show-word-limit
                  maxlength="20"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="16">
              <el-form-item label="事業所部署名" prop="deptName">
                <el-input
                  v-model="form.deptName"
                  placeholder=""
                  show-word-limit
                  maxlength="60"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <div style="display: flex; gap: 0; width: 99%">
                <el-form-item
                  label="事業所郵便番号"
                  prop="deptZip1"
                  style="flex: 7"
                >
                  <el-input
                    v-model="form.deptZip1"
                    placeholder=""
                    show-word-limit
                    maxlength="3"
                    @input="form.deptZip1 = form.deptZip1.replace(/[^0-9]/g, '')"
                  />
                </el-form-item>
                <el-form-item
                  label=""
                  label-width="10px"
                  prop="deptZip2"
                  style="flex: 5"
                >
                  <el-input
                    v-model="form.deptZip2"
                    placeholder=""
                    show-word-limit
                    maxlength="4"
                    @input="form.deptZip2 = form.deptZip2.replace(/[^0-9]/g, '')"
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="16">
              <el-form-item label="事業所住所" prop="deptAddr">
                <el-input
                  v-model="form.deptAddr"
                  placeholder=""
                  show-word-limit
                  maxlength="60"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="社内区分" prop="inhouseClass">
                <el-select
                  v-model="form.inhouseClass"
                  placeholder=""
                  style="width: 100%"
                >
                  <el-option
                    v-for="dict in dict.type.customer_inhouse_class"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="海外区分" prop="foreignTradeClass">
                <el-select
                  v-model="form.foreignTradeClass"
                  placeholder=""
                  style="width: 100%"
                >
                  <el-option
                    v-for="dict in dict.type.customer_foreign_trade_class"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </title-bar>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">登録</el-button>
      <el-button @click="handleClose">キャンセル</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addInfo, getInfo } from "@/api/business/customerInfo";

export default {
  name: "CustomerAddDialog",
  dicts: [
    "sys_user_sex",
    "customer_inhouse_class",
    "customer_foreign_trade_class",
  ],
  data() {
    const validateExpDateEnd = (rule, value, callback) => {
      const startDate = this.form.expDateStart;
      const endDate = value;
      if (startDate && endDate) {
        const startTime = new Date(startDate).getTime();
        const endTime = new Date(endDate).getTime();
        if (endTime < startTime) {
          callback(new Error("限終了は開始時間より大きくなれません"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      visible: false,
      // フォームデータ
      form: {},
      // フォーム検証ルール
      rules: {
        yushiNo: [
          {
            max: 8,
            message: "は8文字以内で入力してください",
            trigger: "submit",
          },
        ],
        customerName: [
          { required: true, message: "名称は必須です", trigger: "blur" },
          {
            max: 60,
            message: "は60文字以内で入力してください",
            trigger: "submit",
          },
        ],
        expDateStart: [
          {
            required: true,
            message: "有効期限開始は必須です",
            trigger: "blur",
          },
        ],
        expDateEnd: [
          {
            required: true,
            message: "有効期限終了は必須です",
            trigger: "blur",
          },
          { validator: validateExpDateEnd, trigger: "submit" },
        ],
        cusNameShort: [
          { required: true, message: "略名は必須です", trigger: "blur" },
          {
            max: 20,
            message: "は20文字以内で入力してください",
            trigger: "submit",
          },
        ],
        inhouseClass: [
          { required: true, message: "社内区分は必須です", trigger: "change" },
        ],
        foreignTradeClass: [
          { required: true, message: "海外区分は必須です", trigger: "change" },
        ],
        zipcode1: [
          {
            max: 3,
            message: "は3文字以内で入力してください",
            trigger: "submit",
          },
        ],
        zipcode2: [
          {
            max: 4,
            message: "は4文字以内で入力してください",
            trigger: "submit",
          },
        ],
        address: [
          {
            max: 60,
            message: "は60文字以内で入力してください",
            trigger: "submit",
          },
        ],
        customerTel: [
          {
            max: 17,
            message: "は17文字以内で入力してください",
            trigger: "submit",
          },
        ],
        customerFax: [
          {
            max: 17,
            message: "は17文字以内で入力してください",
            trigger: "submit",
          },
        ],
        customerDept1: [
          {
            max: 8,
            message: "は8文字以内で入力してください",
            trigger: "submit",
          },
        ],
        customerDept2: [
          {
            max: 8,
            message: "は8文字以内で入力してください",
            trigger: "submit",
          },
        ],
        invoiceNum: [
          {
            max: 20,
            message: "は20文字以内で入力してください",
            trigger: "submit",
          },
        ],
        deptName: [
          {
            max: 60,
            message: "は60文字以内で入力してください",
            trigger: "submit",
          },
        ],
        deptZip1: [
          {
            max: 3,
            message: "は3文字以内で入力してください",
            trigger: "submit",
          },
        ],
        deptZip2: [
          {
            max: 4,
            message: "は4文字以内で入力してください",
            trigger: "submit",
          },
        ],
        deptAddr: [
          {
            max: 60,
            message: "は60文字以内で入力してください",
            trigger: "submit",
          },
        ],
      },
    };
  },
  methods: {
    open() {
      this.visible = true;
      this.form = {};
    },
    handleClose() {
      this.visible = false;
      this.form = {};
    },
    checkGetData() {
      const customerNo = this.form.customerNo;
      if (customerNo) {
        getInfo(customerNo).then((response) => {
          if (response.data != null) {
            this.form = response.data;
            this.form.zipcode1 = response.data.zipcode.split("-")[0];
            this.form.zipcode2 = response.data.zipcode.split("-")[1];
            this.form.customerDept1 = response.data.customerDept.split("-")[0];
            this.form.customerDept2 = response.data.customerDept.split("-")[1];
            this.form.deptZip1 = response.data.deptZip.split("-")[0];
            this.form.deptZip2 = response.data.deptZip.split("-")[1];
          } else {
              this.$modal.msgError("得意先番号" + customerNo + "に該当する得意先は見つかりませんでした。");
          }
        }).catch((err) => console.log(err));
      }
    },
    submitForm() {
      const deptZipStr = (this.form.deptZip1 == undefined ? "" : this.form.deptZip1) + "-" + (this.form.deptZip2 == undefined ? "" : this.form.deptZip2);
      const customerDeptStr = (this.form.customerDept1 == undefined ? "" : this.form.customerDept1) + "-" + (this.form.customerDept2 == undefined ? "" : this.form.customerDept2);
      const zipcodeStr = (this.form.zipcode1 == undefined ? "" : this.form.zipcode1) + "-" + (this.form.zipcode2 == undefined ? "" : this.form.zipcode2);

      this.form.deptZip = deptZipStr == "-" ? null : deptZipStr;
      this.form.customerDept = customerDeptStr == "-" ? null : customerDeptStr;
      this.form.zipcode = zipcodeStr == "-" ? null : zipcodeStr;

      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$modal.loading();
          addInfo(this.form)
            .then((response) => {
              this.$modal.msgSuccess("登録しました。");
              // 登录成功后，通过事件回调将得意先信息传递回父组件
              // 确保得意先番号被正确传递，即使接口没有返回
              const customerData = response.data || {};
              // 如果接口返回的数据中没有得意先番号，则使用表单中的得意先番号
              if (!customerData.customerNo && this.form.customerNo) {
                customerData.customerNo = this.form.customerNo;
              }
              // 确保得意先名称也被正确传递
              if (!customerData.customerName && this.form.customerName) {
                customerData.customerName = this.form.customerName;
              }
              this.$emit("callback", customerData);
              this.handleClose();
            })
            .catch((err) => console.log(err))
            .finally(() => this.$modal.closeLoading());
        }
      });
    },
  },
};
</script>

<style scoped>
.footer-back {
  text-align: right;
  padding-top: 20px;
}
</style>
