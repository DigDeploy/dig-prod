<template>
  <div class="app-container-router">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <!-- タイトルバー -->
      <title-bar title="得意先登録" is-top style="padding-top:5px">
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="得意先番号" prop="customerNo">
              <el-input v-model="form.customerNo" placeholder="" show-word-limit maxlength="6" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-button type="primary" style="flex: 1; margin: 0;" @click="checkGetData" disabled>一覧呼び出し・検索</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="予実得意先番号" prop="yushiNo">
              <el-input v-model="form.yushiNo" placeholder="" show-word-limit maxlength="8"
                        @input="form.yushiNo = form.yushiNo.replace(/[^a-zA-Z0-9]/g, '')"/>
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
              <el-input v-model="form.customerName" placeholder="" show-word-limit maxlength="60"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="略名" prop="cusNameShort">
              <el-input v-model="form.cusNameShort" placeholder="" show-word-limit maxlength="20"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <div style="display: flex; gap: 0; ">
              <el-form-item label="郵便番号" prop="zipcode1" style="flex: 7">
                <el-input v-model="form.zipcode1" placeholder="" show-word-limit maxlength="3"
                          @input="form.zipcode1 = form.zipcode1.replace(/[^0-9]/g, '')"/>
              </el-form-item>
              <el-form-item label="" label-width="10px" prop="zipcode2" style="flex: 5">
                <el-input v-model="form.zipcode2" placeholder="" show-word-limit maxlength="4"
                          @input="form.zipcode2 = form.zipcode2.replace(/[^0-9]/g, '')"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16 ">
            <el-form-item label="住所" prop="address">
              <el-input v-model="form.address" placeholder="" show-word-limit maxlength="60"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="電話番号" prop="customerTel">
              <el-input v-model="form.customerTel" placeholder="" show-word-limit maxlength="17"
                        @input="form.customerTel = form.customerTel.replace(/[^0-9]/g, '')"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="FAX番号" prop="customerFax" label-width="120px">
              <el-input v-model="form.customerFax" placeholder="" show-word-limit maxlength="17"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="10">
            <div style="display: flex; gap: 0; width: 99%">
              <el-form-item label="課（社内の場合）" prop="customerDept1">
                <el-input v-model="form.customerDept1" placeholder="" show-word-limit maxlength="8"/>
              </el-form-item>
              <el-form-item label="" label-width="10px" prop="customerDept2">
                <el-input v-model="form.customerDept2" placeholder="" show-word-limit maxlength="8"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="インボイス番号" prop="invoiceNum">
              <el-input v-model="form.invoiceNum" placeholder="" show-word-limit maxlength="20"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="事業所部署名" prop="deptName">
              <el-input v-model="form.deptName" placeholder="" show-word-limit maxlength="60"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <div style="display: flex; gap: 0; width: 99%">
              <el-form-item label="事業所郵便番号" prop="deptZip1" style="flex: 7">
                <el-input v-model="form.deptZip1" placeholder="" show-word-limit maxlength="3"
                          @input="form.deptZip1 = form.deptZip1.replace(/[^0-9]/g, '')"/>
              </el-form-item>
              <el-form-item label="" label-width="10px" prop="deptZip2" style="flex: 5">
                <el-input v-model="form.deptZip2" placeholder="" show-word-limit maxlength="4"
                          @input="form.deptZip2 = form.deptZip2.replace(/[^0-9]/g, '')"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="事業所住所" prop="deptAddr">
              <el-input v-model="form.deptAddr" placeholder="" show-word-limit maxlength="60"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="社内区分" prop="inhouseClass">
              <el-select v-model="form.inhouseClass" placeholder="" style="width: 100%;">
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
              <el-select v-model="form.foreignTradeClass" placeholder="" style="width: 100%;">
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
        <!-- <el-col :span="8">
                <el-form-item label="従業員" prop="contName">
                    <el-input v-model="form.contName" placeholder="従業員を入力してください" />
                </el-form-item>
        </el-col>
        <el-col :span="8">
                <el-form-item label="資本金" prop="capital">
                    <el-input v-model="form.capital" placeholder="資本金を入力してください" />
                </el-form-item>
        </el-col>
        <el-col :span="8">
                <el-form-item label="Webサイト" prop="webUrl">
                    <el-input v-model="form.webUrl" placeholder="Webサイトを入力してください" />
                </el-form-item>
        </el-col>
        <el-col :span="8">
                <el-form-item label="ランク" prop="rank">
                    <el-input v-model="form.rank" placeholder="ランクを入力してください" />
                </el-form-item>
        </el-col>
        <el-col :span="8">
        </el-col>
        <el-col :span="8">
                <el-form-item label="取引開始日" prop="transDate">
                    <el-date-picker clearable
                                    v-model="form.transDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="取引開始日を選択してください">
                    </el-date-picker>
                </el-form-item>
        </el-col> -->
      </title-bar>

    </el-form>
    <div class="footer-back">
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button @click="handleClose">戻る</el-button>
    </div>
  </div>
</template>


<script>
    import {getInfo, updateInfo} from "@/api/business/customerInfo";

    export default {
        name: "InfoEdit",
        dicts: ['sys_user_sex', 'customer_inhouse_class', 'customer_foreign_trade_class'],
        data() {
            const validateExpDateEnd = (rule, value, callback) => {
                const startDate = this.form.expDateStart;
                const endDate = value;
                if (startDate && endDate) {
                    const startTime = new Date(startDate).getTime();
                    const endTime = new Date(endDate).getTime();
                    if (endTime < startTime) {
                        callback(new Error('限終了は開始時間より大きくなれません'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
                selectYushiNo: '',
                fromRouterPath: '',
                fromRouterQuery: '',
                // フォームデータ
                form: {},
                hasUnsavedChanges: false,
                getInfoFlag: false,
                // フォーム検証ルール
                rules: {
                    // customerNo: [
                    //     { max: 6, message: 'は6文字以内で入力してください', trigger: 'blur' }
                    // ],
                    yushiNo: [
                        {max: 8, message: 'は8文字以内で入力してください', trigger: 'blur'}
                    ],
                    customerName: [
                        {required: true, message: '名称は必須です', trigger: 'blur'},
                        {max: 60, message: 'は60文字以内で入力してください', trigger: 'blur'}
                    ],
                    expDateStart: [
                        {required: true, message: '有効期限開始は必須です', trigger: 'blur'},
                    ],
                    expDateEnd: [
                        {required: true, message: '有効期限終了は必須です', trigger: 'blur'},
                        {validator: validateExpDateEnd, trigger: 'blur'}
                    ],
                    cusNameShort: [
                        {required: true, message: '略名は必須です', trigger: 'blur'},
                        {max: 20, message: 'は20文字以内で入力してください', trigger: 'blur'}
                    ],
                    inhouseClass: [
                        {required: true, message: '社内区分は必須です', trigger: 'change'},
                    ],
                    foreignTradeClass: [
                        {required: true, message: '海外区分は必須です', trigger: 'change'},
                    ],
                    zipcode1: [
                        {max: 3, message: 'は3文字以内で入力してください', trigger: 'blur'}
                    ],
                    zipcode2: [
                        {max: 4, message: 'は4文字以内で入力してください', trigger: 'blur'}
                    ],
                    address: [
                        {max: 60, message: 'は60文字以内で入力してください', trigger: 'blur'}
                    ],
                    customerTel: [
                        {max: 17, message: 'は17文字以内で入力してください', trigger: 'blur'}
                    ],
                    customerFax: [
                        {max: 17, message: 'は17文字以内で入力してください', trigger: 'blur'}
                    ],
                    customerDept1: [
                        {max: 8, message: 'は8文字以内で入力してください', trigger: 'blur'}
                    ],
                    customerDept2: [
                        {max: 8, message: 'は8文字以内で入力してください', trigger: 'blur'}
                    ],
                    invoiceNum: [
                        {max: 20, message: 'は20文字以内で入力してください', trigger: 'blur'}
                    ],
                    deptName: [
                        {max: 60, message: 'は60文字以内で入力してください', trigger: 'blur'}
                    ],
                    deptZip1: [
                        {max: 3, message: 'は3文字以内で入力してください', trigger: 'blur'}
                    ],
                    deptZip2: [
                        {max: 4, message: 'は4文字以内で入力してください', trigger: 'blur'}
                    ],
                    deptAddr: [
                        {max: 60, message: 'は60文字以内で入力してください', trigger: 'blur'}
                    ]
                }
            };
        },
        // 遷移元のルート名
        beforeRouteEnter(to, from, next) {
            next(vm => {
                if (!vm.fromRouterPath) {
                    vm.fromRouterPath = from.path;
                    vm.fromRouterQuery = from.query;
                }
            });
        },
        watch: {
            form: {
                deep: true,
                handler() {
                    if (this.getInfoFlag) {
                        this.hasUnsavedChanges = true;
                    }
                }
            }
        },

        beforeRouteLeave(to, from, next) {
            if (this.hasUnsavedChanges) {
                this.$confirm(
                    '保存されていないデータがあります。保存せずに終了しますか?',
                    '確認',
                    {
                        confirmButtonText: 'はい',
                        cancelButtonText: 'いいえ',
                        type: 'warning'
                    }
                ).then(() => {
                    next();
                }).catch(() => {
                    next(false);
                });
            } else {
                next();
            }
        },
        async created() {
            this.getInfoFlag = false;
            const customerNo = this.$route.params && this.$route.params.customerNo;
            if (customerNo) {
                await this.init(customerNo);
            }
            this.getInfoFlag = true;
        },

        methods: {
            checkGetData() {

            },
            checkDateRange() {
                this.$refs.form.validateField("expDateEnd");
            },
            async init(customerNo) {
                this.$modal.loading();
                await getInfo(customerNo).then(response => {
                    this.form = {
                        ...response.data,
                        zipcode1: '',
                        zipcode2: '',
                        customerDept1: '',
                        customerDept2: '',
                        deptZip1: '',
                        deptZip2: ''
                    };

                    this.selectYushiNo = response.data.yushiNo;

                    this.form.zipcode1 = response.data.zipcode ? response.data.zipcode.split('-')[0] : '';
                    this.form.zipcode2 = response.data.zipcode ? response.data.zipcode.split('-')[1] : '';

                    this.form.customerDept1 = response.data.customerDept ? response.data.customerDept.split('-')[0] : '';
                    this.form.customerDept2 = response.data.customerDept ? response.data.customerDept.split('-')[1] : '';

                    this.form.deptZip1 = response.data.deptZip ? response.data.deptZip.split('-')[0] : '';
                    this.form.deptZip2 = response.data.deptZip ? response.data.deptZip.split('-')[1] : '';

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
                let that = this;
                if (that.selectYushiNo !== that.form.yushiNo) {
                    that.$modal.confirm("予実得意先番号が変更されました。変更を更新しますか？").then(function () {
                        that.submitFormData()
                    }).catch(() => {
                    });
                } else {
                    that.submitFormData()
                }


            },
            submitFormData() {
                const deptZipStr = (this.form.deptZip1 == undefined ? '' : this.form.deptZip1) + '-' + (this.form.deptZip2 == undefined ? '' : this.form.deptZip2)
                const customerDeptStr = (this.form.customerDept1 == undefined ? '' : this.form.customerDept1) + '-' + (this.form.customerDept2 == undefined ? '' : this.form.customerDept2)
                const zipcodeStr = (this.form.zipcode1 == undefined ? '' : this.form.zipcode1) + '-' + (this.form.zipcode2 == undefined ? '' : this.form.zipcode2)

                this.form.deptZip = deptZipStr == '-' ? '' : deptZipStr
                this.form.customerDept = customerDeptStr == '-' ? '' : customerDeptStr
                this.form.zipcode = zipcodeStr == '-' ? '' : zipcodeStr
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        this.$modal.loading();
                        updateInfo(this.form).then(response => {
                            this.$modal.msgSuccess("保存しました。");
                            this.hasUnsavedChanges = false;
                            this.handleClose();
                        }).catch((err) => console.log(err))
                            .finally(() => this.$modal.closeLoading());

                    }
                });
            },
        }
    };
</script>
