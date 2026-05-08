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
                              value-format="yyyy-MM-dd"
                              placeholder="YYYY-MM-DD">
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
            <el-col :span="9">
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
            <el-form-item label="案件区分1" prop="negotiationCat1" label-width="108px">
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
            <el-form-item label="案件区分2" prop="negotiationCat2" label-width="108px">
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
            <el-form-item label="案件区分3" prop="negotiationCat3" label-width="108px">
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
            <el-form-item label="案件区分4" prop="negotiationCat4" label-width="108px">
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
            <el-form-item label="案件区分5" prop="negotiationCat5" label-width="108px">
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
            <el-form-item label="案件区分6" prop="negotiationCat6" label-width="108px">
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
            <el-form-item label="案件区分7" prop="negotiationCat7" label-width="108px">
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
            <el-form-item label="納入地域" prop="deliveryRegion" label-width="108px">
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
      <title-bar title="活動報告" is-top>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="案件進捗(最新）" prop="customerNo">
              <el-select v-model="status" placeholder="" disabled>
                <el-option
                  v-for="dict in dict.type.negotiation_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-table :data="form.activityList" border ref="dataTable">
          <el-table-column label="No." type="index" width="55" :header-align="alignTableConfig.header"
                           :align="alignTableConfig.lineNo">
          </el-table-column>
          <el-table-column label="活動日" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                           prop="activityDate"
                           width="180">
            <template slot-scope="scope">
              <span @click="handleDetailActivity(scope.row)" style="cursor: pointer; color: #409EFF;">{{ parseTime(scope.row.activityDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="活動時間" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                           width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.startDate }}～{{ scope.row.endDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="担当者" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                           prop="mainResponsibleName" width="120"/>
          <el-table-column label="案件進捗" :header-align="alignTableConfig.header" :align="alignTableConfig.tag"
                           prop="status" width="100">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.negotiation_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="活動種別" :header-align="alignTableConfig.header" :align="alignTableConfig.tag"
                           prop="type" width="160">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.activity_type" :value="scope.row.type"/>
            </template>
          </el-table-column>
          <el-table-column label="活動内容" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                           show-overflow-tooltip width="280" prop="proposal"/>
          <el-table-column label="次回アクション日" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                           prop="nextDate"
                           width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.nextDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="次回活動種別" :header-align="alignTableConfig.header" :align="alignTableConfig.tag" width="120"
                           prop="nextType">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.activity_type" :value="scope.row.nextType"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" :header-align="alignTableConfig.header" :align="alignTableConfig.action"
                           class-name="small-padding fixed-width" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document"
                @click="handleDetailActivity(scope.row, scope.$index)"
              >参照
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </title-bar>
      <title-bar title="見積番号・受注番号" is-top>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="見積番号" prop="quotationNo">
              <div class="input-button-group">
                <el-input v-model="form.quotation.quotationNo" disabled/>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="連携用見積番号" prop="coopQuotationId">
              <el-input v-model="form.quotation.coopQuotationId" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="受注番号" prop="orderNo">
              <el-input v-model="form.quotation.orderNo" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button
              type="primary"
              style="height: 40px"
              size="mini"
              @click="openQuotation()"
            >見積・受注詳細
            </el-button>
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
            <el-form-item label="重要度" prop="importance" label-width="98px">
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
            <el-form-item label="難易度" prop="difficulty" label-width="98px">
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
            <el-form-item label="物量" prop="volumeOfGoods" label-width="98px">
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
            <el-form-item label="付加価値" prop="addedValue" label-width="98px">
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
            <el-form-item label="確率" prop="probability" label-width="98px">
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
          <el-table-column label="登録日時" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="date"
                           width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.date, '{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="部門" :header-align="alignTableConfig.header" :align="alignTableConfig.text" width="140px"
                           show-overflow-tooltip
                           prop="deptName"/>
          <el-table-column label="氏名" :header-align="alignTableConfig.header" :align="alignTableConfig.text" width="240px"
                           show-overflow-tooltip
                           prop="name"/>
          <el-table-column label="コメント" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                           show-overflow-tooltip
                           prop="comment"/>
        </el-table>
      </title-bar>
    </el-form>
    <el-dialog title="コメント" :visible.sync="commentOpen" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="138px">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="コメント" prop="joushiFeedback">
              <el-input v-model="comment" type="textarea" maxlength="200"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitComment">確定</el-button>
        <el-button @click="cancelComment">キャンセル</el-button>
      </div>
    </el-dialog>
    <el-dialog title="見積・受注" :visible.sync="quotationOpen" width="1300px" append-to-body style="overflow: hidden;">
      <div style="max-height: calc(95vh - 220px); overflow-y: auto; padding-right: 10px;">
        <el-form ref="quotationForm" :model="form.quotation" :rules="quotationRules" label-width="138px">
          <title-bar title="案件情報" is-top>
            <el-row :gutter="10">
              <el-col :span="6">
                <el-form-item label="案件種類" prop="nextPriority">
                  <el-select v-model="form.negotiationType" placeholder="" disabled>
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
                  <el-input v-model="form.negotiationNo" disabled>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="子番" prop="subNumber">
                  <el-input v-model="form.subNumber" disabled/>
                </el-form-item>
              </el-col>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="得意先番号" prop="customerNo">
                    <el-input v-model="form.customerNo" disabled/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="得意先名" prop="customerName">
                    <el-input v-model="form.customerName" disabled/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="案件名" prop="negotiationName">
                    <el-input v-model="form.negotiationName" disabled/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="業務内容" prop="businessContent">
                    <el-input type="textarea" v-model="form.businessContent" disabled/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
          </title-bar>
          <title-bar title="見積情報" is-top>
            <el-row>
              <el-col :span="12">
                <el-form-item label="見積日" prop="quotationDay">
                  <el-date-picker clearable disabled
                                  v-model="form.quotation.quotationDay"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="見積ステータス" prop="status">
                  <el-select v-model="form.quotation.status" disabled placeholder="">
                    <el-option
                      v-for="dict in dict.type.quotation_status"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="見積番号" prop="quotationNo">
                  <el-input v-model="form.quotation.quotationNo" disabled/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="連携用見積番号" prop="coopQuotationId">
                  <el-input v-model="form.quotation.coopQuotationId" disabled maxlength="20"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="概算金額" prop="estimateAmount">
                  <el-input v-model="form.quotation.estimateAmount" disabled/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="単位" prop="unit">
                  <el-select v-model="form.quotation.unit" disabled placeholder="">
                    <el-option
                      v-for="dict in dict.type.unit"
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
                  <el-input type="textarea" v-model="form.quotation.remark" disabled maxlength="100"/>
                </el-form-item>
              </el-col>
            </el-row>
          </title-bar>
          <title-bar title="受注情報" is-top>
            <el-row>
              <el-col :span="12">
                <el-form-item label="受注日" prop="orderDay">
                  <el-date-picker clearable disabled
                                  v-model="form.quotation.orderDay"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="受注番号" prop="orderNo">
                  <el-input v-model="form.quotation.orderNo" disabled maxlength="50"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="担当部門（正）" prop="orderDept">
                  <el-input v-model="form.quotation.orderDept" disabled maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="担当者（正）" prop="orderUser">
                  <el-input v-model="form.quotation.orderUser" disabled maxlength="25"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="担当部門（副）" prop="orderDeptSub">
                  <el-input v-model="form.quotation.orderDeptSub" disabled maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="担当者（副）" prop="orderUserSub">
                  <el-input v-model="form.quotation.orderUserSub" disabled maxlength="25"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="備考" prop="orderRemark">
                  <el-input type="textarea" v-model="form.quotation.orderRemark" disabled
                            maxlength="100"/>
                </el-form-item>
              </el-col>
            </el-row>
          </title-bar>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelQuotation">確定</el-button>
      </div>
    </el-dialog>
    <activity ref="activity" @callback="handleActivityCallback" mode="view"/>
    <customer ref="customer" @callback="handleCustomerCallback"/>
    <div class="footer-back">
      <el-button @click="handleClose">戻る</el-button>
    </div>
  </div>
</template>
<script>
    import {getNegotiations, updateNegotiations} from "@/api/business/negotiations";
    import {getUserProfile, listUser} from "@/api/system/user";
    import DeptUserInput from "@/components/DeptUser/multipleInput";

    import Customer from "@/components/Customer/radio";
    import activity from "./activityDialog";
    import {cloneDeep} from 'lodash';
    import {getInfo} from "@/api/business/customerInfo";

    export default {
        name: "NegotiationsDetail",
        dicts: ['negotiation_type', 'negotiation_cat1', 'negotiation_cat2', 'negotiation_cat3', 'negotiation_cat4', 'negotiation_cat5', 'negotiation_cat6', 'negotiation_cat7', 'delivery_region', 'importance', 'difficulty', 'volume_of_goods', 'added_value', 'probability', 'negotiation_status', 'activity_type', 'quotation_status', 'unit'],
        components: {
            DeptUserInput,
            activity,
            Customer
        },
        data() {
            return {
                fromRouterPath: '',
                fromRouterQuery: '',
                // フォームパラメータ
                form: {},
                user: {},
                userList: [],
                managerList: [],
                commentOpen: false,
                comment: '',
                quotationRules: {
                    quotationDay: [
                        {required: true, message: "見積日は必須です", trigger: "blur"}
                    ],
                    status: [
                        {required: true, message: "見積ステータスは必須です", trigger: "change"}
                    ],
                },
                quotationOpen: false,
                status: ''
            };
        },
        // ルート遷移前
        beforeRouteEnter(to, from, next) {
            next(vm => {
                debugger
                if (!vm.fromRouterPath) {
                    vm.fromRouterPath = from.path;
                    vm.fromRouterQuery = from.query;
                }
            });
        },
        created() {
            const negotiationNo = this.$route.params && this.$route.params.negotiationNo;
            const subNumber = this.$route.params && this.$route.params.subNumber;
            if (negotiationNo) {
                this.getInfo(negotiationNo, subNumber);
            }
        },

        methods: {

            // 情報取得
            getInfo(negotiationNo, subNumber) {
                this.$modal.loading();
                getNegotiations(negotiationNo, subNumber).then(response => {
                    this.form = response.data;
                    if (this.form.activityList && this.form.activityList.length > 0) {
                        this.status = this.form.activityList[this.form.activityList.length - 1].status;
                    }
                    listUser({pageSize: -1}).then(response => {
                        this.userList = response.rows;
                    });
                }).catch((err) => console.log(err))
                    .finally(() => this.$modal.closeLoading());
            },

            handleClose() {
                this.$router.back();
            },
            openComment() {
                this.commentOpen = true;
                this.comment = "";
            },

            submitComment() {
                this.commentOpen = false;
                let comm = {
                    date: new Date(),
                    name: this.$store.getters.nickName,
                    deptName: this.user.dept.deptName,
                    comment: this.comment
                }
                this.form.commentList.push(comm);
            },
            cancelComment() {
                this.commentOpen = false;
            },
            openQuotation() {
                this.quotationOpen = true;
            },
            cancelQuotation() {
                this.quotationOpen = false;
            },
            openActivity() {
                let activity = {
                    negotiationType: this.form.negotiationType,
                    negotiationNo: this.form.negotiationNo,
                    subNumber: this.form.subNumber,
                    revisionNumber: this.form.revisionNumber,
                    customerNo: this.form.customerNo,
                    customerName: this.form.customerName,
                    negotiationName: this.form.negotiationName,
                    businessContent: this.form.businessContent,
                }
                this.$refs.activity.open(activity);
            },
            async handleActivityCallback(callback) {
                if (callback.index !== undefined && callback.index !== null) {
                    this.$set(this.form.activityList, callback.index, cloneDeep(callback));
                } else {
                    this.form.activityList.push(cloneDeep(callback));
                }
                this.status = this.form.activityList[this.form.activityList.length - 1].status;
            },
            handleDetailActivity(row, index) {
                row.index = index;
                row.negotiationType = this.form.negotiationType
                row.negotiationNo = this.form.negotiationNo
                row.subNumber = this.form.subNumber
                row.revisionNumber = this.form.revisionNumber
                row.customerNo = this.form.customerNo
                row.customerName = this.form.customerName
                row.negotiationName = this.form.negotiationName
                row.businessContent = this.form.businessContent
                this.$refs.activity.open(cloneDeep(row));
            },
            handleDeleteActivity(index) {
                let that = this;
                that.$modal.confirm("データを削除してもよろしいですか？").then(function () {
                    that.form.activityList.splice(index, 1);
                }).catch(() => {
                });
            },
            openCustomer() {
                this.$refs.customer.open(this.form.customerNo);
            },
            handleCustomerCallback(customer) {
                this.form.customerNo = customer.customerNo;
                this.form.customerName = customer.customerName;
            },
            getCustomer() {
                this.$modal.loading();
                if (this.form.customerNo) {
                    getInfo(this.form.customerNo).then(response => {
                        this.form.customerName = response.data.customerName;
                    }).catch((err) => console.log(err))
                        .finally(() => this.$modal.closeLoading());
                }
            },
            toInstruction() {
                if (this.form.activityList.length > 0) {
                    const router = "/instruction/InstructionAddHome/home/" + this.form.negotiationNo + "/" + this.form.subNumber + "/" + this.form.negotiationName + "/1";
                    this.$router.push(router);
                } else {
                    const router = "/instruction/InstructionAddHome/home/" + this.form.negotiationNo + "/" + this.form.subNumber + "/" + this.form.negotiationName;
                    this.$router.push(router);
                }
            }
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
    padding-bottom: 6px;
  }

  .flex-col {
    flex: 1;
    min-width: 0;
  }

  .flex-col .el-form-item {
    margin-bottom: 0;
  }
</style>
