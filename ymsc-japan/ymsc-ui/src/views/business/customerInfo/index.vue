<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="150px">
      <el-form-item label="得意先番号" prop="customerNo">
        <el-input
          v-model="queryParams.customerNo"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="予実得意先番号" prop="yushiNo">
        <el-input
          v-model="queryParams.yushiNo"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="得意先略名/名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="住所" prop="address">
        <el-input
          v-model="queryParams.address"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="電話番号" prop="customerTel">
        <el-input
          v-model="queryParams.customerTel"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="得意先略名" prop="cusNameShort">
          <el-input
                  v-model="queryParams.cusNameShort"
                  clearable
                  @keyup.enter.native="handleQuery"
          />
      </el-form-item> -->
      <el-form-item label="事業所・部署名" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="インボイス番号" prop="invoiceNum">
        <el-input
          v-model="queryParams.invoiceNum"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="社内/社外" prop="inhouseClass">
        <el-select v-model="queryParams.inhouseClass" clearable filterable placeholder="">
          <el-option
            v-for="dict in dict.type.customer_inhouse_class"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="海外区分" prop="foreignTradeClass">
        <el-select v-model="queryParams.foreignTradeClass" clearable filterable placeholder="">
          <el-option
            v-for="dict in dict.type.customer_foreign_trade_class"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="有効期限開始" prop="expDateStart" >
        <el-date-picker clearable
                        v-model="queryParams.expDateStart"
                        type="date"
                        @change="handleStartDateChange"
                        value-format="yyyy-MM-dd" placeholder="YYYY-MM-DD" style="width: 93%;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="～　有効期限終了" prop="expDateEnd" label-width="135px">
        <el-date-picker clearable
                        v-model="queryParams.expDateEnd"
                        type="date"
                        :picker-options="endDatePickerOptions"
                        value-format="yyyy-MM-dd" placeholder="YYYY-MM-DD" style="width: 93%;">
        </el-date-picker>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          :disabled="infoList.length === 0"
          @click="handleExport"
        >EXCEL出力</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
          <el-button
                  type="primary"
                  plain
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleAdd"
                  v-hasPermi="['business:customerInfo:add']"
          >追加</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
          <el-button
          type="primary"
          icon="el-icon-upload"
          size="mini"
          @click="openImportTable"
          v-hasPermi="['tool:gen:import']"
          >インポート</el-button>
      </el-col> -->
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

    <el-table v-loading="loading" :data="infoList" border @selection-change="handleSelectionChange" ref="dataTable">
      <el-table-column label="No." type="index" width="55" :header-align="alignTableConfig.header"
                       :align="alignTableConfig.lineNo">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="得意先番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="customerNo" width="140"/>
      <el-table-column label="予実得意先番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="yushiNo" width="140"/>
      <el-table-column label="得意先略名/名称" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="customerShortAndName" width="140" show-overflow-tooltip/>
      <el-table-column label="住所" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
            prop="address" show-overflow-tooltip/>
      <el-table-column label="電話番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
            prop="customerTel" show-overflow-tooltip width="120"/>
      <el-table-column label="事業所・部署名" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="deptName" width="120" show-overflow-tooltip/>
      <el-table-column label="有効期限開始" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="expDateStart" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expDateStart, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有効期限終了" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="expDateEnd" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expDateEnd, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="インボイス番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="invoiceNum" width="160" show-overflow-tooltip/>

      <!-- <el-table-column label="得意先略名" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="cusNameShort" /> -->
      <el-table-column label="社内/社外" :header-align="alignTableConfig.header" :align="alignTableConfig.tag"
                       prop="inhouseClass" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.customer_inhouse_class" :value="scope.row.inhouseClass"/>
        </template>
      </el-table-column>
      <el-table-column label="海外区分" :header-align="alignTableConfig.header" :align="alignTableConfig.tag"
                       prop="foreignTradeClass" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.customer_foreign_trade_class" :value="scope.row.foreignTradeClass"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" :header-align="alignTableConfig.header" :align="alignTableConfig.action"
                       class-name="small-padding fixed-width" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:customerInfo:edit']"
          >編集
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
            v-hasPermi="['business:customerInfo:detail']"
          >参照
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:customerInfo:remove']"
          >削除
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
    import {listInfo, delInfo, exportInfo} from "@/api/business/customerInfo";

    export default {
        name: "Info",
        dicts: ['sys_user_sex', 'customer_inhouse_class', 'customer_foreign_trade_class'],
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
                // 得意先情報テーブルデータ
                infoList: [],
                // 検索パラメータ
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    customerNo: null,
                    yushiNo: null,
                    deptName: null,
                    customerName: null,
                    expDateStart: null,
                    expDateEnd: null,
                    cusNameShort: null,
                    inhouseClass: null,
                    foreignTradeClass: null,
                    invoiceNum: null,
                    address: null,
                    customerTel: null,
                }
            };
        },

        /* アクティベート時 */
        activated() {
            // 削除禁止
            if (!this.isFirstSearch) {
                this.reload();
            }
            this.isFirstSearch = false;
        },
        computed: {
            endDatePickerOptions() {
                return {
                    disabledDate: (time) => {
                        if (this.queryParams.expDateStart) {
                            const startDate = new Date(this.queryParams.expDateStart);
                            startDate.setHours(0, 0, 0, 0);
                            return time.getTime() < startDate.getTime();
                        }
                        return false;
                    }
                };
            }
        },


        created() {
        },

        methods: {
            handleStartDateChange() {
                if (this.queryParams.expDateEnd) {
                    const startDate = new Date(this.queryParams.expDateStart);
                    const endDate = new Date(this.queryParams.expDateEnd);
                    if (endDate < startDate) {
                        this.queryParams.expDateEnd = null;
                    }
                }
            },
            // 再読み込み
            reload() {
                this.clearSelection();
                this.queryParams.pageNum = 1;
                // this.getList();
            },

            // テーブル選択データをクリア
            clearSelection() {
                this.$refs["dataTable"] && this.$refs["dataTable"].clearSelection();
            },

            /** 得意先情報リスト取得 */
            getList() {
                this.loading = true;
                listInfo(this.queryParams).then(response => {
                    this.infoList = response.rows;
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
                this.infoList = [];
                this.total = 0;
                // this.handleQuery();
            },

            // 複数選択時のデータ取得
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.customerNo)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },

            /** 詳細ボタン操作 */
            handleDetail(row) {
                // TODO: 手動でルートを追加
                const router = "/customer/customerInfo/infoDetail/" + row.customerNo;
                this.$router.push(router);
            },

            /** 追加ボタン操作 */
            handleAdd() {
                // TODO: 手動でルートを追加
                const router = "/info/infoAdd/index";
                this.$router.push(router);
            },

            /** 編集ボタン操作 */
            handleUpdate(row) {
                // TODO: 手動でルートを追加
                const router = "/customer/customerInfo/infoEdit/" + row.customerNo;
                this.$router.push(router);
            },

            /** 削除ボタン操作 */
            handleDelete(row) {
                const customerNos = row.customerNo || this.ids;
                let that = this;
                that.$modal.confirm('得意先情報番号 "' + customerNos + '" のデータを削除してもよろしいですか？').then(function () {
                    that.$modal.loading();
                    delInfo(customerNos).then(response => {
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
                this.download('business/info/export', exportParams, `得意先情報_${timestamp}.xlsx`)
            }
        }
    };
</script>

