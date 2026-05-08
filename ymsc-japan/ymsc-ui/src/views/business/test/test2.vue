<template>


    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <div style="width:100%;">
            <el-row :gutter="10" style="padding-top:50px">
                <el-col :span="5" style="padding-top:70px">
                    <el-form-item 
                    label="案件番号" 
                    prop="customerNo1" 
                    label-width="120px"
                    style="margin: 0;"
                    >
                    <el-input 
                        v-model="form.customerNo" 
                        placeholder="" 
                        disabled
                        style="background-color: #ffffff; border: 1px solid #dcdfe6;"
                    />
                    </el-form-item>
                </el-col>
                <el-col :span="3" style="padding-top:70px">
                    <el-form-item 
                    label="子番" 
                    prop="orderNo" 
                    label-width="50px"
                    style="margin: 0;"
                    >
                    <el-input 
                        v-model="form.orderNo" 
                        placeholder="" 
                        disabled
                        style="background-color: #f5f7fa; border: 1px solid #dcdfe6;"
                    />
                    </el-form-item>
                </el-col>
                <el-col :span="3" style="padding-top:70px">
                    <el-form-item 
                    label="命令書No" 
                    prop="orderNo" 
                    label-width="75px"
                    style="margin: 0;"
                    >
                    <el-input 
                        v-model="form.orderNo" 
                        placeholder="" 
                        disabled
                        style="background-color: #f5f7fa; border: 1px solid #dcdfe6;"
                    />
                    </el-form-item>
                </el-col>
                <el-col :span="3" style="padding-top:70px">
                    <el-form-item 
                    label="旅費精算No" 
                    prop="expenseNo" 
                    label-width="90px"
                    style="margin: 0;"
                    >
                    <el-input 
                        v-model="form.expenseNo" 
                        placeholder="" 
                        disabled
                        style="background-color: #f5f7fa; border: 1px solid #dcdfe6;"
                    />
                    </el-form-item>
                </el-col>

                <!-- <el-col :span="2" style="min-height: 1px; width: 150px;"></el-col>
                <el-col :span="2" style="padding: 0 !important;">
                    <div style=" border: 1px solid #c6e2ff; min-height: 107px; display: flex; align-items: center; justify-content: center; font-weight: bold;font-size: 13px;">
                    承認者
                    </div>
                </el-col>

                <el-col :span="1.5" style="padding: 0 !important;">
                    <div style="border: 1px solid #dcdfe6; border-left: none;">
                        <div style="text-align: center; padding: 5px; border-bottom: 1px solid #dcdfe6; font-weight: bold;font-size: 13px;">
                            社長
                        </div>
                        <div style="padding: 8px; font-size: 13px; line-height: 1.5;">
                            <div style="text-align: center;">yyyy/mm/dd</div>
                            <div style="text-align: center;">名前</div>
                        </div>
                        <el-button type="primary"  @click="handleAddRow1" style=" text-align: center; padding: 4px; font-size: 12px;width:100%;">社長承認</el-button>
                    </div>
                </el-col>

                <el-col :span="1.5" style="padding: 0 !important;">
                    <div style="border: 1px solid #dcdfe6; border-left: none;">
                        <div style=" text-align: center; padding: 5px; border-bottom: 1px solid #dcdfe6; font-weight: bold;font-size: 13px;">
                            総務
                        </div>
                        <div style="padding: 8px; font-size: 13px; line-height: 1.5;">
                            <div style="text-align: center;">yyyy/mm/dd</div>
                            <div style="text-align: center;">名前</div>
                        </div>
                        <el-button type="primary"  @click="handleAddRow1" style=" text-align: center; padding: 4px; font-size: 12px;width:100%;font-size: 13px;">総務</el-button>
                    </div>
                </el-col>

                <el-col :span="1.5" style="padding: 0 !important;">
                    <div style="border: 1px solid #dcdfe6; border-left: none;">
                        <div style="text-align: center; padding: 5px; border-bottom: 1px solid #dcdfe6; font-weight: bold;font-size: 13px;">
                            所属部長
                        </div>
                        <div style="padding: 8px; font-size: 13px; line-height: 1.5;">
                            <div style="text-align: center;">yyyy/mm/dd</div>
                            <div style="text-align: center;">名前</div>
                        </div>
                        <el-button type="primary"  @click="handleAddRow1" style=" text-align: center; padding: 4px; font-size: 12px;width:100%;">部長承認</el-button>
                    </div>
                </el-col>

                <el-col :span="1.5" style="padding: 0 !important;">
                    <div style="border: 1px solid #dcdfe6; border-left: none;">
                        <div style="text-align: center; padding: 5px; border-bottom: 1px solid #dcdfe6; font-weight: bold;font-size: 13px;">
                            所属課長
                        </div>
                        <div style="padding: 8px; font-size: 13px; line-height: 1.5;">
                            <div style="text-align: center;">yyyy/mm/dd</div>
                            <div style="text-align: center;">名前</div>
                        </div>
                        <el-button type="primary"  @click="handleAddRow1" style=" text-align: center; padding: 4px; font-size: 12px;width:100%;">課長承認</el-button>
                    </div>
                </el-col> -->
            </el-row>
        </div>
                        
           
        
        
        <div class="app-container-router">


            <title-bar title="旅費精算請求書" is-top style="padding-top:0px;width:100%;">
                <el-row :gutter="10" style="padding: 0 1em 0 1em;">
                    <el-col :span="8" >
                        <el-form-item label="" prop="customerNo" label-width="0px">
                            <span style="display: block; text-align: center;"><span class="el-table-required">*</span>出張先・所在地</span>
                            <el-input v-model="form.customerNo" placeholder="" />
                            <el-input v-model="form.customerNo" placeholder="" style="padding-top:3px"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="" prop="yushiNo" label-width="0px">
                            <span style="display: block; text-align: center;"><span class="el-table-required">*</span>要件・作業内容</span>
                            <el-input v-model="form.yushiNo" placeholder="" type="textarea" :rows="3"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="" prop="customerName" label-width="0px">
                            <span style="display: block; text-align: center;"><span class="el-table-required">*</span>出張者・所属・氏名</span>
                            <el-input v-model="form.customerName" placeholder=""  />
                            <el-input v-model="form.customerName" placeholder=""  style="padding-top:3px"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div style="width: 100%; margin: 0px 0; padding-left: 1em;"> 
                    <el-row :gutter="0" style="width: 100%;">
                        <el-col 
                            :span="4" 
                            style="font-weight: bold;font-size: 15px;"
                        >
                            1. 乗り物代
                        </el-col>
                        <el-col 
                            :span="20" 
                            style="min-height: 68px; box-sizing: border-box;
                            line-height: 1.6; font-size: 14px;padding-left: 250px;"
                        >
                            <span style="display: block; ">（注</span>
                            <span style="display: block; text-indent: 2em; margin-top: -1.6em; padding-left: 1em;">1.複数で出張した場合のタクシー代等の共通経費は上席者が請求すること</span>
                            <span style="display: block; text-indent: 3em;">2.タクシー代その他の支出は領収書を添付すること）</span>
                        </el-col>
                        
                    </el-row>
                </div>


                <div class="editable-table-container">
                   <el-button type="primary" icon="el-icon-plus" @click="handleAddRow" style="margin-bottom:5px">新規行</el-button>
                    <el-table
                    :data="tableData"
                    border
                    :header-align="center"
                    :align="center"
                    ref="editableTable"
                    style="width: 100%;"
                    show-summary
                    :summary-method="getTableSummary"
                    >
                    <el-table-column label="年月日" prop="date" width="100" >
                        <template #header>
                            <span class="el-table-required">*</span>
                            <span>年月日</span>
                        </template>
                        <template #default="scope">
                        <div v-if="scope.row.edit">
                            <el-input
                            v-model="scope.row.date"
                            size="mini"
                            @blur="handleSave(scope)"
                            @keyup.enter="handleSave(scope)"
                            placeholder="例：2026/01/29"
                            />
                        </div>
                        <div v-else @click="handleEdit(scope)" class="cell-text">{{ scope.row.date || '' }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="発着時刻" prop="time" width="90">
                        <template #header>
                            <span class="el-table-required">*</span>
                            <span>発着時刻</span>
                        </template>
                        <template #default="scope">
                        <div v-if="scope.row.edit">
                            <el-input
                            v-model="scope.row.time"
                            size="mini"
                            @blur="handleSave(scope)"
                            @keyup.enter="handleSave(scope)"
                            placeholder="例：09:30"
                            />
                        </div>
                        <div v-else @click="handleEdit(scope)" class="cell-text">{{ scope.row.time || '' }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="場所(駅)名" prop="station" width="100">
                        <template #header>
                            <span class="el-table-required">*</span>
                            <span>場所(駅)名</span>
                        </template>
                        <template #default="scope">
                        <div v-if="scope.row.edit">
                            <el-input
                            v-model="scope.row.station"
                            size="mini"
                            @blur="handleSave(scope)"
                            @keyup.enter="handleSave(scope)"
                            placeholder="例：東京駅"
                            />
                        </div>
                        <div v-else @click="handleEdit(scope)" class="cell-text">{{ scope.row.station || '' }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="急行の名前寝台の等級" prop="trainInfo" width="170">
                        <!-- <template #header>
                            <span class="el-table-required">*</span>
                            <span>急行の名前寝台の等級</span>
                        </template> -->
                        <template #default="scope">
                        <div v-if="scope.row.edit">
                            <el-input
                            v-model="scope.row.trainInfo"
                            size="mini"
                            @blur="handleSave(scope)"
                            @keyup.enter="handleSave(scope)"
                            placeholder="例：はやぶさ寝台A"
                            />
                        </div>
                        <div v-else @click="handleEdit(scope)" class="cell-text">{{ scope.row.trainInfo || '' }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="電車賃船賃" prop="trainFare" width="110">
                        <!-- <template #header>
                            <span class="el-table-required">*</span>
                            <span>電車賃船賃</span>
                        </template> -->
                        <template #default="scope">
                        <div v-if="scope.row.edit">
                            <el-input
                            v-model.number="scope.row.trainFare"
                            size="mini"
                            @blur="handleSave(scope)"
                            @keyup.enter="handleSave(scope)"
                            placeholder="0"
                            type="number"
                            min="0"
                            />
                        </div>
                        <div v-else @click="handleEdit(scope)" class="cell-text">{{ scope.row.trainFare || '' }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="急行寝台料" prop="expressFare" width="110">
                        <!-- <template #header>
                            <span class="el-table-required">*</span>
                            <span>急行寝台料</span>
                        </template> -->
                        <template #default="scope">
                        <div v-if="scope.row.edit">
                            <el-input
                            v-model.number="scope.row.expressFare"
                            size="mini"
                            @blur="handleSave(scope)"
                            @keyup.enter="handleSave(scope)"
                            placeholder="0"
                            type="number"
                            min="0"
                            />
                        </div>
                        <div v-else @click="handleEdit(scope)" class="cell-text">{{ scope.row.expressFare || '' }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="車賃ｽｸｯｼﾞｰ貸" prop="carRental" width="120">
                        <!-- <template #header>
                            <span class="el-table-required">*</span>
                            <span>車賃ｽｸｯｼﾞｰ貸</span>
                        </template> -->
                        <template #default="scope">
                        <div v-if="scope.row.edit">
                            <el-input
                            v-model.number="scope.row.carRental"
                            size="mini"
                            @blur="handleSave(scope)"
                            @keyup.enter="handleSave(scope)"
                            placeholder="0"
                            type="number"
                            min="0"
                            />
                        </div>
                        <div v-else @click="handleEdit(scope)" class="cell-text">{{ scope.row.carRental || '' }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="車賃･その他の支出説明" prop="otherDesc">
                        <template #default="scope">
                        <div v-if="scope.row.edit">
                            <el-input
                            v-model="scope.row.otherDesc"
                            size="mini"
                            type="textarea"
                            :rows="2"
                            @blur="handleSave(scope)"
                            @keyup.enter="handleSave(scope)"
                            placeholder="支出の詳細を記入"
                            />
                        </div>
                        <div v-else @click="handleEdit(scope)" class="cell-text multi-line">{{ scope.row.otherDesc || '' }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="170">
                        <template #default="scope">
                        <el-button
                            v-if="!scope.row.edit"
                            size="mini"
                            type="primary"
                            icon="el-icon-edit"
                            @click="handleEdit(scope)"
                        >編集</el-button>
                        <el-button
                            v-if="scope.row.edit"
                            size="mini"
                            type="success"
                            icon="el-icon-check"
                            @click="handleSave(scope)"
                            style="margin-right: 5px;"
                        >保存</el-button>
                        <el-button
                            v-if="scope.row.edit"
                            size="mini"
                            type="warning"
                            icon="el-icon-close"
                            @click="handleCancel(scope)"
                            style="margin-right: 5px;"
                        >キャンセル</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row.id)"
                        >削除</el-button>
                        </template>
                    </el-table-column>
                    </el-table>
                </div>


                <div class="expense-report-container">
                <div class="section1">
                    <span style="font-weight: bold;">2. その他</span>
                    <table class="expense-table">
                        <thead>
                        <tr>
                            <th rowspan="2" class="day-column"><span style="letter-spacing: 20px;margin-right: -30px;">日当</span></th>
                            <th colspan="2" ><span style="letter-spacing: 20px;margin-right: -30px;">宿泊費</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td >出発から帰着<br>までの日数</td>
                            <td><span style="letter-spacing: 20px;margin-right: -20px;">旅館</span></td>
                            <td><span style="letter-spacing: 20px;margin-right: -20px;">車中泊</span></td>
                        </tr>
                        <tr>
                            <td class="fee-amount1">日</td>
                            <td class="fee-amount1">泊</td>
                            <td class="fee-amount1">泊</td>
                        </tr>
                        <tr>
                            <td class="fee-amount1">円</td>
                            <td class="fee-amount1">円</td>
                            <td class="fee-amount1">円</td>
                        </tr>
                        </tbody>
                    </table>

                    <div class="notes">
                        <p>・手続</p>
                        <span style="display: block; padding-left:70px; margin-top: -2.4em; " >出張者→所属課長→所属部長→社長→総務課 (フル)</span>
                        <!-- <img :src="require('@/assets/images/actuarial.png')" style="width: 50px; height: auto;margin-top: -4.4em;margin-left: 21em;" /> -->
                        <!-- <span style="display: block; padding-left:70px;text-indent: 10em;margin-top: -1.8em;"></span> -->
                        
                        <p>・書類</p>
                        <span style="display: block; padding-left:70px; margin-top: -2.4em; ">出張報告書（１）</span>
                        <span style="display: block; padding-left:70px;">出費精算請求書（２）</span>
                        <p>（注）３．(1) と(2)はまとめて速やか(10日以内)に提出のこと</p>
                    </div>
                </div>

                <div class="section2">
                    <span style="font-weight: bold;">3. 精算</span>
                    <table class="expense-table">
                        <tbody>
                        <tr>
                            <td class="fee-name"><span style="letter-spacing: 20px;margin-right: -20px;">運賃</span></td>
                            <td class="fee-amount">円</td>
                            <td rowspan="7" class="remark-column">
                                <span style="display: block; text-align: center;">備考(特別の支出があるとき</span>
                                <span style="display: block; text-align: right;">はその説明資料添付のこと)</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="fee-name"><span style="letter-spacing: 20px;margin-right: -20px;">日当</span></td>
                            <td class="fee-amount">円</td>
                        </tr>
                        <tr>
                            <td class="fee-name">宿泊費</td>
                            <td class="fee-amount">円</td>
                        </tr>
                        <tr>
                            <td class="fee-name">その他</td>
                            <td class="fee-amount">円</td>
                        </tr>
                        <tr>
                            <td class="fee-name">出張経費(A)</td>
                            <td class="fee-amount">円</td>
                        </tr>
                        <tr>
                            <td class="fee-name">仮払金(B)</td>
                            <td class="fee-amount">円</td>
                        </tr>
                        <tr>
                            <td class="fee-name">精算額<br>(A)-(B)</td>
                            <td class="fee-amount">円</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            </title-bar>
            

        
            <div class="footer-back">
                <el-button type="primary" @click="submitForm">登録</el-button>
                <!-- <el-button @click="handleClose">戻る</el-button> -->
            </div>
        </div>
    </el-form>
</template>


<script>
    import { addInfo,getInfo} from "@/api/business/customerInfo";

    export default {
        name: "InfoAdd",
            dicts: ['sys_user_sex','customer_inhouse_class','customer_foreign_trade_class'],
        data() {
            return {
                tableData: [
                    {
                        id: 1,
                        date: "",
                        time: "",
                        station: "",
                        trainInfo: "",
                        trainFare: "",
                        expressFare: "",
                        carRental: "",
                        otherDesc: "",
                        edit: false
                    },
                    {
                        id: 2,
                        date: "",
                        time: "",
                        station: "",
                        trainInfo: "",
                        trainFare: "",
                        expressFare: "",
                        carRental: "",
                        otherDesc: "",
                        edit: false
                    },
                    {
                        id: 3,
                        date: "",
                        time: "",
                        station: "",
                        trainInfo: "",
                        trainFare: "",
                        expressFare: "",
                        carRental: "",
                        otherDesc: "",
                        edit: false
                    }
                ],
                // 保存原始数据用于回滚
                originalData: {},
                // 唯一ID生成器
                nextId: 11,
                fromRouterPath: '',
                fromRouterQuery: '',
                // フォームデータ
                form: {},
                // フォーム検証ルール
                rules: {
                    // customerNo: [
                    //     { max: 6, message: 'は6文字以内で入力してください', trigger: 'blur' } 
                    // ],
                    yushiNo: [
                        { required: true, message: '空ではいけません', trigger: 'blur' },
                        { max: 8, message: 'は8文字以内で入力してください', trigger: 'blur' } 
                    ],
                    customerName: [
                        { required: true, message: '空ではいけません', trigger: 'blur' },
                        { max: 60, message: 'は60文字以内で入力してください', trigger: 'blur' } 
                    ],
                    customerNo: [
                        { required: true, message: '空ではいけません', trigger: 'blur' },
                        { max: 8, message: 'は8文字以内で入力してください', trigger: 'blur' } 
                    ]
                }
            };
        },
        // ルート遷移時
        beforeRouteEnter(to, from, next) {
            next(vm => {
                if(!vm.fromRouterPath) {
                    vm.fromRouterPath = from.path;
                    vm.fromRouterQuery = from.query;
                }
            });
        },
        created() {
            //this.$modal.loading();
            this.$modal.closeLoading();
        },
        methods: {
            // 进入编辑状态
                handleEdit(scope) {
                const { row } = scope;
                this.originalData[row.id] = { ...row };
                row.edit = true;
                // 关闭其他行的编辑态
                this.tableData.forEach(item => {
                    if (item.id !== row.id) item.edit = false;
                });
                },

                // 保存编辑
                handleSave(scope) {
                const { row } = scope;
                // 简单校验
                if (!row.date || row.date === "") {
                    this.$message.warning("请输入年月日！");
                    return;
                }
                row.edit = false;
                delete this.originalData[row.id];
                this.$message.success("保存成功！");
                },

                // 取消编辑
                handleCancel(scope) {
                const { row } = scope;
                if (this.originalData[row.id]) {
                    this.tableData.splice(
                    this.tableData.findIndex(item => item.id === row.id),
                    1,
                    this.originalData[row.id]
                    );
                    delete this.originalData[row.id];
                } else {
                    row.edit = false;
                }
                this.$message.info("已取消编辑！");
                },

                // 新增行
                handleAddRow() {
                const newRow = {
                    id: this.nextId++,
                    date: "",
                    time: "",
                    station: "",
                    trainInfo: "",
                    trainFare: "",
                    expressFare: "",
                    carRental: "",
                    otherDesc: "",
                    edit: true
                };
                this.tableData.push(newRow);
                this.originalData[newRow.id] = { ...newRow };
                // 关闭其他行编辑态
                this.tableData.forEach(item => {
                    if (item.id !== newRow.id) item.edit = false;
                });
                },

                // 删除行
                handleDelete(id) {
                this.$confirm("确定要删除这行吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    this.tableData = this.tableData.filter(item => item.id !== id);
                    delete this.originalData[id];
                    this.$message.success("删除成功！");
                }).catch(() => {
                    this.$message.info("已取消删除！");
                });
                },

                // 合计行计算
                getTableSummary({ columns, data }) {
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                    sums[index] = '小計';
                    } else if (index === 7) {
                    sums[index] = '計';
                    } else if (['trainFare', 'expressFare', 'carRental'].includes(column.prop)) {
                    const values = data.map(item => Number(item[column.prop]) || 0);
                    sums[index] = values.reduce((prev, curr) => prev + curr, 0);
                    } else {
                    sums[index] = '';
                    }
                });
                return sums;
                }
            }
    };
</script>

<style scoped>
.expense-report-container {
  font-family: Arial, sans-serif;
  padding: 1rem;
  display: flex;
  gap: 20rem;
  flex-wrap: wrap;
}

.section1 {
  min-width: 200px;
}

.section2 {
  flex: 1;
  min-width: 300px;
}


.expense-table {
  border-collapse: collapse;
  width: 100%;
  min-width: 500px;
  border: 1px solid #ccc;
  margin-bottom: 0rem;
}

.expense-table th,
.expense-table td {
  border: 1px solid #ccc;
  padding: 1px;
  text-align: center;
}

.expense-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.day-column {
  width: 20%;
}

.remark-column {
  width: 30%;
  text-align: center !important;
  vertical-align: top;
}

.notes {
  font-size: 0.9em;
  line-height: 1.5;
}

.fee-name {
  width: 10%; 
  white-space: nowrap;
}
.fee-amount {
  width: 20%;
  text-align: right !important; 
  padding-right: 30px !important; 
}
.fee-amount1 {
  width: 20%;
  text-align: right !important; 
  padding-right: 30px !important; 
}

.editable-table-container {
  padding: 0px 1rem 1rem 1rem;
}

.cell-text {
  cursor: pointer;
  color: #409eff;
  padding: 4px 0;
}

.cell-text:hover {
  text-decoration: underline;
}

.multi-line {
  white-space: pre-line;
  line-height: 1.4;
}

.el-table__summary td {
  font-weight: bold;
  text-align: center !important;
}

.el-table-required {
  color: #F56C6C; 
  margin-left: 4px; 
  font-weight: 700;
  margin-right: 6px;
}
</style>