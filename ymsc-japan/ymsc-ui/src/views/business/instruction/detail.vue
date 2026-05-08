<template>
  <div class="app-container-router"
    v-loading="isLoading"
    element-loading-text="ロード中..."
    element-loading-background="rgba(255, 255, 255, 0.8)"
    element-loading-spinner="el-icon-loading"
  >
    <title-bar title="案件情報" is-top>
      <el-form :model="searchForm" label-width="148px">
        <div class="search-bar" style="padding: 10px 20px">
          <el-row :gutter="10" type="flex" align="middle">
            <el-col :span="2" style="width: 100px; margin-bottom: 16px">
              <el-radio-group
                v-model="searchForm.negotiationType"
                style="width: 100px"
                disabled
              >
                <el-radio label="1">案件連動</el-radio>
              </el-radio-group>
            </el-col>

            <el-col :span="11">
              <el-form-item label="案件番号" label-width="80px">
                <negotiations
                  v-model="searchForm.negotiationNo"
                  disabled
                  @submitSelections="getSelections"
                  ref="negotiationsComp"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" type="flex" align="middle">
            <el-col :span="8" style="width: 100px; margin-bottom: 16px">
              <el-radio-group v-model="searchForm.negotiationType" disabled>
                <el-radio label="0">案件非連動</el-radio>
              </el-radio-group>
            </el-col>

            <el-col :span="8" style="display: block">
              <el-form-item label="出張区分" label-width="80px">
                <el-select
                  v-model="searchForm.negotiationClass"
                  placeholder=""
                  clearable
                  size="small"
                  disabled
                >
                  <el-option
                    v-for="dict in dict.type.instruction_report_class"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="display: block">
              <el-form-item
                label="案件番号"
                label-width="80px"
                prop="negotiationNo"
              >
                <el-input v-model="negotiationNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8" style="display: block">
              <el-form-item
                label="子番"
                label-width="80px"
                prop="subNumber"
              >
                <el-input v-model="subNumber" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </title-bar>

    <el-form ref="form" :model="form" :rules="rules" label-width="128px">
      <title-bar title="出張（伺い）命令書" is-top>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="出張者" prop="loginId">
                  <el-select v-model="form.loginId" style="width: 100%" disabled placeholder="">
                    <el-option
                      v-for="user in userList"
                      :key="user.userId"
                      :label="user.nickName"
                      :value="user.userId + ''"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="4">
                <el-form-item label="" prop=""></el-form-item>
              </el-col>
              <el-col :span="8" style="margin-left: -140px">
                <el-form-item label="出張命令番号" prop="instructionNo">
                  <el-input
                    v-model="form.instructionNo"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item label="出張命令番号" prop="instructionNo">
                  <el-input
                    v-model="form.instructionNo"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="所属" prop="belonging">
                  <el-input
                    v-model="form.belonging"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="出張先" prop="businessTrip">
                  <el-input
                    v-model="form.businessTrip"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出張先2" prop="businessTrip2">
                  <el-input
                    v-model="form.businessTrip2"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出張先3" prop="businessTrip3">
                  <el-input
                    v-model="form.businessTrip3"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="所在地" prop="location">
                  <el-input
                    v-model="form.location"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所在地2" prop="location2">
                  <el-input
                    v-model="form.location2"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所在地3" prop="location3">
                  <el-input
                    v-model="form.location3"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="要件" prop="requirements">
                  <el-input
                    v-model="form.requirements"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="要件2" prop="requirements2">
                  <el-input
                    v-model="form.requirements2"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="要件3" prop="requirements3">
                  <el-input
                    v-model="form.requirements3"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 期間（開始） -->
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="期間（開始）" prop="periodStart">
                  <div style="display: flex; gap: 10px; align-items: center;">
                    <el-date-picker
                      clearable
                      v-model="form.periodStart"
                      type="date"
                      value-format="yyyy-MM-dd"
                      style="width: 150px;"
                      disabled
                    />
                    <el-time-select
                      clearable
                      style="width: 120px"
                      v-model="form.periodStartTime"
                      value-format="HH:mm"
                      placeholder=""
                      :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30',
                    }"
                      disabled
                    >
                    </el-time-select>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="旅費概算払" prop="expenses">
                  <el-input-number
                    v-model="form.expenses"
                    placeholder=""
                    :min="0"
                    :max="99999999"
                    :precision="0"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 期間（終了） -->
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="期間（終了）" prop="periodEnd">
                  <div style="display: flex; gap: 10px; align-items: center;">
                    <el-date-picker
                      clearable
                      v-model="form.periodEnd"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder=""
                      :picker-options="{ disabledDate: disabledEndDate }"
                      style="width: 150px;"
                      disabled
                    />
                    <el-time-select
                      clearable
                      style="width: 120px"
                      v-model="form.periodEndTime"
                      value-format="HH:mm"
                      placeholder=""
                      :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:59',
                    }"
                      disabled
                    >
                    </el-time-select>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="承認者" prop="approveId">
                  <el-input
                    v-model="form.approveId"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 指示事項 -->
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="指示事項" prop="indication">
                  <el-input
                    type="textarea"
                    v-model="form.indication"
                    placeholder=""
                    :rows="2"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 指示者 & 承認欄 -->
            <el-row :gutter="10" style="margin-right: 1px;">
              <el-col :span="8">
                <el-form-item label="指示者" prop="indicateId">
                  <el-input
                    v-model="form.indicateId"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="float: right">
                <el-row>
                  <el-col :span="5" style="padding: 0 !important; float: right">
                    <div style="border: 1px solid #dcdfe6; border-left: none">
                      <div
                        style="
                          text-align: center;
                          padding: 5px;
                          border-bottom: 1px solid #dcdfe6;
                          font-weight: bold;
                        "
                      >
                        所属課長
                      </div>
                      <div
                        style="
                          flex-direction: column;
                          display: flex;
                          justify-content: center;
                          min-height: 76px;
                          padding: 8px;
                          font-size: 13px;
                          line-height: 1.5;
                        "
                      >
                        <div style="text-align: center">
                          {{
                          form.managerApproveDate === true
                          ? ""
                          : form.managerApproveDate || ""
                          }}
                        </div>
                        <div style="text-align: center">
                          {{ form.approveManager || "" }}
                        </div>
                      </div>
                      <el-button
                        type="primary"
                        @click="handleApprove('approveManager')"
                        style="
                          text-align: center;
                          padding: 4px;
                          font-size: 12px;
                          width: 100%;
                        "
                        disabled
                      >課長承認
                      </el-button
                      >
                    </div>
                  </el-col>
                  <el-col :span="5" style="padding: 0 !important; float: right">
                    <div style="border: 1px solid #dcdfe6; border-left: none">
                      <div
                        style="
                          text-align: center;
                          padding: 5px;
                          border-bottom: 1px solid #dcdfe6;
                          font-weight: bold;
                        "
                      >
                        所属部長
                      </div>
                      <div
                        style="
                          flex-direction: column;
                          display: flex;
                          justify-content: center;
                          min-height: 76px;
                          padding: 8px;
                          font-size: 13px;
                          line-height: 1.5;
                        "
                      >
                        <div style="text-align: center">
                          {{
                          form.directorApproveDate === true
                          ? ""
                          : form.directorApproveDate || ""
                          }}
                        </div>
                        <div style="text-align: center">
                          {{ form.approveDirector || "" }}
                        </div>
                      </div>
                      <el-button
                        type="primary"
                        @click="handleApprove('approveDirector')"
                        style="
                          text-align: center;
                          padding: 4px;
                          font-size: 12px;
                          width: 100%;
                        "
                        disabled
                      >部長承認
                      </el-button
                      >
                    </div>
                  </el-col>
                  <el-col :span="5" style="padding: 0 !important; float: right">
                    <div style="border: 1px solid #dcdfe6; border-left: none">
                      <div
                        style="
                          text-align: center;
                          padding: 5px;
                          border-bottom: 1px solid #dcdfe6;
                          font-weight: bold;
                        "
                      >
                        社長
                      </div>
                      <div
                        style="
                          flex-direction: column;
                          display: flex;
                          justify-content: center;
                          min-height: 76px;
                          padding: 8px;
                          font-size: 13px;
                          line-height: 1.5;
                        "
                      >
                        <div style="text-align: center">
                          {{
                          form.presidentApproveDate === true
                          ? ""
                          : form.presidentApproveDate || ""
                          }}
                        </div>
                        <div style="text-align: center">
                          {{ form.approvePresident || "" }}
                        </div>
                      </div>
                      <el-button
                        type="primary"
                        @click="handleApprove('approvePresident')"
                        style="
                          text-align: center;
                          padding: 4px;
                          font-size: 12px;
                          width: 100%;
                        "
                        disabled
                      >社長承認
                      </el-button
                      >
                    </div>
                  </el-col>
                  <el-col :span="4" style="padding: 0 !important; float: right">
                    <div
                      style="
                        border: 1px solid #c6e2ff;
                        min-height: 135px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                      "
                    >
                      承認者
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </title-bar>

      <!-- 出張報告書 -->
      <title-bar title="出張報告書" is-top>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-row>
              <el-col :span="12">
                <el-form-item label="出張者氏名" prop="reportLoginId">
                  <el-select
                    v-model="form.reportLoginId"
                    disabled
                    placeholder=""
                  >
                    <el-option
                      v-for="user in userList"
                      :key="user.userId"
                      :label="user.nickName"
                      :value="user.userId + ''"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="float: right">
                <el-row>
                  <el-col :span="5" style="padding: 0 !important; float: right">
                    <div style="border: 1px solid #dcdfe6; border-left: none">
                      <div
                        style="
                          text-align: center;
                          padding: 5px;
                          border-bottom: 1px solid #dcdfe6;
                          font-weight: bold;
                        "
                      >
                        所属課長
                      </div>
                      <div
                        style="
                          flex-direction: column;
                          display: flex;
                          justify-content: center;
                          min-height: 76px;
                          padding: 8px;
                          font-size: 13px;
                          line-height: 1.5;
                        "
                      >
                        <div style="text-align: center">
                          {{
                          form.reportManagerApproveDate === true
                          ? ""
                          : form.reportManagerApproveDate || ""
                          }}
                        </div>
                        <div style="text-align: center">
                          {{ form.reportApproveManager || "" }}
                        </div>
                      </div>
                      <el-button
                        type="primary"
                        @click="handleApprove('reportApproveManager')"
                        style="
                          text-align: center;
                          padding: 4px;
                          font-size: 12px;
                          width: 100%;
                        "
                        disabled
                      >課長承認
                      </el-button
                      >
                    </div>
                  </el-col>
                  <el-col :span="5" style="padding: 0 !important; float: right">
                    <div style="border: 1px solid #dcdfe6; border-left: none">
                      <div
                        style="
                          text-align: center;
                          padding: 5px;
                          border-bottom: 1px solid #dcdfe6;
                          font-weight: bold;
                        "
                        disabled
                      >
                        所属部長
                      </div>
                      <div
                        style="
                          flex-direction: column;
                          display: flex;
                          justify-content: center;
                          min-height: 76px;
                          padding: 8px;
                          font-size: 13px;
                          line-height: 1.5;
                        "
                      >
                        <div style="text-align: center">
                          {{
                          form.reportDirectorApproveDate === true
                          ? ""
                          : form.reportDirectorApproveDate || ""
                          }}
                        </div>
                        <div style="text-align: center">
                          {{ form.reportApproveDirector || "" }}
                        </div>
                      </div>
                      <el-button
                        type="primary"
                        @click="handleApprove('reportApproveDirector')"
                        style="
                          text-align: center;
                          padding: 4px;
                          font-size: 12px;
                          width: 100%;
                        "
                        disabled
                      >部長承認
                      </el-button
                      >
                    </div>
                  </el-col>
                  <el-col :span="5" style="padding: 0 !important; float: right">
                    <div style="border: 1px solid #dcdfe6; border-left: none">
                      <div
                        style="
                          text-align: center;
                          padding: 5px;
                          border-bottom: 1px solid #dcdfe6;
                          font-weight: bold;
                        "
                      >
                        社長
                      </div>
                      <div
                        style="
                          flex-direction: column;
                          display: flex;
                          justify-content: center;
                          min-height: 76px;
                          padding: 8px;
                          font-size: 13px;
                          line-height: 1.5;
                        "
                      >
                        <div style="text-align: center">
                          {{
                          form.reportPresidentApproveDate === true
                          ? ""
                          : form.reportPresidentApproveDate || ""
                          }}
                        </div>
                        <div style="text-align: center">
                          {{ form.reportApprovePresident || "" }}
                        </div>
                      </div>
                      <el-button
                        type="primary"
                        @click="handleApprove('reportApprovePresident')"
                        style="
                          text-align: center;
                          padding: 4px;
                          font-size: 12px;
                          width: 100%;
                        "
                        disabled
                      >社長承認
                      </el-button
                      >
                    </div>
                  </el-col>
                  <el-col :span="4" style="padding: 0 !important; float: right">
                    <div
                      style="
                        border: 1px solid #c6e2ff;
                        min-height: 135px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                      "
                    >
                      承認者
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div
          style="
            display: flex;
            gap: 10px;
            align-items: center;
            padding-bottom: 10px;
          "
        >
          <!-- <el-button
            type="primary"
            @click="openReportAdd"
            disabled
            >出張報告書追加</el-button
          > -->
          <el-button type="primary" @click="handlePrint('reportPrint')"
            :disabled="reportPrintDisabled"
          >出張報告書印刷
          </el-button
          >
          <el-button
            type="primary"
            @click="openReportAdd"
            disabled
            style="height: 38px"
          >出張報告書追加
          </el-button
          >
        </div>

        <el-table
          v-loading="loading"
          :data="instructionReportList"
          :ref="refNodes.table"
          row-key="negotiationNo"
          @selection-change="handleSelectionChange"
          @row-click="appendSelection"
          :height="tableHeight"
          stripe
          border
        >
          <!-- チェックボックス -->
          <!-- <el-table-column
            type="selection"
            width="55"
            header-align="center"
            align="center"
            :reserve-selection="true"
          /> -->
          <el-table-column
            label="No."
            type="index"
            width="55"
            :header-align="alignTableConfig.header"
            :align="alignTableConfig.lineNo"
          >
            <template slot-scope="scope">
              <span>{{
                (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="経過・結果の報告事項及び意見"
            header-align="center"
          >
            <el-table-column
              label="年月日"
              prop="dateStr"
              width="190px"
            ></el-table-column>

            <el-table-column label="案件番号" width="120px">
              <template slot-scope="scope">
                <span v-html="formatCaseNo(scope.row.negotiationNo, 0)"></span>
              </template>
            </el-table-column>
            <el-table-column label="子番" width="60px">
              <template slot-scope="scope">
                <span v-html="formatCaseNo(scope.row.negotiationNo, 1)"></span>
              </template>
            </el-table-column>
            <el-table-column label="活動番号" width="80px">
              <template slot-scope="scope">
                <span v-html="formatCaseNo(scope.row.negotiationNo, 2)"></span>
              </template>
            </el-table-column>
            <el-table-column
              label="目的"
              prop="location"
              width="220px"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="目的の補足欄"
              width="220px"
              prop="locationSupplementary"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="面会者名等"
              prop="visitorName"
              width="220px"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="結果"
              prop="visitorResult"
              show-overflow-tooltip
            ></el-table-column>
            <!-- <el-table-column
              label="出張精算有無"
              prop="visitorResult"
              show-overflow-tooltip
            ></el-table-column> -->
            <el-table-column
              prop="biko"
              label="操作"
              width="180px"
              align="left"
            >
              <template slot-scope="scope">
                <div style="display: flex; gap: 4px">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="openReport(scope.row, scope.$index)"
                  >報告書画面
                  </el-button
                  >
                  <!-- <el-button
                    size="mini"
                    type="primary"
                    @click="handleDelete(scope.row)"
                    >出張精算書登録</el-button
                  > -->
                  <el-button
                    size="mini"
                    type="primary"
                    @click="handleDelete(scope.row)"
                    disabled
                  >削除
                  </el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </title-bar>
    </el-form>

    <title-bar title="旅費精算請求書" is-top>
      <el-form
        :model="searchForm"
        label-width="148px"
        :rules="searchRules"
        ref="searchFormRef"
      >
        <div class="search-bar" style="padding: 10px 20px">
          <el-row :gutter="10" type="flex" align="middle">
            <el-col :span="24" style="display: flex">
              <el-button
                type="success"
                style="color: #000 !important; cursor: default;"
                disabled
                v-if="isBusTravelFee==='1'"
              >出張精算済
              </el-button
              >
              <el-button
                type="info" plain
                style="color: #000 !important; cursor: default;"
                disabled
                v-if="isBusTravelFee==='0'"
              >出張精算未
              </el-button
              >
              <el-button
                type="primary"
                @click="openTravelFee()"
                style="height: 38px;margin-left: 20px;"
                :disabled="isBusTravelFee === '0'"
              >出張精算書参照
              </el-button
              >
              <el-button type="primary" @click="handlePrint('travelFeePrint')"
                :disabled="isBusTravelFee === '0'"
                >出張精算書印刷
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </title-bar>


    <div class="footer-back">
      <!-- <el-button type="primary" @click="submitForm">確定</el-button> -->
      <el-button type="primary" @click="handlePrint('instructionPrint')">印刷</el-button>
      <el-button @click="handleClose">戻る</el-button>
    </div>

    <reportDialog ref="reportDialog" @callback="handleReportCallback"/>
    <travelFeeDialog ref="travelFeeDialog"/>
  </div>
</template>

<script>
    import {
        getInstruction,
        updateInstruction,
        instructionPrint,
        reportPrint,
        travelFeePrint,
    } from "@/api/business/instruction";
    import {getUserProfile, listUser} from "@/api/system/user";
    import Negotiations from "@/components/Negotiations/multipleInput";
    import reportDialog from "./reportDialog";
    import travelFeeDialog from "./travelFeeDialog";


    export default {
        name: "InstructionAdd",
        components: {
            reportDialog,
            Negotiations,
            travelFeeDialog,
        },
        dicts: ["instruction_report_class"],
        data() {
            const timeRangeValidator = (rule, value, callback) => {
                if (this.form.periodEnd && this.form.periodEndTime) {
                    const startDateTimeStr = `${this.form.periodStart} ${this.form.periodStartTime}`;
                    const endDateTimeStr = `${this.form.periodEnd} ${this.form.periodEndTime}`;
                    const startTime = new Date(startDateTimeStr);
                    const endTime = new Date(endDateTimeStr);
                    if (
                        !isNaN(startTime.getTime()) &&
                        !isNaN(endTime.getTime()) &&
                        startTime > endTime
                    ) {
                        if (rule.field === "periodStartTime" || rule.field === "periodStartTime") {
                            callback(new Error(" "));
                        } else {
                            callback(
                                new Error("開始時間は終了時間より早い時間を選択してください")
                            );
                        }

                        return;
                    }
                }
                callback();
            };
            const instructorRequired = (rule, value, callback) => {
                if (this.form.indication && !value) {
                    callback(new Error("指示者は必須です"));
                } else {
                    callback();
                }
            };
            return {
                queryParams: {
                  pageNum: 1,
                  pageSize: 10,
                },
                reportPrintDisabled: true,
                isLoading: false,
                isBusTravelFee: "0",
                subNumber: "",
                negotiationNo: "",
                // refノード
                refNodes: {
                    form: "queryForm",
                    table: "dataTable",
                    tree: "tree",
                },

                subNumList: [],

                searchForm: {
                    negotiationType: "1",
                    negotiationNo: null,
                    negotiationClass: null,
                },

                fromRouterPath: "",
                fromRouterQuery: "",
                form: {
                    approvePresident: "",
                    presidentApproveDate: "",
                    approveDirector: "",
                    directorApproveDate: "",
                    approveManager: "",
                    managerApproveDate: "",

                    reportApprovePresident: "",
                    reportPresidentApproveDate: "",
                    reportApproveDirector: "",
                    reportDirectorApproveDate: "",
                    reportApproveManager: "",
                    reportManagerApproveDate: "",
                },
                instructionReportList: [],
                negotiationNoNameList: [],
                negotiationNoNameAllList: [],
                rules: {
                    loginId: [
                        {
                            required: true,
                            message: "出張者，社員マスタログインIDは必須です",
                            trigger: "blur",
                        },
                    ],
                    belonging: [
                        {
                            required: true,
                            message: "所属は必須です",
                            trigger: "blur",
                        },
                        {
                            max: 50,
                            message: "は50文字以内で入力してください",
                            trigger: "submit",
                        },
                    ],
                    businessTrip: [
                        {required: true, message: "出張先は必須です", trigger: "blur"},
                        {
                            max: 100,
                            message: "は100文字以内で入力してください",
                            trigger: "submit",
                        },
                    ],
                    location: [
                        {required: true, message: "所在地は必須です", trigger: "blur"},
                        {
                            max: 100,
                            message: "は100文字以内で入力してください",
                            trigger: "submit",
                        },
                    ],
                    requirements: [
                        {required: true, message: "要件は必須です", trigger: "blur"},
                        {
                            max: 100,
                            message: "は100文字以内で入力してください",
                            trigger: "submit",
                        },
                    ],
                    periodStart: [
                        {required: true, message: "開始期間は必須です", trigger: "blur"},
                        {validator: timeRangeValidator, trigger: "submit"},
                    ],
                    periodStartTime: [
                        {required: true, message: "開始期間は必須です", trigger: "blur"},
                        {validator: timeRangeValidator, trigger: "submit"},
                    ],
                    periodEnd: [
                        {required: true, message: "終了期間は必須です", trigger: "blur"},
                        {validator: timeRangeValidator, trigger: "submit"},
                    ],
                    periodEndTime: [
                        {required: true, message: "終了期間は必須です", trigger: "blur"},
                        {validator: timeRangeValidator, trigger: "submit"},
                    ],
                    reportLoginId: [
                        {required: true, message: "出張者は必須です", trigger: "blur"},
                    ],
                    approveId: [
                        {
                            max: 20,
                            message: "は20文字以内で入力してください",
                            trigger: "submit",
                        },
                    ],
                    indication: [
                        {
                            max: 100,
                            message: "は100文字以内で入力してください",
                            trigger: "submit",
                        },
                    ],
                    indicateId: [
                        {
                            max: 20,
                            message: "は20文字以内で入力してください",
                            trigger: "submit",
                        },
                        {validator: instructorRequired, trigger: "submit"},
                    ],
                },
                user: {},
                userList: [],
                loading: false,
            };
        },
        /** 計算プロパティ */
        computed: {
            // テーブル高さ
            tableHeight() {
                // 高さ計算
                let height = document.body.clientHeight - 502;
                return height < 300 ? 300 : height;
            },

            // tagsの表示判定
            showPreview() {
                return this.submitSelections && this.submitSelections.length;
            },

            // プレビューtagデータ
            previewTags() {
                // プレビュー設定規模を超える場合の表示制御
                if (this.submitSelections.length > this.previewSize) {
                    return this.submitSelections.filter(
                        (obj, index) => index < this.previewSize
                    );
                } else {
                    return this.submitSelections;
                }
            },

            // プレビュー設定規模の超過判定
            whetherExceed() {
                return (
                    this.submitSelections && this.submitSelections.length > this.previewSize
                );
            },

            // プレビュー設定規模超過分 残りtag数
            exceedPreviewSize() {
                return this.submitSelections.length - this.previewSize;
            },

        },
        watch: {
            "form.periodStart": {
                immediate: true,
                handler() {
                    this.$forceUpdate();
                    if (this.form.periodEnd) {
                        if (this.form.periodEnd < this.form.periodStart) {
                            this.form.periodEnd = null;
                        }
                    }
                },
            },
            "searchForm.negotiationType"(newVal) {
                if (newVal === "0") {
                  const childComp = this.$refs.negotiationsComp;
                  if (childComp) {
                    childComp.clearTag();
                  }
                } else {
                  this.searchForm.negotiationClass = null;
                }
            },
        },
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                if (!vm.fromRouterPath) {
                    vm.fromRouterPath = from.path;
                    vm.fromRouterQuery = from.query;
                }
            });
        },
        created() {
            const instructionNo =
                this.$route.params && this.$route.params.instructionNo;
            if (instructionNo) {
                this.getInfo(instructionNo);
            }

            this.$modal.loading();
            this.getUser();
            this.$modal.closeLoading();
        },
        methods: {
          async handlePrint(type) {
            try {
              let blob;
              this.isLoading = true;
              this.errorMessage = "";

              if (type === "instructionPrint") {
                blob = await instructionPrint(this.form.instructionNo);
              } else if (type === "reportPrint") {
                blob = await reportPrint(this.form.instructionNo);
              } else if (type === "travelFeePrint") {
                blob = await travelFeePrint(this.form.instructionNo);
              }

              if (!blob || blob.size === 0) {
                throw new Error("サーバーから返却された PDF ファイルが空です。");
              }

              const url = URL.createObjectURL(blob);

              // 各種印刷ファイル名に年月日時分秒を付与
              let fileName = "";
              const now = new Date();
              const year = now.getFullYear();
              const month = String(now.getMonth() + 1).padStart(2, "0");
              const day = String(now.getDate()).padStart(2, "0");
              const hours = String(now.getHours()).padStart(2, "0");
              const minutes = String(now.getMinutes()).padStart(2, "0");
              const seconds = String(now.getSeconds()).padStart(2, "0");

              if (type === "instructionPrint") {
                fileName = `出張命令書${year}${month}${day}${hours}${minutes}${seconds}.pdf`;
              } else if (type === "reportPrint") {
                fileName = `出張報告書${year}${month}${day}${hours}${minutes}${seconds}.pdf`;
              } else if (type === "travelFeePrint") {
                fileName = `出張精算書${year}${month}${day}${hours}${minutes}${seconds}.pdf`;
              }

              // ダウンロードリンクを作成してクリック
              const link = document.createElement("a");
              link.href = url;
              if (fileName) {
                link.download = fileName;
              }
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              this.$modal.msgSuccess(
                "PDFファイルを作成しました。"
              );
              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 5000);
            } catch (error) {
              console.error("印刷に失敗しました:", error);
              this.errorMessage = `エラー: ${error.message}`;
              this.$modal.msgError(`印刷に失敗しました: ${error.message}`);
            } finally {
              this.isLoading = false;
            }
          },
            openTravelFee() {
                let travelFee = {
                    instructionNo: this.form.instructionNo,
                    operation: "detail",
                };
                this.$refs.travelFeeDialog.open(travelFee);
            },
            // 情報取得
            getInfo(instructionNo) {
                this.$modal.loading();
                getInstruction(instructionNo)
                    .then((response) => {
                        this.form = response.data;
                        if (response.data.negotiationType === '0') {
                            const firstPart = this.form.negotiationNo.split("|");
                            this.negotiationNo = firstPart[0];
                            this.subNumber = firstPart[1];
                            this.form.negotiationNo = "";
                        }
                        if(response.data.instructionReportList.length > 0){
                          this.reportPrintDisabled = false;
                        }

                        this.isBusTravelFee = this.form.isBusTravelFee;
                        this.searchForm.negotiationType = response.data.negotiationType;
                        this.searchForm.negotiationNo = response.data.negotiationNo;
                        this.searchForm.negotiationClass = response.data.negotiationClass;
                        this.instructionReportList = response.data.instructionReportList;
                        this.searchForm.negotiationNoTextarea =
                            this.searchForm.negotiationNo.replace(/,/g, "\n");
                        this.negotiationNoNameList = response.data.negotiationNoNameList;
                        this.negotiationNoNameAllList =
                            response.data.negotiationNoNameAllList;
                    })
                    .catch((err) => console.log(err))
                    .finally(() => this.$modal.closeLoading());
            },
            disabledEndDate(time) {
                if (!this.form.periodStart) return false;
                const startDate = new Date(this.form.periodStart);
                startDate.setHours(0, 0, 0, 0);
                return time.getTime() < startDate.getTime();
            },
            appendSelection(row, column, event) {
                // データ回显
                this.$nextTick(() => {
                    // 選択状態を切り替え
                    this.$refs[this.refNodes.table].toggleRowSelection(row);
                });
            },
            // テーブル多肢選択のレンダリング
            renderSelections() {
                // DOM更新を非同期で実行
                this.$nextTick(() => {
                    // 未レンダリングの場合
                    if (!this.$refs[this.refNodes.table]) {
                        return;
                    }

                    // テーブル多肢選択をクリア
                    this.clearSelection();

                    // 送信済み以外の選択を除外
                    this.submitSelections.forEach((row) => {
                        this.$refs[this.refNodes.table].toggleRowSelection(row);
                    });
                });
            },
            // テーブル選択データをクリア
            clearSelection() {
                this.$refs[this.refNodes.table].clearSelection();
            },
            handleSelectionChange(selection) {
                this.ids = selection.map((item) => item.negotiationNo);
                this.multipleSelections = selection;
                this.single = selection.length !== 1;
                this.multiple = !selection.length;
            },
            handleReportCallback(callback) {
                if (callback.index !== undefined && callback.index !== null) {
                    const oldItem = this.instructionReportList[callback.index] || {};
                    const newItem = {
                        ...oldItem,
                        periodStart: callback.periodStart,
                        periodEnd: callback.periodEnd,
                        location: callback.location,
                        locationSupplementary: callback.locationSupplementary,
                        visitorName: callback.visitorName,
                        visitorResult: callback.visitorResult,
                        topic: callback.topic,
                        topicSupplementary: callback.topicSupplementary,
                        dateStr: callback.dateStr,
                        negotiationNoNameList: this.negotiationNoNameList,
                        negotiationNo: callback.negotiationNo,
                        negotiationNoName: callback.negotiationNoName,
                        negotiationNoStr: callback.negotiationNo,
                    };
                    this.$set(this.instructionReportList, callback.index, newItem);
                } else {
                    const newItem = {
                        periodStart: callback.periodStart,
                        periodEnd: callback.periodEnd,
                        location: callback.location,
                        locationSupplementary: callback.locationSupplementary,
                        visitorName: callback.visitorName,
                        visitorResult: callback.visitorResult,
                        topic: callback.topic,
                        topicSupplementary: callback.topicSupplementary,
                        dateStr: callback.dateStr,
                        negotiationNoNameList: this.negotiationNoNameList,
                        negotiationNo: callback.negotiationNo,
                        negotiationNoName: callback.negotiationNoName,
                        negotiationNoStr: callback.negotiationNo,
                    };
                    this.instructionReportList.push(newItem);
                }

                const deleteIndex = this.negotiationNoNameList.findIndex((item) => {
                    return String(item?.value || "") === String(callback.negotiationNo);
                });
                if (deleteIndex > -1) {
                    this.negotiationNoNameList.splice(deleteIndex, 1);
                }
            },
            formatCaseNo(caseNo, index) {
                if (!caseNo || typeof caseNo !== "string") {
                    return "";
                }
                const segments = caseNo.split("|");
                return segments[index];
            },
            getSelections(selections) {
                //フィールドでソート
                if (!Array.isArray(selections)) return [];
                const sortedArr = [...selections];
                sortedArr.sort((a, b) => {
                    const noA = (a?.negotiationNo || "").replace(/\|/g, "");
                    const noB = (b?.negotiationNo || "").replace(/\|/g, "");
                    return noA.localeCompare(noB, "zh-CN", {numeric: true});
                });
                selections = sortedArr;

                this.instructionReportList = [];
                this.negotiationNoNameList = [];
                selections.forEach((item) => {

                    this.negotiationNoNameList.push({
                        label: item.negotiationNoName,
                        value: item.negotiationNo,
                    });
                });
            },
            openReportAdd() {
                let reportDialog = {
                    negotiationNoNameList: this.negotiationNoNameList,
                    rowIndex: null,
                    negotiationNo: "",
                    periodStart: "",
                    periodEnd: "",
                    location: "",
                    locationSupplementary: "",
                    visitorName: "",
                    visitorResult: "",
                    topic: "",
                    topicSupplementary: "",
                    operation: "add",
                    instructionNo: this.form.instructionNo,
                    reportNo: "",
                };

                this.$refs.reportDialog.open(reportDialog);
            },
            /** 編集ボタン操作 */
            openReport(row, index) {
                let reportDialog = {
                    rowIndex: index,
                    negotiationNo: row.negotiationNo,
                    periodStart: row.periodStart,
                    periodEnd: row.periodEnd,
                    location: row.location,
                    locationSupplementary: row.locationSupplementary,
                    visitorName: row.visitorName,
                    visitorResult: row.visitorResult,
                    topic: row.topic,
                    topicSupplementary: row.topicSupplementary,
                    operation: "detail",
                    negotiationNoNameAllList: this.negotiationNoNameAllList,
                    instructionNo: this.form.instructionNo,
                    reportNo: row.reportNo,
                    reportNumber: row.reportNumber,
                };
                this.$refs.reportDialog.open(reportDialog);
            },
            getUser() {
                getUserProfile().then((response) => {
                    this.user = response.data;
                });
                listUser({pageSize: -1}).then((response) => {
                    this.userList = response.rows;
                });
            },

            // 提交表单
            submitForm() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        this.$modal.loading();

                        this.form.instructionReportList = this.instructionReportList;

                        this.form.presidentApproveDate =
                            this.form.presidentApproveDate === true
                                ? undefined
                                : this.form.presidentApproveDate.replaceAll("/", "-");
                        this.form.directorApproveDate =
                            this.form.directorApproveDate === true
                                ? undefined
                                : this.form.directorApproveDate.replaceAll("/", "-");
                        this.form.managerApproveDate =
                            this.form.managerApproveDate === true
                                ? undefined
                                : this.form.managerApproveDate.replaceAll("/", "-");
                        this.form.reportPresidentApproveDate =
                            this.form.reportPresidentApproveDate === true
                                ? undefined
                                : this.form.reportPresidentApproveDate.replaceAll("/", "-");
                        this.form.reportDirectorApproveDate =
                            this.form.reportDirectorApproveDate === true
                                ? undefined
                                : this.form.reportDirectorApproveDate.replaceAll("/", "-");
                        this.form.reportManagerApproveDate =
                            this.form.reportManagerApproveDate === true
                                ? undefined
                                : this.form.reportManagerApproveDate.replaceAll("/", "-");

                        updateInstruction(this.form)
                            .then(() => {
                                this.$modal.msgSuccess("登録しました。");
                            })
                            .catch((err) => {
                                console.error(err);
                            })
                            .finally(() => {
                                this.$modal.closeLoading();
                            });
                    }
                });
            },

            handleClose() {
                this.$router.back();
            },

            formatToYmd() {
                const date = new Date();
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                const day = date.getDate().toString().padStart(2, "0");
                return `${year}/${month}/${day}`;
            },
            handleApprove(value) {
                const nickName = this.$store.state.user.nickName;
                const date = this.formatToYmd();

                if (value === "approvePresident") {
                    this.form.approvePresident = nickName;
                    this.form.presidentApproveDate = date;
                } else if (value === "approveDirector") {
                    this.form.approveDirector = nickName;
                    this.form.directorApproveDate = date;
                } else if (value === "approveManager") {
                    this.form.approveManager = nickName;
                    this.form.managerApproveDate = date;
                } else if (value === "reportApprovePresident") {
                    this.form.reportApprovePresident = nickName;
                    this.form.reportPresidentApproveDate = date;
                } else if (value === "reportApproveDirector") {
                    this.form.reportApproveDirector = nickName;
                    this.form.reportDirectorApproveDate = date;
                } else if (value === "reportApproveManager") {
                    this.form.reportApproveManager = nickName;
                    this.form.reportManagerApproveDate = date;
                }
                this.$forceUpdate();
            },
            handleDelete(row) {
              let that = this;
                that.$modal.confirm("データを削除してもよろしいですか？").then(function () {
                    const index = that.instructionReportList.findIndex(
                            (item) => item.negotiationNo === row.negotiationNo
                        );
                        that.instructionReportList.splice(index, 1);

                        that.negotiationNoNameList.push({
                            label: row.negotiationNoName,
                            value: row.negotiationNo,
                        });
                }).catch(() => {
                });
            },
        },
    };
</script>
