<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="108px">
      <el-form-item label="日付" prop="date">
        <el-date-picker clearable
                        v-model="queryParams.startDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="YYYY-MM-DD">
        </el-date-picker>
        ～
        <el-date-picker clearable
                        v-model="queryParams.endDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="YYYY-MM-DD">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="担当者" prop="resolveUser">
        <el-select v-model="queryParams.resolveUser" placeholder="" clearable filterable>
          <el-option
            v-for="user in bukaList"
            :key="user.userId"
            :label="user.nickName"
            :value="user.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作業区分" prop="content">
        <el-select v-model="queryParams.content" placeholder="" clearable>
          <el-option
            v-for="dict in dict.type.work_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="案件番号" prop="negotiationNo">
        <el-input
          v-model="queryParams.negotiationNo"
          placeholder=""
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="子番" prop="subNumber">
        <el-input
          v-model="queryParams.subNumber"
          placeholder=""
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活動番号" prop="activityNo">
        <el-input
          v-model="queryParams.activityNo"
          placeholder=""
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:report:add']"
        >日報追加
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          size="mini"-->
      <!--          @click="handleReaction"-->
      <!--        >フィードバック-->
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

    <el-table
      v-loading="loading"
      :data="reportList"
      border
      ref="dataTable"
      :height="tableHeight"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column label="No." type="index" width="55" :header-align="alignTableConfig.header"
                       :align="alignTableConfig.text">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="日付" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="date"
                       width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日時" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="timeFrom"
                       width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}～{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作業時間" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="hours" width="80"/>
      <el-table-column label="担当者" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip
                       prop="resolveUserName" width="110"/>
      <el-table-column label="作業区分" :header-align="alignTableConfig.header" :align="alignTableConfig.tag"
                       prop="content" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.work_type" :value="scope.row.content"/>
        </template>
      </el-table-column>
      <el-table-column label="案件番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="negotiationNo" width="120"/>
      <el-table-column label="子番" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="subNumber" width="60"/>
      <el-table-column label="活動番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="activityNo" width="100"/>
      <el-table-column label="作業内容（詳細）" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="contentDetail" show-overflow-tooltip width="180"/>
      <el-table-column label="上司フィードバック" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       show-overflow-tooltip width="180"
                       prop="joushiFeedback"/>
      <el-table-column label="リアクション" :header-align="alignTableConfig.header" :align="alignTableConfig.text" width="200">
        <template slot-scope="scope">
          <div class="selected-reactions" v-if="scope.row.reactions">
            <span
              v-for="(reactionValue, index) in scope.row.reactions.split(',')"
              :key="index"
              class="selected-tag"
            >
              <span>{{ getReactionEmoji(reactionValue) }}</span>
              <span>{{ getReactionLabel(reactionValue) }}</span>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" :header-align="alignTableConfig.header" :align="alignTableConfig.action" width="220"
                       class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document-copy"
            @click="handleCopy(scope.row)"
            v-hasPermi="['business:report:edit']"
          >コピー
          </el-button>
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="text"
            @click="handleReportAction(scope.row)"
          >
            {{ isOwnReport(scope.row) ? '編集' : 'フィードバック' }}
          </el-button>
          <el-button
            v-if="isOwnReport(scope.row)"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:report:remove']"
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

    <el-dialog :title="title" :visible.sync="open" :rule="rules" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="148px">
        <el-row :gutter="10">
          <el-col :span="26">
            <el-form-item label="日時" prop="date">
              <el-date-picker clearable
                              v-model="form.date"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="YYYY-MM-DD">
              </el-date-picker>
              <el-time-select clearable style="width: 120px"
                              v-model="form.startTime"
                              value-format="HH:mm"
                              placeholder="HH:MM"
                              :picker-options="{
                               start: '00:00',
                               step: '00:30',
                               end: '23:30'
                              }"
              >
              </el-time-select>
              ～
              <el-time-select clearable style="width: 120px"
                              v-model="form.endTime"
                              value-format="HH:mm"
                              placeholder="HH:MM"
                              :picker-options="{
                              start: '00:30',
                              step: '00:30',
                              end: '23:59'
                            }"
              >
              </el-time-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="担当者" prop="resolveUser">
              <el-input v-model="form.resolveUserName" class="ym-input-standard" disabled>>
                <!--                <el-button slot="append" icon="el-icon-search" @click="openUser"/>-->
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作業区分" prop="content">
              <el-select v-model="form.content" placeholder="">
                <el-option
                  v-for="dict in dict.type.work_type"
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
            <el-form-item label="案件番号" prop="negotiationNo">
              <el-input v-model="form.negotiationNo" class="ym-input-standard" @blur="handleNegotiationNoBlur">
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="openNegotiationsIndex"
                  maxlength="10"
                />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="子番" prop="subNumber">
              <el-select
                v-model="form.subNumber"
                placeholder=""
                clearable
                :disabled="!form.negotiationNo"
                @change="handleSubNumberChange"
                filterable
              >
                <el-option
                  v-for="item in subNumberList"
                  :key="item.subNumber"
                  :label="item.subNumber"
                  :value="item.subNumber"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="活動番号" prop="activityNo">
              <el-select
                v-model="form.activityNo"
                placeholder=""
                clearable
                filterable
                :disabled="!form.subNumber"
                @change="handleActivityNoChange"
              >
                <el-option
                  v-for="item in activityList"
                  :key="item.activityNo"
                  :label="item.activityNo"
                  :value="item.activityNo"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="作業内容（詳細）" prop="contentDetail">
              <el-input v-model="form.contentDetail" type="textarea" placeholder="" maxlength="500"
                        show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button @click="cancel">キャンセル</el-button>
      </div>
    </el-dialog>

    <el-dialog title="日報フィードバック" :visible.sync="reactionOpen" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="138px">
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item label="上司フィードバック" prop="joushiFeedback">
              <el-input v-model="form.joushiFeedback" type="textarea" placeholder=""/>
            </el-form-item>
            <el-form-item label="リアクション">
              <div class="reaction-container">
                <div class="reaction-buttons">
                  <div
                    v-for="reaction in reactions"
                    :key="reaction.value"
                    class="reaction-button"
                    :class="{ 'active': selectedReactions.includes(reaction.value) }"
                    @click="toggleReaction(reaction.value)"
                  >
                    <span class="reaction-emoji">{{ reaction.emoji }}</span>
                    <span class="reaction-label">{{ reaction.label }}</span>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button @click="cancel">キャンセル</el-button>
      </div>
    </el-dialog>

    <userInput ref="userInput" @callback="handleUserCallback"/>
    <negotiations ref="negotiations" @callback="handleNegotiationsCallback"/>
  </div>
</template>


<script>
    import {listReport, delReport, addReport, updateReport, getReport} from "@/api/business/report";
    import userInput from "@/components/DeptUser/radio";
    import Negotiations from "@/components/Negotiations/radioIndex";
    import {getNegotiationAndActivityList} from "@/api/business/negotiations";
    import {listUser, selectBukaList} from "@/api/system/user";
    import {cloneDeep} from 'lodash';
    export default {
        name: "Report",
        components: {
            userInput,
            Negotiations,
        },
        dicts: ['work_type'],
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
                // 日報情報テーブルデータ
                reportList: [],
                form: {},
                // 検索パラメータ
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    dailyReportId: null,
                    startDate: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000),
                    endDate: new Date(),
                    resolveUser: null,
                    content: null,
                    negotiationNo: null,
                    activityNo: null,
                    contentDetail: null,
                },
                // ポップアップを表示するかどうか
                open: false,
                reactionOpen: false,
                rules: {
                    date: [
                        {required: true, message: '日付を入力してください', trigger: 'blur'},
                        {validator: this.validateDateTime, trigger: 'blur'}
                    ],
                    resolveUser: [
                        {required: true, message: '担当者を入力してください', trigger: 'blur'},
                    ],
                    contentDetail: [
                        {required: true, message: '作業内容を入力してください', trigger: 'blur'},
                        {max: 500, message: "は500文字以内で入力してください", trigger: "blur",},
                    ],
                    negotiationNo: [
                        {max: 10, message: "は10文字以内で入力してください", trigger: "blur",},
                    ],
                    joushiFeedback: [
                        {max: 200, message: "は200文字以内で入力してください", trigger: "blur",},
                    ]
                },
                title: '',
                subNumberList: [],
                activityList: [],
                userList: [],
                bukaList: [],
                // 案件番号旧值
                negotiationNoOld: '',
                selectedReactions: [],
                reactions: [
                    { value: 'ok', label: 'OK', emoji: '✅', color: '#67C23A' },
                    { value: 'good', label: 'Good', emoji: '⭐', color: '#E6A23C' },
                    { value: 'ng', label: 'NG', emoji: '❌', color: '#F56C6C' },
                    { value: 'thanks', label: 'ありがとう', emoji: '🙏', color: '#909399' },
                    { value: 'read', label: '既読', emoji: '👁️', color: '#409EFF' },
                    { value: 'sorry', label: 'すみません', emoji: '😔', color: '#F7BA1E' }
                ],
                searchBarExpanded: false,
            };
        },
        computed: {
            // テーブル高さ
            tableHeight() {
                let height = document.body.clientHeight - 320;
                return height < 300 ? 300 : height;
            },
        },

        /* アクティベート時 */
        activated() {
            // 削除禁止
            if (!this.isFirstSearch) {
                this.reload();
            }
            this.isFirstSearch = false;
        },

        async created() {
            // 初始化案件番号旧值
            this.negotiationNoOld = this.form.negotiationNo;
            await this.selectBukaInfos();
        },

        methods: {
            async selectBukaInfos() {
              await selectBukaList({userId: this.$store.getters.userId}).then(response => {
                this.bukaList = response.data;
              });
            },
            validateDateTime(rule, value, callback) {
                if (!this.form.date) {
                    return callback(new Error('日付を選択してください'));
                }

                if (!this.form.startTime) {
                    return callback(new Error('開始時間を選択してください'));
                }

                if (!this.form.endTime) {
                    return callback(new Error('終了時間を選択してください'));
                }

                const start = new Date(`2000-01-01T${this.form.startTime}`);
                const end = new Date(`2000-01-01T${this.form.endTime}`);
                if (end <= start) {
                    return callback(new Error('終了時間は開始時間より後に設定してください'));
                }

                callback();
            },
            // 再読み込み
            reload() {
                this.clearSelection();
                this.queryParams.pageNum = 1;
            },

            // テーブル選択データをクリア
            clearSelection() {
                this.$refs["dataTable"] && this.$refs["dataTable"].clearSelection();
            },

            /** 日報情報リスト取得 */
            getList() {
                this.loading = true;
                listUser({pageSize: -1}).then(response => {
                    this.userList = response.rows;
                });
                listReport(this.queryParams).then(response => {
                    this.reportList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                    this.$nextTick(() => {
                        this.$refs.dataTable.doLayout();
                    })
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
                this.queryParams.startDate = new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000);
                this.queryParams.endDate = new Date();
                this.reportList = [];
                this.total = 0;
            },

            // 複数選択時のデータ取得
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.dailyReportId)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },

            /** 追加ボタン操作 */
            handleAdd() {
                this.open = true;
                this.title = "日報情報登録";
                this.reset();
            },

            handleReaction(row) {
                this.reset();
                this.reactionOpen = true;
                this.form = cloneDeep(row);
                this.selectedReactions = this.form.reactions ? this.form.reactions.split(",") : [];
            },
            isOwnReport(row) {
                return String(row.resolveUser) === String(this.$store.getters.userId);
            },
            handleReportAction(row) {
                if (this.isOwnReport(row)) {
                    this.handleUpdate(row);
                } else {
                    this.handleReaction(row);
                }
            },

            /** 編集ボタン操作 */
            async handleUpdate(row) {
                this.reset();
                this.selectedReactions = [];
                const dailyReportId = row.dailyReportId;
                getReport(dailyReportId).then(response => {
                    this.form = response.data;
                    this.selectedReactions = this.form.reactions ? this.form.reactions.split(",") : [];
                    this.open = true;
                    this.title = "日報情報修正";
                    this.listSubNumber();
                    this.listActivity();
                })
            },

            handleCopy(row) {
                this.reset();
                const dailyReportId = row.dailyReportId;
                getReport(dailyReportId).then(response => {
                    this.form = response.data;
                    this.form.joushiFeedback = '';
                    this.form.reactions = '';
                    this.form.dailyReportId = null;
                    this.form.resolveUser = this.$store.getters.userId;
                    this.form.resolveUserName = this.$store.getters.nickName;
                    this.open = true;
                    this.title = "日報情報登録";
                    this.listSubNumber();
                    this.listActivity();
                })
            },

            /** 削除ボタン操作 */
            handleDelete(row) {
                const dailyReportIds = row.dailyReportId || this.ids;
                let that = this;
                that.$modal.confirm('削除してもよろしいですか？').then(function () {
                    that.$modal.loading();
                    delReport(dailyReportIds).then(response => {
                        that.getList();
                        that.$modal.msgSuccess("削除しました。");
                    }).catch((err) => console.log(err))
                        .finally(() => that.$modal.closeLoading());
                })
            },

            /** エクスポートボタン操作 */
            handleExport() {
                this.download('business/report/export', {
                    ...this.queryParams
                }, `report_${new Date().getTime()}.xlsx`)
            },

            /** 送信ボタン */
            submitForm() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.form.dailyReportId != undefined) {
                            this.form.reactions = this.selectedReactions.length > 0 ? this.selectedReactions.join(',') : '';
                            updateReport(this.form).then(response => {
                                this.$modal.msgSuccess("保存しました。");
                                this.reactionOpen = false;
                                this.open = false;
                                this.getList();
                            });
                        } else {
                            addReport(this.form).then(response => {
                                this.$modal.msgSuccess("登録しました。");
                                this.reactionOpen = false;
                                this.open = false;
                                this.getList();
                            });
                        }
                    }
                });
            },
            // キャンセルボタン
            cancel() {
                this.open = false;
                this.reactionOpen = false;
                this.reset();
            },
            reset() {
                if (this.$refs.form) {
                    this.$refs.form.clearValidate();
                }
                this.form = {
                    date: new Date(),
                    startTime: '09:00',
                    endTime: '18:00',
                    resolveUser: this.$store.getters.userId,
                    resolveUserName: this.$store.getters.nickName,
                    content: null,
                    negotiationNo: null,
                    subNumber: null,
                    activityNo: null,
                    contentDetail: null,
                    joushiFeedback: null,
                    reactions: ''
                };
                this.subNumberList = [];
                this.activityList = [];
            },
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合計';
                        return;
                    }
                    if (column.property === 'hours') {
                        const values = data.map(item => {
                            const value = parseFloat(item[column.property]);
                            return isNaN(value) ? 0 : value;
                        });
                        if (!values.every(value => isNaN(value))) {
                            const sum = values.reduce((prev, curr) => {
                                const value = parseFloat(curr);
                                return prev + (isNaN(value) ? 0 : value);
                            }, 0);
                            sums[index] = `${sum.toFixed(1)}`;
                        } else {
                            sums[index] = '0.0';
                        }
                    } else {
                        // 其他列显示空或保持原样
                        sums[index] = '';
                    }
                });
                return sums;
            },

            handleUserCallback(user) {
                this.form.resolveUser = user.userId
                this.form.resolveUserName = user.nickName
            },
            openUser() {
                this.$refs.userInput.open(this.form.resolveUser);
            },
            openNegotiationsIndex() {
                this.$refs.negotiations.open(this.form);
            },
            handleNegotiationsCallback(negotiations) {
                this.form.negotiationNo = negotiations.negotiationNo
                this.form.subNumber = negotiations.subNumber
                this.form.activityNo = negotiations.activityNo
                this.form.contentDetail = negotiations.proposal

                this.subNumberList = [];
                this.activityList = [];
                this.listSubNumber();
                this.listActivity();
            },
            handleNegotiationNoBlur() {
                const currentValue = this.form.negotiationNo;
                // 比较新旧值是否发生变化
                if (currentValue !== this.negotiationNoOld) {
                    this.form.subNumber = "";
                    this.form.activityNo = "";
                    this.subNumberList = [];
                    this.activityList = [];
                    if (currentValue) {
                        this.listSubNumber();
                    }
                    // 更新旧值
                    this.negotiationNoOld = currentValue;
                }
            },
            handleSubNumberChange(val) {
                this.form.activityNo = "";
                this.activityList = [];
                this.listActivity();
            },
            async listSubNumber() {
                if (this.form.negotiationNo) {
                    this.$modal.loading();
                    let vo = {
                        negotiationNo: this.form.negotiationNo,
                        subNumber: null,
                    }
                    getNegotiationAndActivityList(vo).then(data => {
                        if (data && data.length > 0) {
                            const subNumbers = [...new Set(data.map(item => item.subNumber))].filter(Boolean);
                            this.subNumberList = subNumbers.map(num => ({subNumber: num}));
                        } else {
                            this.form.negotiationNo = "";
                            this.form.subNumber = "";
                            this.form.activityNo = "";
                            this.$modal.msgError('案件番号が存在しません');
                        }
                        this.$modal.closeLoading();
                    });
                }
            },
            listActivity() {
                if (this.form.negotiationNo && this.form.subNumber) {
                    this.$modal.loading();
                    let vo = {
                        negotiationNo: this.form.negotiationNo,
                        subNumber: this.form.subNumber,
                    }
                    getNegotiationAndActivityList(vo).then((data) => {
                        this.activityList = data;
                        this.$modal.closeLoading();
                    });
                }
            },
            handleActivityNoChange() {
                let activity = this.activityList.filter(item => item.activityNo === this.form.activityNo);
                this.form.contentDetail = activity[0].proposal
            },
            toggleReaction(value) {
                if (this.selectedReactions.includes(value)) {
                    this.selectedReactions = this.selectedReactions.filter(v => v !== value);
                } else {
                    this.selectedReactions.push(value);
                }
            },
            getReactionEmoji(value) {
                const reaction = this.reactions.find(r => r.value === value);
                return reaction ? reaction.emoji : '';
            },
            getReactionLabel(value) {
                const reaction = this.reactions.find(r => r.value === value);
                return reaction ? reaction.label : '';
            },
        }
    };
</script>
<style scoped>
  .reaction-container {
    padding: 16px;
    background-color: #F5F7FA;
    border-radius: 8px;
  }

  .reaction-title {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 12px;
  }

  .reaction-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .reaction-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 8px;
    background-color: #FFFFFF;
    border: 1px solid #DCDFE6;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 80px;
  }

  .reaction-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: #C0C4CC;
  }

  .reaction-button.active {
    border-color: #409EFF;
    background-color: #ECF5FF;
  }

  .reaction-emoji {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .reaction-label {
    font-size: 12px;
    color: #606266;
    text-align: center;
    line-height: 1.2;
  }

  .reaction-count {
    margin-top: 4px;
    font-size: 11px;
    color: #909399;
    background-color: #F5F7FA;
    padding: 2px 6px;
    border-radius: 10px;
  }

  .selected-reactions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .selected-title {
    font-size: 12px;
    color: #606266;
  }

  .selected-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background-color: #E4E7ED;
    border-radius: 4px;
    font-size: 12px;
    color: #606266;
  }

  .selected-tag .el-icon-close {
    font-size: 10px;
    cursor: pointer;
    color: #909399;
  }

</style>
