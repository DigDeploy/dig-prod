<template>
  <div class="app-container">
    <title-bar title="検索条件" is-top @toggle="handleSearchBarToggle">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
        <el-row :gutter="12">
          <el-col :span="5">
            <el-form-item label="案件番号" prop="negotiationNo">
              <el-input
                v-model="queryParams.negotiationNo"
                clearable
                @keyup.enter.native="handleQuery" placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="子番" prop="subNumber">
              <el-input
                v-model="queryParams.subNumber"
                clearable
                @keyup.enter.native="handleQuery" placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="改定番号" prop="revisionNumber">
              <el-input
                v-model="queryParams.revisionNumber"
                clearable
                @keyup.enter.native="handleQuery" placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="登録日" prop="registrationDate">
              <el-date-picker clearable
                v-model="queryParams.registrationDateFrom"
                type="date"
                style="width: 180px;"
                @change="handleStartDateChange"
                value-format="yyyy-MM-dd"
                placeholder="YYYY-MM-DD">
              </el-date-picker>
              ～
              <el-date-picker clearable
                v-model="queryParams.registrationDateTo"
                type="date"
                style="width: 180px;"
                :picker-options="endDatePickerOptions"
                value-format="yyyy-MM-dd"
                placeholder="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="5">
            <el-form-item label="営業担当" prop="responsiblePerson">
            <el-select v-model="queryParams.responsiblePerson" clearable filterable placeholder="">
              <el-option
                v-for="user in userList"
                :key="user.userId"
                :label="user.nickName"
                :value="user.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="得意先番号" prop="customerNo">
              <el-input v-model="queryParams.customerNo" placeholder="" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="得意先名" prop="customerName">
              <el-input
                v-model="queryParams.customerName" placeholder=""
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="5">
            <el-form-item label="案件区分1" prop="negotiationCat1">
              <el-select v-model="queryParams.negotiationCat1" clearable placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat1"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="案件区分2" prop="negotiationCat2">
              <el-select v-model="queryParams.negotiationCat2" clearable placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat2"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="案件区分3" prop="negotiationCat3">
              <el-select v-model="queryParams.negotiationCat3" clearable placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat3"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="案件区分4" prop="negotiationCat4">
              <el-select v-model="queryParams.negotiationCat4" clearable placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat4"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="5">
            <el-form-item label="案件区分5" prop="negotiationCat5">
              <el-select v-model="queryParams.negotiationCat5" clearable placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat5"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="案件区分6" prop="negotiationCat6">
              <el-select v-model="queryParams.negotiationCat6" clearable placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat6"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="案件区分7" prop="negotiationCat7">
              <el-select v-model="queryParams.negotiationCat7" clearable placeholder="">
                <el-option
                  v-for="dict in dict.type.negotiation_cat7"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="納入地域" prop="deliveryRegion">
              <el-select v-model="queryParams.deliveryRegion" clearable placeholder="">
                <el-option
                  v-for="dict in dict.type.delivery_region"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="5">
            <el-form-item label="案件名" prop="negotiationName">
              <el-input
                v-model="queryParams.negotiationName" placeholder=""
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="業務内容" prop="businessContent">
              <el-input
                v-model="queryParams.businessContent" placeholder=""
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="見積番号" prop="quotationNo">
              <el-input
                v-model="queryParams.quotationNo" placeholder=""
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </title-bar>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          :disabled="negotiationsHistoryList.length === 0"
          @click="handleExport"
        >EXCEL出力</el-button>
      </el-col>
      <div style="float: right !important;">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >検索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" style="margin-right: 5px" @click="resetQuery">リセット
        </el-button>
      </div>
    </el-row>

    <el-table v-loading="loading" :data="negotiationsHistoryList" border @selection-change="handleSelectionChange"
              ref="dataTable" :height="tableHeight">
      <el-table-column label="No." type="index" width="55" :header-align="alignTableConfig.header" fixed="left"
                       :align="alignTableConfig.lineNo">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="案件番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text" fixed="left"
                       prop="negotiationNo" width="120"/>
      <el-table-column label="子番" :header-align="alignTableConfig.header" :align="alignTableConfig.text" fixed="left"
                       prop="subNumber" width="120"/>
      <el-table-column label="改定番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text" fixed="left"
                       prop="revisionNumber" width="120"/>
      <el-table-column label="登録日" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="registrationDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.registrationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="営業担当" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip
                       prop="responsiblePersonName" width="180">
      </el-table-column>
      <el-table-column label="得意先番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="customerNo" width="100"/>
      <el-table-column label="得意先名" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip
                       prop="customerName" width="180"/>
      <el-table-column label="案件区分1" :header-align="alignTableConfig.header" :align="alignTableConfig.tag"
                       prop="negotiationCat1" width="140">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.negotiation_cat1" :value="scope.row.negotiationCat1"/>
        </template>
      </el-table-column>
      <el-table-column label="案件区分2" :header-align="alignTableConfig.header" :align="alignTableConfig.tag"
                       prop="negotiationCat2" width="140">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.negotiation_cat2" :value="scope.row.negotiationCat2"/>
        </template>
      </el-table-column>
      <el-table-column label="案件区分3" :header-align="alignTableConfig.header" :align="alignTableConfig.tag"
                       prop="negotiationCat3" width="140">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.negotiation_cat3" :value="scope.row.negotiationCat3"/>
        </template>
      </el-table-column>
      <el-table-column label="案件区分4" :header-align="alignTableConfig.header" :align="alignTableConfig.tag"
                       prop="negotiationCat4" width="140">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.negotiation_cat4" :value="scope.row.negotiationCat4"/>
        </template>
      </el-table-column>
      <el-table-column label="案件区分5" :header-align="alignTableConfig.header" :align="alignTableConfig.tag"
                       prop="negotiationCat5" width="140">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.negotiation_cat5" :value="scope.row.negotiationCat5"/>
        </template>
      </el-table-column>
      <el-table-column label="案件区分6" :header-align="alignTableConfig.header" :align="alignTableConfig.tag"
                       prop="negotiationCat6" width="140">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.negotiation_cat6" :value="scope.row.negotiationCat6"/>
        </template>
      </el-table-column>
      <el-table-column label="案件区分7" :header-align="alignTableConfig.header" :align="alignTableConfig.tag"
                       prop="negotiationCat7" width="140">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.negotiation_cat7" :value="scope.row.negotiationCat7"/>
        </template>
      </el-table-column>
      <el-table-column label="納入地域" :header-align="alignTableConfig.header" :align="alignTableConfig.tag"
                       prop="deliveryRegion" width="140">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.delivery_region" :value="scope.row.deliveryRegion"/>
        </template>
      </el-table-column>
      <el-table-column label="案件名" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip
                       prop="negotiationName" width="300"/>
      <el-table-column label="業務内容" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip
                       prop="businessContent" width="300"/>
      <el-table-column label="見積番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="quotationNo" width="160"/>
      <el-table-column label="操作" :header-align="alignTableConfig.header" :align="alignTableConfig.action"
                       class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
            v-hasPermi="['business:negotiationsHistory:detail']"
          >参照
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
    import {listNegotiationsHistory, delNegotiationsHistory, exportNegotiationsHistory} from "@/api/business/negotiationsHistory";
    import { getUserProfile, listUser } from "@/api/system/user";
    export default {
        name: "NegotiationsHistory",
        dicts: ['sys_yes_no', 'negotiation_type', 'negotiation_cat1', 'negotiation_cat2', 'negotiation_cat3', 'negotiation_cat4', 'negotiation_cat5', 'negotiation_cat6', 'negotiation_cat7', 'delivery_region', 'importance', 'difficulty', 'volume_of_goods', 'added_value', 'probability'],
        data() {
            return {
                // 初回検索
                isFirstSearch: true,
                // ローディングマスク
                loading: false,
                // 選択されたID配列
                ids: [],
                // 単一選択無効
                single: true,
                // 複数選択無効
                multiple: true,
                // 検索条件表示
                showSearch: true,
                // 総件数
                total: 0,
                // 案件履歴テーブルデータ
                negotiationsHistoryList: [],
                // 検索パラメータ
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    negotiationNo: null,
                    subNumber: null,
                    revisionNumber: null,
                    kariFlg: null,
                    mainResponsible: null,
                    managerResponsible: null,
                    deputyResponsible: null,
                    notificationRecipient: null,
                    negotiationType: null,
                    registrationDate: null,
                    creator: null,
                    responsiblePerson: null,
                    managementStart: null,
                    managementEnd: null,
                    customerNo: null,
                    customerName: null,
                    customerWindowDept: null,
                    windowContact: null,
                    customerRequestDept: null,
                    requestContact: null,
                    negotiationCat1: null,
                    negotiationCat2: null,
                    negotiationCat3: null,
                    negotiationCat4: null,
                    negotiationCat5: null,
                    negotiationCat6: null,
                    negotiationCat7: null,
                    deliveryRegion: null,
                    negotiationName: null,
                    businessContent: null,
                    requiredElements: null,
                    optionalElements: null,
                    transactionTerms: null,
                    remarks1: null,
                    remarks2: null,
                    businessStart: null,
                    businessEnd: null,
                    evaluationRegistrationDate: null,
                    evaluationRegistrationUser: null,
                    importance: null,
                    difficulty: null,
                    volumeOfGoods: null,
                    addedValue: null,
                    probability: null,
                    quotationNo: null,
                },
                userList: [],
                searchBarExpanded : true,
            };
        },
        /** 計算プロパティ */
        computed: {
            // テーブル高さ
            tableHeight() {
                let height = document.body.clientHeight - 520;
                // 收起时增加高度
                if (!this.searchBarExpanded) {
                    height += 200;
                }
                return height < 300 ? 300 : height;
            },
            // 结束日期选择器选项
            endDatePickerOptions() {
                return {
                    disabledDate: (time) => {
                        if (this.queryParams.registrationDateFrom) {
                            const startDate = new Date(this.queryParams.registrationDateFrom);
                            startDate.setHours(0, 0, 0, 0);
                            return time.getTime() < startDate.getTime();
                        }
                        return false;
                    }
                };
            }
        },

        /* アクティベート時 */
        activated() {
            // 削除禁止
            if (!this.isFirstSearch) {
                this.reload();
            }
            this.isFirstSearch = false;
        },

        created() {
        },

        methods: {
            // 再読み込み
            reload() {
                this.clearSelection();
                this.queryParams.pageNum = 1;
            },
            handleSearchBarToggle(isExpanded) {
                this.searchBarExpanded = isExpanded;
            },
            // テーブル選択データをクリア
            clearSelection() {
                this.$refs["dataTable"] && this.$refs["dataTable"].clearSelection();
            },

            /** 案件履歴リスト取得 */
            getList() {
                this.loading = true;
                listUser({pageSize: -1}).then(response => {
                    this.userList = response.rows;
                });
                listNegotiationsHistory(this.queryParams).then(response => {
                    this.negotiationsHistoryList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                });
            },

            /** 検索ボタン操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },

            /** リセットボタン操作 */
            resetQuery() {
                this.resetForm("queryForm");
                this.queryParams.registrationDateFrom = null;
                this.queryParams.registrationDateTo = null;
                this.negotiationsHistoryList = [];
                this.total = 0;
            },
            // 开始日期变化时的处理
            handleStartDateChange() {
                if (this.queryParams.registrationDateTo) {
                    const startDate = new Date(this.queryParams.registrationDateFrom);
                    const endDate = new Date(this.queryParams.registrationDateTo);
                    if (endDate < startDate) {
                        this.queryParams.registrationDateTo = null;
                    }
                }
            },

            // 複数選択時のデータ取得
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.negotiationNo)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },

            /** 参照ボタン操作 */
            handleDetail(row) {
                const router = "/newCase/negotiationsHistory/negotiationsHistoryDetail/index/" + row.negotiationNo + "/" + row.subNumber + "/" + row.revisionNumber
                this.$router.push(router);
            },

            /** 追加ボタン操作 */
            handleAdd() {
                const router = "/newCase/negotiationsHistory/negotiationsHistoryAdd/index";
                this.$router.push(router);
            },

            /** 編集ボタン操作 */
            handleUpdate(row) {
                const router = "/newCase/negotiationsHistory/negotiationsHistoryEdit/index/" + row.negotiationNo;
                this.$router.push(router);
            },

            /** 削除ボタン操作 */
            handleDelete(row) {
                const negotiationNos = row.negotiationNo || this.ids;
                let that = this;
                that.$modal.confirm('削除してもよろしいですか？').then(function () {
                    that.$modal.loading();
                    delNegotiationsHistory(negotiationNos).then(response => {
                        that.getList();
                        that.$modal.msgSuccess("削除しました。");
                    }).catch((err) => console.log(err))
                        .finally(() => that.$modal.closeLoading());
                }).catch(() => {
                });
            },

            /** エクスポートボタン操作 */
            handleExport() {
                // 検索条件をコピーし、ページングパラメータを削除してすべてのデータをエクスポート
                const exportParams = { ...this.queryParams };
                delete exportParams.pageNum;
                delete exportParams.pageSize;
                const now = new Date();
                const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
                this.download('business/negotiationsHistory/export', exportParams, `案件履歴情報_${timestamp}.xlsx`)
            }
        }
    };
</script>

