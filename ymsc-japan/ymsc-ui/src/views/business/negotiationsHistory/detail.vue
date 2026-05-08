<template>
  <div class="app-container-router">
    <el-form ref="form" :model="form" :rules="rules" label-width="148px">
      <!-- タイトルバー -->
      <title-bar title="宛先" is-top :collapsible="false">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="営業担当（主）" prop="mainResponsible">
              <el-select v-model="form.mainResponsible" filterable disabled placeholder="">
                <el-option
                  v-for="user in userList"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="営業管理者（上司）" prop="managerResponsible">
              <el-select v-model="form.managerResponsible" disabled placeholder="">
                <el-option
                  v-for="user in userList"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          </el-col>
          <el-col :span="14">
            <el-form-item label="営業担当（副）" prop="deputyResponsible">
              <dept-user-input
                v-model="form.deputyResponsible"
                :ref="'deputyResponsible'"
                class="w-100"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="通知先" prop="notificationRecipient">
              <dept-user-input
                v-model="form.notificationRecipient"
                :ref="`notificationRecipient`"
                class="w-100"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </title-bar>
      <title-bar title="案件登録" is-top>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="案件種類" prop="negotiationType">
              <el-select v-model="form.negotiationType" disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="案件番号" prop="negotiationNo">
              <el-input v-model="form.negotiationNo" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="子番" prop="subNumber">
              <div class="input-button-grid">
                <el-input v-model="form.subNumber" disabled/>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="改定" prop="revisionNumber">
              <div class="input-button-grid">
                <el-input v-model="form.revisionNumber" disabled/>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="登録日" prop="registrationDate">
              <el-date-picker clearable disabled
                              v-model="form.registrationDate"
                              type="date"
                              value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="起票者" prop="creator">
              <el-select v-model="form.creator" disabled placeholder="">
                <el-option
                  v-for="user in userList"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="営業担当" prop="responsiblePerson">
              <el-select v-model="form.responsiblePerson" disabled placeholder="">
                <el-option
                  v-for="user in userList"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件管理開始期間" prop="managementStart">
              <el-date-picker clearable disabled
                              v-model="form.managementStart"
                              type="date"
                              value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件管理終了期間" prop="managementEnd">
              <el-date-picker clearable disabled
                              v-model="form.managementEnd"
                              type="date"
                              :picker-options="{ disabledDate: disabledEndDate }"
                              value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </title-bar>
      <title-bar title="得意先情報" is-top>
        <el-form :model="form" label-width="180px">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="得意先番号" prop="customerNo">
                <el-input v-model="form.customerNo" disabled>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="得意先名" prop="customerName">
                <el-input v-model="form.customerName" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="得意先部門（窓口）" prop="customerWindowDept">
                <el-input v-model="form.customerWindowDept" disabled placeholder="" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="窓口担当者" prop="windowContact">
                <el-input v-model="form.windowContact" disabled placeholder="" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="得意先部門（依頼元）" prop="customerRequestDept">
                <el-input v-model="form.customerRequestDept" disabled placeholder="" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="依頼元担当者" prop="requestContact">
                <el-input v-model="form.requestContact" disabled placeholder="" maxlength="50"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </title-bar>
      <title-bar title="案件情報" is-top>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="案件区分1" prop="negotiationCat1">
              <el-select v-model="form.negotiationCat1" clearable disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat1"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="案件区分2" prop="negotiationCat2">
              <el-select v-model="form.negotiationCat2" clearable disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat2"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="案件区分3" prop="negotiationCat3">
              <el-select v-model="form.negotiationCat3" clearable disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat3"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="案件区分4" prop="negotiationCat4">
              <el-select v-model="form.negotiationCat4" clearable disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat4"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="案件区分5" prop="negotiationCat5">
              <el-select v-model="form.negotiationCat5" clearable disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat5"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="案件区分6" prop="negotiationCat6">
              <el-select v-model="form.negotiationCat6" clearable disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat6"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="案件区分7" prop="negotiationCat7">
              <el-select v-model="form.negotiationCat7" disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat7"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="納入地域" prop="deliveryRegion">
              <el-select v-model="form.deliveryRegion" disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.delivery_region"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="案件名" prop="negotiationName" label-width="180px">
              <el-input v-model="form.negotiationName" placeholder="" maxlength="100" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="業務内容" prop="businessContent" label-width="180px">
              <el-input v-model="form.businessContent" type="textarea" placeholder="" maxlength="200"
                        disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="必須要件" prop="requiredElements" label-width="180px">
              <el-input v-model="form.requiredElements" type="textarea" placeholder="" maxlength="200"
                        disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="ほか要件" prop="optionalElements" label-width="180px">
              <el-input v-model="form.optionalElements" type="textarea" placeholder="" maxlength="200"
                        disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="取引条件" prop="transactionTerms" label-width="180px">
              <el-input v-model="form.transactionTerms" type="textarea" placeholder="" maxlength="100"
                        disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="備考1" prop="remarks1" label-width="180px">
              <el-input v-model="form.remarks1" type="textarea" placeholder="" maxlength="200" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="備考2" prop="remarks2" label-width="180px">
              <el-input v-model="form.remarks2" type="textarea" placeholder="" maxlength="200" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="業務予定期間（開始）" prop="businessStart" label-width="180px">
              <el-date-picker clearable disabled
                              v-model="form.businessStart"
                              type="date"
                              value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="業務予定期間（終了）" prop="businessEnd" label-width="180px">
              <el-date-picker clearable disabled
                              v-model="form.businessEnd"
                              type="date"
                              value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </title-bar>
      <title-bar title="案件評価" is-top>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="評価登録日" prop="evaluationRegistrationDate">
              <el-date-picker clearable disabled
                              v-model="form.evaluationRegistrationDate"
                              type="date"
                              value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="評価登録者" prop="evaluationRegistrationUser">
              <div class="input-button-group input-button-grid">
                <el-input v-model="form.evaluationRegistrationUser" disabled/>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="flex-row">
          <div class="flex-col">
            <el-form-item label="重要度" prop="importance">
              <el-select v-model="form.importance" clearable disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.importance"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="flex-col">
            <el-form-item label="難易度" prop="difficulty">
              <el-select v-model="form.difficulty" clearable disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.difficulty"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="flex-col">
            <el-form-item label="物量" prop="volumeOfGoods">
              <el-select v-model="form.volumeOfGoods" clearable disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.volume_of_goods"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="flex-col">
            <el-form-item label="付加価値" prop="addedValue">
              <el-select v-model="form.addedValue" clearable disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.added_value"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="flex-col">
            <el-form-item label="確率" prop="probability">
              <el-select v-model="form.probability" clearable disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.probability"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </title-bar>
      <title-bar title="コメント（チャット）" is-top>
        <el-table :data="form.commentList" border ref="dataTable">
          <el-table-column label="No." type="index" width="55" :header-align="alignTableConfig.header"
                           :align="alignTableConfig.lineNo">
          </el-table-column>
          <el-table-column label="日付" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="date"
                           width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="部門" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                           prop="deptName"/>
          <el-table-column label="氏名" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                           prop="name"/>
          <el-table-column label="コメント" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                           prop="comment"/>
        </el-table>
      </title-bar>
    </el-form>
    <div class="footer-back">
      <el-button @click="handleClose">戻る</el-button>
    </div>
  </div>
</template>


<script>
    import {getNegotiationsHistory} from "@/api/business/negotiationsHistory";
    import {listUser} from "@/api/system/user";
    import DeptUserInput from "@/components/DeptUser/multipleInput";

    export default {
        name: "NegotiationsHistoryDetail",
        dicts: ['negotiation_type', 'negotiation_cat1', 'negotiation_cat2', 'negotiation_cat3', 'negotiation_cat4', 'negotiation_cat5', 'negotiation_cat6', 'negotiation_cat7', 'delivery_region', 'importance', 'difficulty', 'volume_of_goods', 'added_value', 'probability', 'negotiation_status', 'activity_type', 'quotation_status', 'unit'],
        components: {
            DeptUserInput,
        },
        data() {
            return {
                fromRouterPath: '',
                fromRouterQuery: '',
                // フォームパラメータ
                form: {},
                userList: [],
                managerList: [],
                status: ''
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
            const negotiationNo = this.$route.params && this.$route.params.negotiationNo;
            const subNumber = this.$route.params && this.$route.params.subNumber;
            const revisionNumber = this.$route.params && this.$route.params.revisionNumber;
            if (negotiationNo) {
                this.getInfo(negotiationNo, subNumber, revisionNumber);
            }
        },

        methods: {
            // 情報取得
            getInfo(negotiationNo, subNumber, revisionNumber) {
                this.$modal.loading();
                getNegotiationsHistory(negotiationNo, subNumber, revisionNumber).then(response => {
                    this.form = response.data;
                    listUser({pageSize: -1}).then(response => {
                        this.userList = response.rows;
                    });
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
  .input-button-group {
    display: flex;
    gap: 8px; /* 输入框和按钮之间的间距 */
    width: 100%;
  }

  .input-button-group .el-input {
    flex: 1; /* 输入框占满剩余空间 */
  }

  /* 弹性布局，让五个元素平均分配空间 */
  .flex-row {
    display: flex;
    gap: 16px;
    width: 100%;
  }

  .flex-col {
    flex: 1;
    min-width: 0;
  }

  .flex-col .el-form-item {
    margin-bottom: 0;
  }
</style>
