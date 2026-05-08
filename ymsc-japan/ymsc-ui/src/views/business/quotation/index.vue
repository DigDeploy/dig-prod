<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="128px">
      <el-row>
        <el-form-item label="案件名" prop="negotiationName">
          <el-input
            v-model="queryParams.negotiationName"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="案件番号" prop="negotiationNo">
          <el-input
            v-model="queryParams.negotiationNo"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="案件子番" prop="negotiationSubNumber">
          <el-input
            v-model="queryParams.negotiationSubNumber"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      </el-row>
      <el-form-item label="見積番号" prop="quotationNo">
        <el-input
          v-model="queryParams.quotationNo"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="見積ステータス" prop="status">
        <el-select v-model="queryParams.status" clearable placeholder="">
          <el-option
            v-for="dict in dict.type.sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="見積日" prop="quotationDay">
        <el-date-picker clearable
                        v-model="queryParams.quotationDay"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="YYYY-MM-DD">
        </el-date-picker>
        ～
        <el-date-picker clearable
                        v-model="queryParams.quotationDay"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="YYYY-MM-DD">
        </el-date-picker>
      </el-form-item>
    </el-form>


    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['business:quotation:add']"-->
<!--        >新規見積-->
<!--        </el-button>-->
<!--      </el-col>-->
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

    <el-table v-loading="loading" :data="quotationList" border @selection-change="handleSelectionChange"
              ref="dataTable">
      <el-table-column label="No." type="index" width="55" :header-align="alignTableConfig.header"
                       :align="alignTableConfig.lineNo">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="案件番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="negotiationNo"/>
      <el-table-column label="案件子番" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="negotiationSubNumber"/>
      <el-table-column label="見積番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text" width="200px"
                       prop="quotationNo"/>
      <el-table-column label="見積日" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="quotationDay" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.quotationDay, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="概算金額" :header-align="alignTableConfig.header" :align="alignTableConfig.number"
                       prop="estimateAmount">

      </el-table-column>

      <el-table-column label="単位" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="unit"/>
      <el-table-column label="ステータス" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="連携用見積番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="coopQuotationId"/>
      <el-table-column label="受注番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="remark"/>
      <el-table-column label="受注日" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="remark"/>
<!--      <el-table-column label="操作" :header-align="alignTableConfig.header" :align="alignTableConfig.action"-->
<!--                       class-name="small-padding fixed-width" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="orderUpdate(scope.row)"-->
<!--          >受注登録-->
<!--          </el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--          >編集-->
<!--          </el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--          >削除-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <el-dialog :title="title" :visible.sync="quotationOpen" width="1100px" append-to-body>
      <el-form ref="quotationForm" :model="quotationForm" :rules="quotationRules" label-width="138px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="案件種類" prop="content">
              <el-select v-model="quotationForm.content" disabled placeholder="">
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件番号" prop="negotiationNo">
              <el-input v-model="quotationForm.negotiationNo" class="ym-input-standard">
                <el-button slot="append" icon="el-icon-search" @click=""/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="子番" prop="activityNo">
              <el-input v-model="quotationForm.activityNo" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="見積日" prop="quotationDay">
              <el-date-picker clearable
                              v-model="quotationForm.quotationDay"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="見積ステータス" prop="status">
              <el-select v-model="quotationForm.status" placeholder="">
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="連携用見積番号" prop="coopQuotationId">
              <el-input v-model="quotationForm.coopQuotationId" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="概算金額" prop="estimateAmount">
              <el-input v-model="quotationForm.estimateAmount" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="単位" prop="unit">
              <el-select v-model="quotationForm.unit" placeholder="">
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="備考" prop="remark">
              <el-input type="textarea" v-model="quotationForm.remark" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button @click="cancel">キャンセル</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="orderOpen" width="1100px" append-to-body>
      <el-form ref="orderForm" :model="orderForm" :rules="rules" label-width="138px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="受注日" prop="orderDay">
              <el-date-picker clearable
                              v-model="orderForm.orderDay"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="受注番号" prop="orderNo">
              <el-input v-model="orderForm.orderNo" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="担当部門（正）" prop="orderDept">
              <el-input v-model="orderForm.orderDept" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="担当者（正）" prop="orderUser">
              <el-input v-model="orderForm.orderUser" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="担当部門（副）" prop="orderDeptSub">
              <el-input v-model="orderForm.orderDeptSub" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="担当者（副）" prop="orderUserSub">
              <el-input v-model="orderForm.orderUserSub" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="備考" prop="remark">
              <el-input type="textarea" v-model="orderForm.remark" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button @click="cancel">キャンセル</el-button>
      </div>
    </el-dialog>

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
    import {listQuotation, delQuotation, addQuotation, updateQuotation, getQuotation} from "@/api/business/quotation";

    export default {
        name: "Quotation",
        dicts: ['sys_user_sex'],
        data() {
            return {
                // 初回検索
                isFirstSearch: true,
                // ローディングマスク
                loading: true,
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
                // 見積情報テーブルデータ
                quotationList: [],
                // 検索パラメータ
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    quotationNo: null,
                    negotiationNo: null,
                    negotiationSubNumber: null,
                    quotationDay: null,
                    estimateAmount: null,
                    unit: null,
                    status: null,
                    coopQuotationId: null,
                },
                // フォーム検証ルール
                quotationRules: {
                    quotationDay: [
                        {required: true, message: "見積日は必須です", trigger: "blur"}
                    ],
                    status: [
                        {required: true, message: "見積ステータスは必須です", trigger: "blur"}
                    ],
                },
                quotationOpen: false,
                quotationForm: {},
                title: '',
                orderOpen: false,
                orderForm: {}
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

        created() {
            this.getList();
        },

        methods: {
            // 再読み込み
            reload() {
                this.clearSelection();
                this.queryParams.pageNum = 1;
                this.getList();
            },

            // テーブル選択データをクリア
            clearSelection() {
                this.$refs["dataTable"] && this.$refs["dataTable"].clearSelection();
            },

            /** 見積情報リスト取得 */
            getList() {
                this.loading = true;
                listQuotation(this.queryParams).then(response => {
                    this.quotationList = response.rows;
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
                this.handleQuery();
            },

            // 複数選択時のデータ取得
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.quotationNo)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },

            /** 詳細ボタン操作 */
            handleDetail() {
                // TODO: 手動でルートを追加
                const router = "/quotation/quotationDetail/index/" + row.quotationNo;
                this.$router.push(router);
            },

            /** 追加ボタン操作 */
            handleAdd() {
                this.quotationOpen = true;
                this.title = "見積登録";
                this.resetForm("quotationForm");
            },

            /** 編集ボタン操作 */
            handleUpdate(row) {
                this.resetForm("quotationForm");
                const quotationNo = row.quotationNo;
                getQuotation(quotationNo).then(response => {
                    this.quotationForm = response.data;
                    this.quotationOpen = true;
                    this.title = "見積修正";
                })
            },
            /** 編集ボタン操作 */
            orderUpdate(row) {
                this.resetForm("orderForm");
                // const orderNo = row.orderNo;
                const orderNo ='';
                debugger
                if(orderNo) {
                    getQuotation(orderNo).then(response => {
                        this.orderForm = response.data;
                        this.orderOpen = true;
                        this.title = "受注修正";
                    })
                } else {
                    this.title = "受注登録";
                    this.orderOpen = true;
                }
            },

            /** 削除ボタン操作 */
            handleDelete(row) {
                const quotationNos = row.quotationNo || this.ids;
                let that = this;
                that.$modal.confirm('見積情報番号 "' + quotationNos + '" のデータを削除してもよろしいですか？').then(function () {
                    that.$modal.loading();
                    delQuotation(quotationNos).then(response => {
                        that.getList();
                        that.$modal.msgSuccess("削除しました。");
                    }).catch((err) => console.log(err))
                        .finally(() => that.$modal.closeLoading());
                }).catch(() => {
                });
            },

            /** エクスポートボタン操作 */
            handleExport() {
                this.download('business/quotation/export', {
                    ...this.queryParams
                }, `quotation_${new Date().getTime()}.xlsx`)
            },
            /** 送信ボタン */
            submitForm() {
                this.$refs["quotationForm"].validate(valid => {
                    if (valid) {
                        if (this.quotationForm.quotationNo != undefined) {
                            updateQuotation(this.quotationForm).then(response => {
                                this.$modal.msgSuccess("保存しました。");
                                this.quotationOpen = false;
                                this.getList();
                            });
                        } else {
                            addQuotation(this.quotationForm).then(response => {
                                this.$modal.msgSuccess("登録しました。");
                                this.quotationOpen = false;
                                this.getList();
                            });
                        }
                    }
                });
            },
            // キャンセルボタン
            cancel() {
                this.quotationOpen = false;
                this.resetForm("quotationForm");
                this.orderOpen = false;
                this.resetForm("orderForm");
            },
        }
    };
</script>

