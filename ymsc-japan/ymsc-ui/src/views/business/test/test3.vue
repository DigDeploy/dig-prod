<template>
    <div class="app-container-router">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-row :gutter="10">
                <el-col :span="3">
                    <el-form-item label="案件番号" prop="cusNameShort11" label-width="80px">
                        <el-input v-model="form.cusNameShort" placeholder="" disabled/>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item label="子番" prop="cusNameShort11" label-width="80px">
                        <el-input v-model="form.cusNameShort" placeholder="" disabled/>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item label="命令書No" prop="cusNameShort11" label-width="90px">
                        <el-input v-model="form.cusNameShort" placeholder="" disabled/>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="報告書No" prop="cusNameShort11" label-width="90px">
                        <el-input v-model="form.cusNameShort" placeholder="" />
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="3">
                    <el-form-item label="" prop="cusNameShort11" label-width="5px">
                        <el-input v-model="form.cusNameShort" placeholder="" />
                    </el-form-item>
                </el-col>
                <el-col :span="0" style="display: flex; align-items: center; margin-top:4px; padding: 0 2px; font-size: 14px;font-size: 25px;">
                /
                </el-col>
                <el-col :span="3">
                    <el-form-item label="" prop="cusNameShort11" label-width="5px">
                        <el-input v-model="form.cusNameShort" placeholder="" />
                    </el-form-item>
                </el-col> -->
            </el-row>

            
            <title-bar title="出張報告書 ＆ 続紙" is-top style="padding-top:5px">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <div style="display: flex; gap: 0; width: 99%;">
                            <el-form-item label="出張日" prop="expDateStart1" style="flex: 7;">
                                    <el-date-picker clearable
                                                v-model="form.expDateStart"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                placeholder=""
                                                @change="checkDateRange" style="width: 100%;">
                                </el-date-picker>
                            </el-form-item>
                            <span>～</span>
                             <el-form-item label="" prop="expDateStart2" style="flex: 5;" label-width="0px"> 
                                <el-date-picker clearable
                                                    v-model="form.expDateEnd"
                                                    type="date"
                                                    value-format="yyyy-MM-dd"
                                                    placeholder=""
                                                    @change="checkDateRange" style="width: 100%;">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="20">
                            <el-form-item label="目的" prop="cusNameShort">
                                <el-input v-model="form.cusNameShort" placeholder="" />
                            </el-form-item>
                    </el-col>
                    <el-col :span="20">
                            <el-form-item label="目的の補足欄" prop="address">
                                <el-input v-model="form.address" type="textarea" placeholder="" />
                            </el-form-item>
                    </el-col>
                    <el-col :span="20">
                            <el-form-item label="面会者名等" prop="customerTel">
                                <el-input v-model="form.customerTel" placeholder="" />
                            </el-form-item>
                    </el-col>
                    <el-col :span="20">
                            <el-form-item label="結果" prop="customerFax" >
                                <el-input v-model="form.customerFax" type="textarea" placeholder="" />
                            </el-form-item>
                    </el-col>
                    <el-col :span="20">
                            <el-form-item label="課題・宿題等" >
                                <el-input v-model="form.invoiceNum" type="textarea" placeholder="" />
                            </el-form-item>
                    </el-col>
                    <el-col :span="20">
                            <el-form-item label="備考・補足">
                                <el-input v-model="form.deptName" type="textarea" placeholder="" />
                            </el-form-item>
                    </el-col>
                    <el-col :span="18"></el-col>
                </el-row>
            </title-bar>

        </el-form>
        <div class="footer-back">
            <el-button type="primary" @click="submitForm">登録</el-button>
            <!-- <el-button @click="handleClose">戻る</el-button> -->
        </div>
    </div>
</template>


<script>
    import { addInfo,getInfo} from "@/api/business/customerInfo";

    export default {
        name: "InfoAdd",
            dicts: ['sys_user_sex','customer_inhouse_class','customer_foreign_trade_class'],
        data() {
            return {
                fromRouterPath: '',
                fromRouterQuery: '',
                // フォームデータ
                form: {},
                // フォーム検証ルール
                rules: {
                    yushiNo: [
                        { max: 8, message: 'は8文字以内で入力してください', trigger: 'blur' } 
                    ],
                    customerName: [
                        { required: true, message: '空ではいけません', trigger: 'blur' },
                        { max: 60, message: 'は60文字以内で入力してください', trigger: 'blur' } 
                    ],
                    cusNameShort: [
                        { required: true, message: '空ではいけません', trigger: 'blur' },
                        { max: 20, message: 'は20文字以内で入力してください', trigger: 'blur' } 
                    ],
                    invoiceNum: [
                        { required: true, message: '空ではいけません', trigger: 'blur' },
                        { max: 8, message: 'は8文字以内で入力してください', trigger: 'blur' } 
                    ],
                    deptName: [
                        { required: true, message: '空ではいけません', trigger: 'blur' },
                        { max: 8, message: 'は8文字以内で入力してください', trigger: 'blur' } 
                    ],
                    address: [
                        { required: true, message: '空ではいけません', trigger: 'blur' },
                        { max: 6, message: 'は60文字以内で入力してください', trigger: 'blur' } 
                    ],
                    customerTel: [
                        { required: true, message: '空ではいけません', trigger: 'blur' },
                        { max: 17, message: 'は17文字以内で入力してください', trigger: 'blur' } 
                    ],
                    customerFax: [
                        { required: true, message: '空ではいけません', trigger: 'blur' },
                        { max: 17, message: 'は17文字以内で入力してください', trigger: 'blur' } 
                    ],
                    expDateStart1: [
                        { required: true, message: '空ではいけません', trigger: 'blur' },
                        { max: 17, message: 'は17文字以内で入力してください', trigger: 'blur' } 
                    ],
                    expDateStart2: [
                        { required: true, message: '空ではいけません', trigger: 'blur' },
                        { max: 17, message: 'は17文字以内で入力してください', trigger: 'blur' } 
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
            checkGetData(){
                const customerNo = this.form.customerNo;
                if(customerNo != undefined){
                    getInfo(customerNo).then(response => {
                        if(response.data != null){
                            this.form = response.data;
                            this.form.zipcode1 = response.data.zipcode.split('-')[0];
                            this.form.zipcode2 = response.data.zipcode.split('-')[1];
                            
                            this.form.customerDept1 = response.data.customerDept.split('-')[0];
                            this.form.customerDept2 = response.data.customerDept.split('-')[1];

                            this.form.deptZip1 = response.data.deptZip.split('-')[0];
                            this.form.deptZip2 = response.data.deptZip.split('-')[1];
                        }
                    }).catch((err) => console.log(err))
                            .finally(() => this.$modal.closeLoading());
                }
            },
            checkDateRange() {
                this.$refs.formRef.validateField('expDateEnd');
            },
            // 戻る／閉じる
            handleClose() {
                // 移動設定
                const obj = {path: this.fromRouterPath, query: this.fromRouterQuery};
                // 現在のタブを閉じて指定ページを開く
                this.$tab.closeOpenPage(obj);
            },

            submitForm() {
                const deptZipStr = (this.form.deptZip1 == undefined?'' :this.form.deptZip1 )+ '-' + (this.form.deptZip2 == undefined?'' : this.form.deptZip2)
                const customerDeptStr = (this.form.customerDept1 == undefined?'' :this.form.customerDept1 )+ '-' + (this.form.customerDept2 == undefined?'' : this.form.customerDept2)
                const zipcodeStr = (this.form.zipcode1 == undefined?'' :this.form.zipcode1 )+ '-' + (this.form.zipcode2 == undefined?'' : this.form.zipcode2) 

                this.form.deptZip = deptZipStr == '-'? null : deptZipStr
                this.form.customerDept = customerDeptStr == '-'? null : customerDeptStr
                this.form.zipcode = zipcodeStr == '-'? null : zipcodeStr

                this.$refs["form"].validate(valid => {
                    if (valid) {
                        this.$modal.loading();
                        addInfo(this.form).then(response => {
                            this.$modal.msgSuccess("追加成功");
                            //this.handleClose();
                            this.form = {}
                        }).catch((err) => console.log(err))
                                .finally(() => this.$modal.closeLoading());
                    }
                });
            },
        }
    };
</script>

