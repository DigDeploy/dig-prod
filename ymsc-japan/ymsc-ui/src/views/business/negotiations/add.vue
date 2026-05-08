<template>
  <div class="app-container-router">
    <el-form ref="form" :model="form" :rules="rules" label-width="148px">
      <el-row :gutter="10" class="mb8">
        <div style="float: left !important;">
          <el-button
            type="primary"
            size="mini"
            disabled
          >出張命令書
          </el-button>
        </div>
      </el-row>
      <!-- タイトルバー -->
      <title-bar title="宛先" is-top :collapsible="false">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="営業担当（主）" prop="mainResponsible">
              <el-select v-model="form.mainResponsible" filterable placeholder="">
                <el-option
                  v-for="user in mainUserList"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="168px" label="営業管理者（上司）" prop="managerResponsible">
              <el-select v-model="form.managerResponsible" placeholder="">
                <el-option
                  v-for="user in managerList"
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
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="通知先" prop="notificationRecipient">
              <dept-user-input
                v-model="form.notificationRecipient"
                :ref="'notificationRecipient'"
                class="w-100"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </title-bar>
      <title-bar title="案件登録" is-top>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="案件種類" prop="negotiationType">
              <el-select v-model="form.negotiationType" placeholder="">
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
            <el-form-item label="案件番号" prop="subNumber">
              <el-input v-model="form.subNumber" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="子番" prop="subNumber">
              <el-input v-model="form.subNumber" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="改定" prop="revisionNumber">
              <el-input v-model="form.revisionNumber" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="登録日" prop="registrationDate">
              <el-date-picker clearable
                              v-model="form.registrationDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="起票者" prop="creator">
              <el-select v-model="form.creator" placeholder="">
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
              <el-select v-model="form.responsiblePerson" placeholder="">
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
              <el-date-picker clearable
                              v-model="form.managementStart"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件管理終了期間" prop="managementEnd">
              <el-date-picker clearable
                              v-model="form.managementEnd"
                              type="date"
                              :picker-options="{ disabledDate: disabledEndDate }"
                              value-format="yyyy-MM-dd"
                              placeholder="YYYY-MM-DD">

              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </title-bar>
      <title-bar title="得意先情報" is-top>
        <el-row :gutter="10">
          <el-col :span="9">
            <el-form-item label="得意先番号" prop="customerNo" label-width="180px">
              <div class="input-button-group">
                <el-input v-model="form.customerNo" class="ym-input-standard" @blur="getCustomer" maxlength="6">
                  <el-button slot="append" icon="el-icon-search" @click="openCustomer"/>
                </el-input>
                <el-button type="primary" size="small" @click="openCustomerAdd">得意先登録</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="得意先名" prop="customerName" label-width="180px">
              <el-input v-model="form.customerName" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="得意先部門（窓口）" prop="customerWindowDept" label-width="180px">
              <el-input v-model="form.customerWindowDept" placeholder="" maxlength="50" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="窓口担当者" prop="windowContact" label-width="180px">
              <el-input v-model="form.windowContact" placeholder="" maxlength="50" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="得意先部門（依頼元）" prop="customerRequestDept" label-width="180px">
              <el-input v-model="form.customerRequestDept" placeholder="" maxlength="50" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="依頼元担当者" prop="requestContact" label-width="180px">
              <el-input v-model="form.requestContact" placeholder="" maxlength="50" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
      </title-bar>
      <title-bar title="案件情報" is-top>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="案件区分1" prop="negotiationCat1" label-width="108px">
              <el-select v-model="form.negotiationCat1" clearable placeholder="">
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
              <el-select v-model="form.negotiationCat2" clearable placeholder="">
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
              <el-select v-model="form.negotiationCat3" clearable placeholder="">
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
              <el-select v-model="form.negotiationCat4" clearable placeholder="">
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
              <el-select v-model="form.negotiationCat5" clearable placeholder="">
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
              <el-select v-model="form.negotiationCat6" clearable placeholder="">
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
              <el-select v-model="form.negotiationCat7" clearable placeholder="">
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
              <el-select v-model="form.deliveryRegion" clearable placeholder="">
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
              <el-input v-model="form.negotiationName" placeholder="" maxlength="100" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="業務内容" prop="businessContent" label-width="180px">
              <el-input v-model="form.businessContent" type="textarea" placeholder="" maxlength="200" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="必須要件" prop="requiredElements" label-width="180px">
              <el-input v-model="form.requiredElements" type="textarea" placeholder="" maxlength="200" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="ほか要件" prop="optionalElements" label-width="180px">
              <el-input v-model="form.optionalElements" type="textarea" placeholder="" maxlength="200" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="取引条件" prop="transactionTerms" label-width="180px">
              <el-input v-model="form.transactionTerms" type="textarea" placeholder="" maxlength="100" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="備考1" prop="remarks1" label-width="180px">
              <el-input v-model="form.remarks1" type="textarea" placeholder="" maxlength="200" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="備考2" prop="remarks2" label-width="180px">
              <el-input v-model="form.remarks2" type="textarea" placeholder="" maxlength="200" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="業務予定期間（開始）" prop="businessStart" label-width="180px">
              <el-date-picker clearable
                              v-model="form.businessStart"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="業務予定期間（終了）" prop="businessEnd" label-width="180px">
              <el-date-picker clearable
                              v-model="form.businessEnd"
                              type="date"
                              :picker-options="{ disabledDate: disabledEndDateBus }"
                              value-format="yyyy-MM-dd"
                              placeholder="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </title-bar>
      <title-bar title="活動報告" is-top>
        <el-row :gutter="10">
          <el-col :span="2">
            <el-button
              type="primary"
              style="height: 40px"
              size="mini"
              @click="openActivity()"
            >活動登録
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-form-item label="案件進捗(最新）" prop="status">
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
              <span @click="handleEditActivity(scope.row, scope.$index)" style="cursor: pointer; color: #409EFF;">{{ parseTime(scope.row.activityDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="活動時間" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                           width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.startDate }}～{{ scope.row.endDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="担当者" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                           show-overflow-tooltip width="120"
                           prop="mainResponsibleName"/>
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
          <el-table-column label="活動内容" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="proposal"
                           show-overflow-tooltip width="280"/>
          <el-table-column label="次回アクション日" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                           prop="nextDate"
                           width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.nextDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="次回活動種別" :header-align="alignTableConfig.header" :align="alignTableConfig.tag" width="160"
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
                icon="el-icon-edit"
                @click="handleEditActivity(scope.row, scope.$index)"
              >編集
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDeleteActivity(scope.$index)"
              >削除
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
            >見積・受注登録
            </el-button>
          </el-col>
        </el-row>
      </title-bar>
      <title-bar title="案件評価" is-top>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="評価登録日" prop="evaluationRegistrationDate">
              <el-date-picker clearable
                              v-model="form.evaluationRegistrationDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="評価登録者" prop="evaluationRegistrationUser">
              <div class="input-button-group">
                <el-input v-model="form.evaluationRegistrationUser" disabled/>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="flex-row">
          <div class="flex-col">
            <el-form-item label="重要度" prop="importance" label-width="98px">
              <el-select v-model="form.importance" clearable placeholder="">
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
              <el-select v-model="form.difficulty" clearable placeholder="">
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
              <el-select v-model="form.volumeOfGoods" clearable placeholder="">
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
              <el-select v-model="form.addedValue" clearable placeholder="">
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
              <el-select v-model="form.probability" clearable placeholder="">
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
          <el-table-column label="部門" :header-align="alignTableConfig.header" :align="alignTableConfig.text" width="240px"
                           show-overflow-tooltip
                           prop="deptName"/>
          <el-table-column label="氏名" :header-align="alignTableConfig.header" :align="alignTableConfig.text" width="140px"
                           show-overflow-tooltip
                           prop="name"/>
          <el-table-column label="コメント" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                           show-overflow-tooltip
                           prop="comment"/>
          <el-table-column label="操作" :header-align="alignTableConfig.header" :align="alignTableConfig.action"
                           class-name="small-padding fixed-width" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDeleteComment(scope.$index)"
              >削除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row :gutter="10" class="mb8" style="text-align: right;padding-top:10px">
          <el-col>
            <el-button
              type="primary"
              plain
              style="height: 40px;"
              size="mini"
              @click="openComment()"
            >➣ コメント登録
            </el-button>
          </el-col>
        </el-row>
      </title-bar>
    </el-form>
    <el-dialog title="コメント" :visible.sync="commentOpen" width="900px" append-to-body>
      <el-form label-width="138px">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="コメント" prop="comment">
              <el-input v-model="comment" type="textarea" maxlength="200" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitComment">確定</el-button>
        <el-button @click="cancelComment">キャンセル</el-button>
      </div>
    </el-dialog>
    <el-dialog title="見積・受注" :visible.sync="quotationOpen" width="1300px" append-to-body
               style="overflow: hidden;" @close="resetQuotation">
      <div style="max-height: calc(95vh - 220px); overflow-y: auto; padding-right: 10px;">
        <el-form ref="quotationForm" :model="tempQuotation" :rules="quotationRules" label-width="138px">
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
                <el-form-item label="案件番号" prop="">
                  <el-input v-model="form.negotiationNo" disabled>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="子番" prop="">
                  <el-input v-model="form.subNumber" disabled/>
                </el-form-item>
              </el-col>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="得意先番号" prop="">
                    <el-input v-model="form.customerNo" disabled/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="得意先名" prop="">
                    <el-input v-model="form.customerName" disabled/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="案件名" prop="">
                    <el-input v-model="form.negotiationName" disabled/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="業務内容" prop="">
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
                  <el-date-picker clearable
                                  v-model="tempQuotation.quotationDay"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="YYYY-MM-DD">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="見積ステータス" prop="status">
                  <el-select v-model="tempQuotation.status" placeholder="">
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
                  <el-input v-model="tempQuotation.quotationNo" disabled/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="連携用見積番号" prop="coopQuotationId">
                  <el-input v-model="tempQuotation.coopQuotationId" placeholder="" maxlength="20"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="概算金額" prop="estimateAmount">
                  <el-input-number v-model="tempQuotation.estimateAmount" placeholder="" min="0"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="単位" prop="unit">
                  <el-select v-model="tempQuotation.unit" placeholder="">
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
                  <el-input type="textarea" v-model="tempQuotation.remark" placeholder="" maxlength="100"/>
                </el-form-item>
              </el-col>
            </el-row>
          </title-bar>
          <title-bar title="受注情報" is-top>
            <el-row>
              <el-col :span="12">
                <el-form-item label="受注日" prop="orderDay">
                  <el-date-picker clearable
                                  v-model="tempQuotation.orderDay"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="YYYY-MM-DD">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="受注番号" prop="orderNo">
                  <el-input v-model="tempQuotation.orderNo" placeholder="受注番号が無い場合は受注番号項目に「－」を入力してください。"
                            maxlength="50"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="担当部門（正）" prop="orderDept">
                  <el-input v-model="tempQuotation.orderDept" placeholder="" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="担当者（正）" prop="orderUser">
                  <el-input v-model="tempQuotation.orderUser" placeholder="" maxlength="25"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="担当部門（副）" prop="orderDeptSub">
                  <el-input v-model="tempQuotation.orderDeptSub" placeholder="" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="担当者（副）" prop="orderUserSub">
                  <el-input v-model="tempQuotation.orderUserSub" placeholder="" maxlength="25"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="備考" prop="orderRemark">
                  <el-input type="textarea" v-model="tempQuotation.orderRemark" placeholder=""
                            maxlength="100"/>
                </el-form-item>
              </el-col>
            </el-row>
          </title-bar>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelQuotation">確定</el-button>
        <el-button @click="resetQuotation">キャンセル</el-button>
      </div>
    </el-dialog>
    <div class="footer-back">
      <el-button type="primary" @click="submitForm('0')">登録</el-button>
      <el-button type="primary" plain @click="submitForm('1')">仮登録</el-button>
    </div>
    <activity ref="activity" @callback="handleActivityCallback" :mode="mode"/>
    <customer ref="customer" @callback="handleCustomerCallback"/>
    <customerAddDialog ref="customerAddDialog" @callback="handleCustomerAddCallback"/>
  </div>
</template>
<script>
    import DeptUserInput from "@/components/DeptUser/multipleInput";
    import Customer from "@/components/Customer/radio";
    import {addNegotiations} from "@/api/business/negotiations";
    import {getUserProfile, listUser} from "@/api/system/user";
    import activity from "./activityDialog";
    import customerAddDialog from "./customerAddDialog";
    import {cloneDeep} from 'lodash';
    import {getInfo} from "@/api/business/customerInfo";
    import {allocatedUserList, selectJoshiAndDeptUser} from "@/api/system/user";

    export default {
        name: "NegotiationsAdd",
        components: {
            DeptUserInput,
            activity,
            Customer,
            customerAddDialog
        },
        dicts: ['negotiation_type', 'negotiation_cat1', 'negotiation_cat2', 'negotiation_cat3', 'negotiation_cat4', 'negotiation_cat5', 'negotiation_cat6', 'negotiation_cat7', 'delivery_region', 'importance', 'difficulty', 'volume_of_goods', 'added_value', 'probability', 'negotiation_status', 'activity_type', 'quotation_status', 'unit'],
        data() {
            return {
                fromRouterPath: '',
                fromRouterQuery: '',
                // フォームデータ
                form: {
                    customerNo: null,
                    customerName: '',
                    commentList: [],
                    activityList: [],
                    mainResponsible:  '',
                    evaluationRegistrationUser: this.$store.getters.nickName,
                    evaluationRegistrationDate: new Date(),
                    quotation: {
                        quotationDay: new Date(),
                    },
                    creator: '',
                    responsiblePerson: '',
                    registrationDate: new Date(),
                    managementStart: new Date(),
                    managementEnd: null,
                    unit: '01',
                    managerResponsible: null,
                    notificationRecipient: null,
                },
                hasUnsavedChanges: false,
                getInfoFlag: false,
                // フォーム検証ルール
                rules: {
                    mainResponsible: [
                        {required: true, message: "営業担当（主）は必須です", trigger: "blur"}
                    ],
                    managerResponsible: [
                        {required: true, message: "営業管理者（上司）は必須です", trigger: "blur"}
                    ],
                    notificationRecipient: [
                        // {required: true, message: "通知先は必須です", trigger: "blur"}
                    ],
                    registrationDate: [
                        {required: true, message: "登録日は必須です", trigger: "blur"}
                    ],
                    negotiationType: [
                        {required: true, message: "案件種類は必須です", trigger: "change"}
                    ],
                    creator: [
                        {required: true, message: "起票者は必須です", trigger: "blur"}
                    ],
                    responsiblePerson: [
                        {required: true, message: "営業担当は必須です", trigger: "blur"}
                    ],
                    managementStart: [
                        {required: true, message: "案件管理開始期間は必須です", trigger: "blur"}
                    ],
                    managementEnd: [
                        {required: true, message: "案件管理終了期間は必須です", trigger: "blur"}
                    ],
                    customerNo: [
                        {required: true, message: "得意先番号は必須です", trigger: "blur"}
                    ],
                    customerWindowDept: [
                        {max: 50, message: '得意先部門（窓口）は50文字以内で入力してください', trigger: 'blur'}
                    ],
                    windowContact: [
                        {max: 50, message: '窓口担当者は50文字以内で入力してください', trigger: 'blur'}
                    ],
                    customerRequestDept: [
                        {max: 50, message: '得意先部門（依頼元）は50文字以内で入力してください', trigger: 'blur'}
                    ],
                    requestContact: [
                        {max: 50, message: '依頼元担当者は50文字以内で入力してください', trigger: 'blur'}
                    ],
                    negotiationCat1: [
                        {required: true, message: "案件区分１は必須です", trigger: "change"}
                    ],
                    negotiationCat2: [
                        {required: true, message: "案件区分２は必須です", trigger: "change"}
                    ],
                    negotiationCat3: [
                        {required: true, message: "案件区分３は必須です", trigger: "change"}
                    ],
                    negotiationCat4: [
                        {required: true, message: "案件区分４は必須です", trigger: "change"}
                    ],
                    negotiationCat5: [
                        {required: true, message: "案件区分５は必須です", trigger: "change"}
                    ],
                    negotiationCat6: [
                        {required: true, message: "案件区分６は必須です", trigger: "change"}
                    ],
                    negotiationCat7: [
                        {required: true, message: "案件区分７は必須です", trigger: "change"}
                    ],
                    deliveryRegion: [
                        {required: true, message: "納入地域は必須です", trigger: "change"}
                    ],
                    negotiationName: [
                        {required: true, message: "案件名は必須です", trigger: "blur"},
                        {max: 100, message: '案件名は100文字以内で入力してください', trigger: 'blur'}
                    ],
                    businessContent: [
                        {required: true, message: "業務内容は必須です", trigger: "blur"},
                        {max: 200, message: '業務内容は200文字以内で入力してください', trigger: 'blur'}
                    ],
                    requiredElements: [
                        {required: true, message: "必須要件は必須です", trigger: "blur"},
                        {max: 200, message: '必須要件は200文字以内で入力してください', trigger: 'blur'}
                    ],
                    optionalElements: [
                        {max: 200, message: 'ほか要件は200文字以内で入力してください', trigger: 'blur'}
                    ],
                    transactionTerms: [
                        {required: true, message: "取引条件は必須です", trigger: "blur"},
                        {max: 100, message: '取引条件は100文字以内で入力してください', trigger: 'blur'}
                    ],
                    remarks1: [
                        {max: 200, message: '備考1は200文字以内で入力してください', trigger: 'blur'}
                    ],
                    remarks2: [
                        {max: 200, message: '備考2は200文字以内で入力してください', trigger: 'blur'}
                    ],
                    importance: [
                        {required: true, message: "重要度は必須です", trigger: "change"}
                    ],
                    difficulty: [
                        {required: true, message: "難易度は必須です", trigger: "change"}
                    ],
                    volumeOfGoods: [
                        {required: true, message: "物量は必須です", trigger: "change"}
                    ],
                    addedValue: [
                        {required: true, message: "付加価値は必須です", trigger: "change"}
                    ],
                    probability: [
                        {required: true, message: "確率は必須です", trigger: "change"}
                    ],
                },
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
                tempQuotation: {},
                status: '',
                mode: '',
                mainUserList:[],
            };
        },
        watch: {
            'form.mainResponsible': {
                immediate: true,
                handler(newUserId) {
                    this.updateManagerList(newUserId);
                }
            },
            'form.managementStart': {
                immediate: true,
                handler() {
                    this.$forceUpdate();
                    if (this.form.managementEnd) {
                        if (this.form.managementEnd < this.form.managementStart) {
                            this.form.managementEnd = null;
                        }
                    }
                }
            },
            'form.businessStart': {
                immediate: true,
                handler() {
                    this.$forceUpdate();
                    if (this.form.businessEnd) {
                        if (this.form.businessEnd < this.form.businessStart) {
                            this.form.businessEnd = null;
                        }
                    }
                }
            },
            'form.creator': {
                immediate: true,
                handler() {
                    this.updateNotificationRecipients();
                }
            },
            'form.responsiblePerson': {
                immediate: true,
                handler() {
                    this.updateNotificationRecipients();
                }
            },
            form: {
                deep: true,
                handler() {
                    if (this.getInfoFlag) {
                        this.hasUnsavedChanges = true;
                    }
                }
            }
        },
        // ルート遷移時
        beforeRouteEnter(to, from, next) {
            next(vm => {
                if (!vm.fromRouterPath) {
                    vm.fromRouterPath = from.path;
                    vm.fromRouterQuery = from.query;
                }
            });
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
            this.$modal.loading();
            await this.getUser();
            this.form.mainResponsible = this.$store.getters.userId;
            this.form.creator = this.$store.getters.userId;
            this.form.responsiblePerson = this.$store.getters.userId;
            await this.updateManagerList(this.form.mainResponsible);
            this.$modal.closeLoading();
            this.getInfoFlag = true;
        },
        methods: {

          async getUser() {
                await getUserProfile().then(response => {
                    this.user = response.data;
                });

                await listUser({pageSize: -1}).then(response => {
                  this.userList = response.rows;
                  
                });

                await selectJoshiAndDeptUser({userName: this.$store.getters.name, deptId: this.$store.getters.deptId}).then(response => {
                  this.mainUserList = response.data;
                });
            },
            async updateManagerList(userId) {
                let that = this;
                if (!userId) {
                    that.managerList = [];
                    that.form.managerResponsible = null;
                    return;
                }
                let vo = {
                    pageSize: -1,
                    userId: userId,
                }
                that.$modal.loading();
                await allocatedUserList(vo).then(response => {
                    that.managerList = response.rows;
                    if (that.managerList.length > 0) {
                        that.form.managerResponsible = that.managerList[0].userId;
                    } else {
                        that.form.managerResponsible = null;
                    }
                    if (that.$refs.form) {
                        that.$refs.form.clearValidate(['managerResponsible']);
                    }
                }).catch((err) => console.log(err))
                    .finally(() => that.$modal.closeLoading());
            },
            // 戻る／閉じる
            handleClose() {
                // 移動設定
                const obj = {path: this.fromRouterPath, query: this.fromRouterQuery};
                // 現在のタブを閉じて指定ページを開く
                this.$tab.closeOpenPage(obj);
            },

            submitForm(kariFlg) {
                this.form.kariFlg = kariFlg;

                if (kariFlg === '0') {
                    this.$refs["form"].validate(valid => {
                        if (valid) {
                            this.$modal.loading();
                            addNegotiations(this.form).then(response => {
                                this.$modal.msgSuccess("案件番号" + response.data.negotiationNo +"を取得しました");
                                this.hasUnsavedChanges = false;
                                // this.handleClose();
                                const router = "/newCase/negotiations/negotiationsEdit/index/" + response.data.negotiationNo + "/" + response.data.subNumber + "/add";
                                this.$router.push(router);
                            }).catch((err) => console.log(err))
                                .finally(() => this.$modal.closeLoading());
                        } else {
                            this.$nextTick(() => {
                                const errorEl = document.querySelector('.el-form-item.is-error');
                                if (errorEl) {
                                    errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                            });
                        }
                    });
                }
                if (kariFlg === '1') {
                    this.$modal.loading();
                    addNegotiations(this.form).then(response => {
                        this.$modal.msgSuccess("案件番号" + response.data.negotiationNo +"を取得しました");
                        this.hasUnsavedChanges = false;
                        // this.handleClose();
                    }).catch((err) => console.log(err))
                        .finally(() => this.$modal.closeLoading());
                }
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
            handleDeleteComment(index) {
                let that = this;
                that.$modal.confirm("コメントを削除してもよろしいですか？").then(function () {
                    that.form.commentList.splice(index, 1);
                }).catch(() => {
                });
            },
            openQuotation() {
                this.tempQuotation = cloneDeep(this.form.quotation);
                this.quotationOpen = true;
            },
            cancelQuotation() {
                this.$refs["quotationForm"].validate(valid => {
                    if (valid) {
                        if (this.tempQuotation.status === '02' && !this.tempQuotation.orderNo) {
                            this.$modal.msgError("ステータスが受注の場合、受注番号は必須です。");
                        } else {
                            this.form.quotation = cloneDeep(this.tempQuotation);
                            this.quotationOpen = false;
                        }
                    } else {
                        this.$nextTick(() => {
                            const errorEl = document.querySelector('.el-form-item.is-error');
                            if (errorEl) {
                                errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        });
                    }
                });
            },
            resetQuotation() {
                this.resetForm("quotationForm");
                this.tempQuotation = cloneDeep(this.form.quotation);
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
                    mainResponsible: String(this.$store.getters.userId),
                    mainResponsibleName: this.$store.getters.nickName,
                    nextAlert: ''
                }
                this.$refs.activity.open(activity);
            },
            openCustomerAdd() {
                this.$refs.customerAddDialog.open();
            },
            handleCustomerAddCallback(customerData) {
                // 得意先登录成功后，更新表单数据
                if (customerData) {
                    this.form.customerNo = customerData.customerNo;
                    this.form.customerName = customerData.customerName;
                    this.$refs.form.clearValidate(['customerNo']);
                }
            },
            async handleActivityCallback(callback) {
                if (callback.index !== undefined && callback.index !== null) {
                    this.$set(this.form.activityList, callback.index, cloneDeep(callback));
                } else {
                    this.form.activityList.push(cloneDeep(callback));
                }
                this.status = this.form.activityList[this.form.activityList.length - 1].status;

                const originDeputy = [];
                if (this.form.deputyResponsible !== undefined && this.form.deputyResponsible !== null) {
                    originDeputy.push(
                        ...(Array.isArray(this.form.deputyResponsible)
                            ? this.form.deputyResponsible
                            : String(this.form.deputyResponsible).split(',').map(id => id.trim()).filter(id => id))
                    );
                }

                const mainResponsible = Array.isArray(callback.mainResponsible)
                    ? callback.mainResponsible.map(id => String(id).trim()).filter(id => id)
                    : callback.mainResponsible ? [String(callback.mainResponsible).trim()] : [];

                const responsible = Array.isArray(callback.responsible)
                    ? callback.responsible.map(id => String(id).trim()).filter(id => id)
                    : callback.responsible ? [String(callback.responsible).trim()] : [];

                this.form.deputyResponsible = Array.from(new Set([
                    ...originDeputy,
                    ...mainResponsible,
                    ...responsible
                ])).join(',');
            },
            handleDetailActivity(row, index) {
                this.mode = 'view';
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
            handleEditActivity(row, index) {
                this.mode = 'edit';
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
            disabledEndDate(time) {
                if (!this.form.managementStart) return false;
                const startDate = new Date(this.form.managementStart);
                startDate.setHours(0, 0, 0, 0);
                return time.getTime() < startDate.getTime();
            },
            disabledEndDateBus(time) {
                if (!this.form.businessStart) return false;
                const startDate = new Date(this.form.businessStart);
                startDate.setHours(0, 0, 0, 0);
                return time.getTime() < startDate.getTime();
            },
            openCustomer() {
                this.$refs.customer.open(this.form.customerNo);
            },
            handleCustomerCallback(customer) {
                this.form.customerNo = customer.customerNo;
                this.form.customerName = customer.customerName;
                this.$refs.form.clearValidate(['customerNo']);
            },
            getCustomer() {
                if (this.form.customerNo) {
                    this.$modal.loading();
                    getInfo(this.form.customerNo).then(response => {
                        if (response.data) {
                            this.form.customerName = response.data.customerName;
                        } else {
                            this.form.customerNo = '';
                        }
                    }).catch((err) => console.log(err))
                        .finally(() => this.$modal.closeLoading());
                } else {
                    this.form.customerName = "";
                }
            },
            updateNotificationRecipients() {
                let that = this;
                const recipients = new Set();
                if (that.form.notificationRecipient) {
                    const originRecipients = Array.isArray(that.form.notificationRecipient)
                        ? that.form.notificationRecipient
                        : that.form.notificationRecipient.split(',');

                    originRecipients.forEach(id => {
                        const cleanId = String(id).trim();
                        if (cleanId) recipients.add(cleanId);
                    });
                }

                [that.form.creator, that.form.responsiblePerson].forEach(id => {
                    const cleanId = String(id || '').trim();
                    if (cleanId) recipients.add(cleanId);
                });

                that.form.notificationRecipient = Array.from(recipients).join(',');
            }
        }
    }
    ;
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
