<template>
  <div class="app-container-router">
    <el-form ref="form" :model="form" label-width="150px">
      <!-- タイトルバー -->
      <title-bar title="得意先登録" is-top style="padding-top:5px">
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="得意先番号" prop="customerNo">
              <el-input v-model="form.customerNo" placeholder="" show-word-limit maxlength="6" disabled
                        class="ellipsis-input" :title="form.customerNo"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-button type="primary" style="flex: 1; margin: 0;" @click="checkGetData" disabled>一覧呼び出し・検索</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="予実得意先番号" prop="yushiNo">
              <el-input v-model="form.yushiNo" placeholder="" disabled class="ellipsis-input" :title="form.yushiNo"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="有効期限開始" prop="expDateStart">
              <el-date-picker clearable
                              v-model="form.expDateStart"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder=""
                              @change="checkDateRange" style="width: 100%;" disabled class="ellipsis-input"
                              :title="form.expDateStart">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="有効期限終了" prop="expDateEnd" label-width="120px">
              <el-date-picker clearable
                              v-model="form.expDateEnd"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder=""
                              @change="checkDateRange" style="width: 100%;" disabled class="ellipsis-input"
                              :title="form.expDateEnd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="名称" prop="customerName">
              <el-input v-model="form.customerName" placeholder="" disabled class="ellipsis-input"
                        :title="form.customerName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="略名" prop="cusNameShort">
              <el-input v-model="form.cusNameShort" placeholder="" disabled class="ellipsis-input"
                        :title="form.cusNameShort"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <div style="display: flex; gap: 0; ">
              <el-form-item label="郵便番号" prop="zipcode1" style="flex: 7">
                <el-input v-model="form.zipcode1" placeholder="" disabled class="ellipsis-input"
                          :title="form.zipcode1"/>
              </el-form-item>
              <el-form-item label="" label-width="10px" prop="zipcode2" style="flex: 5">
                <el-input v-model="form.zipcode2" placeholder="" disabled class="ellipsis-input"
                          :title="form.zipcode2"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16 ">
            <el-form-item label="住所" prop="address">
              <el-input v-model="form.address" placeholder="" disabled class="ellipsis-input" :title="form.address"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="電話番号" prop="customerTel">
              <el-input v-model="form.customerTel" placeholder="" disabled class="ellipsis-input"
                        :title="form.customerTel"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="FAX番号" prop="customerFax" label-width="120px">
              <el-input v-model="form.customerFax" placeholder="" disabled class="ellipsis-input"
                        :title="form.customerFax"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="10">
            <div style="display: flex; gap: 0; width: 99%">
              <el-form-item label="課（社内の場合）" prop="customerDept1">
                <el-input v-model="form.customerDept1" placeholder="" disabled class="ellipsis-input"
                          :title="form.customerDept1"/>
              </el-form-item>
              <el-form-item label="" label-width="10px" prop="customerDept2">
                <el-input v-model="form.customerDept2" placeholder="" disabled class="ellipsis-input"
                          :title="form.customerDept2"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="インボイス番号" prop="invoiceNum">
              <el-input v-model="form.invoiceNum" placeholder="" disabled class="ellipsis-input"
                        :title="form.invoiceNum"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="事業所部署名" prop="deptName">
              <el-input v-model="form.deptName" placeholder="" disabled class="ellipsis-input" :title="form.deptName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <div style="display: flex; gap: 0; width: 99%">
              <el-form-item label="事業所郵便番号" prop="deptZip1" style="flex: 7">
                <el-input v-model="form.deptZip1" placeholder="" disabled class="ellipsis-input"
                          :title="form.deptZip1"/>
              </el-form-item>
              <el-form-item label="" label-width="10px" prop="deptZip2" style="flex: 5">
                <el-input v-model="form.deptZip2" placeholder="" disabled class="ellipsis-input"
                          :title="form.deptZip2"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="事業所住所" prop="deptAddr">
              <el-input v-model="form.deptAddr" placeholder="" disabled class="ellipsis-input" :title="form.deptAddr"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="社内区分" prop="inhouseClass">
              <el-select v-model="form.inhouseClass" placeholder="" style="width: 100%;" disabled class="ellipsis-input"
                         :title="form.inhouseClass">
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
              <el-select v-model="form.foreignTradeClass" placeholder="" style="width: 100%;" disabled
                         class="ellipsis-input" :title="form.foreignTradeClass">
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
      <el-button @click="handleClose">戻る</el-button>
    </div>
  </div>
</template>


<script>
    import {getInfo} from "@/api/business/customerInfo";

    export default {
        name: "infoDetail",
        dicts: ['sys_user_sex', 'customer_inhouse_class', 'customer_foreign_trade_class'],
        data() {
            return {
                fromRouterPath: '',
                fromRouterQuery: '',
                // フォームパラメータ
                form: {},
            };
        },
        // ルート遷移前
        beforeRouteEnter(to, from, next) {
            next(vm => {
                if (!vm.fromRouterPath) {
                    vm.fromRouterPath = from.path;
                    vm.fromRouterQuery = from.query;
                }
            });
        },
        created() {
            const customerNo = this.$route.params && this.$route.params.customerNo;
            if (customerNo) {
                this.getInfo(customerNo);
            }
        },

        methods: {
            checkDateRange() {

            },
            checkGetData() {

            },
            // 情報取得
            getInfo(customerNo) {
                this.$modal.loading();
                getInfo(customerNo).then(response => {
                    this.form = response.data;

                    this.form.zipcode1 = response.data.zipcode.split('-')[0];
                    this.form.zipcode2 = response.data.zipcode.split('-')[1];

                    this.form.customerDept1 = response.data.customerDept.split('-')[0];
                    this.form.customerDept2 = response.data.customerDept.split('-')[1];

                    this.form.deptZip1 = response.data.deptZip.split('-')[0];
                    this.form.deptZip2 = response.data.deptZip.split('-')[1];
                }).catch((err) => console.log(err))
                    .finally(() => this.$modal.closeLoading());
            },

            // 戻る・閉じる
            handleClose() {
                // 遷移設定
                const obj = {path: this.fromRouterPath, query: this.fromRouterQuery};
                // 現在のタブを閉じて指定ページを開く
                this.$tab.closeOpenPage(obj);
            },

        }
    };
</script>

<style scoped>
  /* 禁用状态下显示文本省略号 */
  .ellipsis-input :deep(.el-input__inner) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* 取消禁用状态的背景色（可选） */
    background-color: #fff !important;
  }
</style>
