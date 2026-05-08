<template>
  <div
    class="app-container-router"
    v-loading="isLoading"
    element-loading-text="ロード中..."
    element-loading-background="rgba(255, 255, 255, 0.8)"
    element-loading-spinner="el-icon-loading"
  >
    <title-bar title="案件情報" is-top>
      <el-form
        :model="searchForm"
        label-width="148px"
        :rules="searchRules"
        ref="searchFormRef"
      >
        <div class="search-bar" style="padding: 10px 20px">
          <el-row :gutter="10" type="flex" align="middle">
            <el-col :span="2" style="width: 100px; margin-bottom: 16px">
              <el-radio-group
                v-model="searchForm.negotiationType"
                style="width: 100px"
              >
                <el-radio label="1">案件連動</el-radio>
              </el-radio-group>
            </el-col>

            <el-col :span="11">
              <el-form-item
                label="案件番号"
                label-width="80px"
                prop="negotiationNo"
              >
                <negotiations
                  v-model="searchForm.negotiationNo"
                  :disabled="searchForm.negotiationType !== '1'"
                  @submitSelections="getSelections"
                  ref="negotiationsComp"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" type="flex" align="middle">
            <el-col :span="2" style="width: 100px; margin-bottom: 16px">
              <el-radio-group v-model="searchForm.negotiationType">
                <el-radio label="0">案件非連動</el-radio>
              </el-radio-group>
            </el-col>

            <el-col :span="7" style="display: block">
              <el-form-item
                label="出張区分"
                label-width="80px"
                prop="negotiationClass"
              >
                <el-select
                  v-model="searchForm.negotiationClass"
                  placeholder=""
                  clearable
                  size="small"
                  :disabled="searchForm.negotiationType !== '0'"
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
                <el-input v-model="form.negotiationNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8" style="display: block">
              <el-form-item label="子番" label-width="80px" prop="subNumber">
                <el-input v-model="subNumber" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </title-bar>

    <el-form ref="form" :model="form" :rules="rules" label-width="128px">
      <!-- 出張命令書 -->
      <title-bar title="出張（伺い）命令書" is-top>
        <el-row :gutter="20">
          <el-col :span="24">
            <!-- 出张者 & 命令番号 -->
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="出張者" prop="loginId">
                  <el-select
                    v-model="form.loginId"
                    style="width: 100%"
                    placeholder=""
                    @change="handleLoginIdChange"
                  >
                    <el-option
                      v-for="user in bukaList"
                      :key="user.userId"
                      :label="user.nickName"
                      :value="user.userId"
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

            <!-- 所属 -->
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="所属" prop="belonging">
                  <el-input
                    v-model="form.belonging"
                    placeholder=""
                    show-word-limit
                    maxlength="50"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 出张先 -->
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="出張先1" prop="businessTrip">
                  <el-input
                    v-model="form.businessTrip"
                    placeholder=""
                    show-word-limit
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出張先2" prop="businessTrip2">
                  <el-input
                    v-model="form.businessTrip2"
                    placeholder=""
                    show-word-limit
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出張先3" prop="businessTrip3">
                  <el-input
                    v-model="form.businessTrip3"
                    placeholder=""
                    show-word-limit
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 所在地 -->
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="所在地1" prop="location">
                  <el-input
                    v-model="form.location"
                    placeholder=""
                    show-word-limit
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所在地2" prop="location2">
                  <el-input
                    v-model="form.location2"
                    placeholder=""
                    show-word-limit
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所在地3" prop="location3">
                  <el-input
                    v-model="form.location3"
                    placeholder=""
                    show-word-limit
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 要件 -->
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="要件1" prop="requirements">
                  <el-input
                    v-model="form.requirements"
                    placeholder=""
                    show-word-limit
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="要件2" prop="requirements2">
                  <el-input
                    v-model="form.requirements2"
                    placeholder=""
                    show-word-limit
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="要件3" prop="requirements3">
                  <el-input
                    v-model="form.requirements3"
                    placeholder=""
                    show-word-limit
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="期間（開始）" prop="periodStart">
                  <div style="display: flex; gap: 10px; align-items: center">
                    <el-date-picker
                      clearable
                      v-model="form.periodStart"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="YYYY-MM-DD"
                      style="width: 150px;"
                    />
                    <el-time-select
                      clearable
                      style="width: 120px"
                      v-model="form.periodStartTime"
                      value-format="HH:mm"
                      placeholder="HH:MM"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '23:30',
                      }"
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
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 期間（終了） -->
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="期間（終了）" prop="periodEnd">
                  <div style="display: flex; gap: 10px; align-items: center">
                    <el-date-picker
                      clearable
                      v-model="form.periodEnd"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="YYYY-MM-DD"
                      :picker-options="{ disabledDate: disabledEndDate }"
                      style="width: 150px;"
                    />
                    <el-time-select
                      clearable
                      style="width: 120px"
                      v-model="form.periodEndTime"
                      value-format="HH:mm"
                      placeholder="HH:MM"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '23:59',
                      }"
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
                    show-word-limit
                    maxlength="20"
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
                    show-word-limit
                    maxlength="100"
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
                    show-word-limit
                    maxlength="20"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="float: right;">
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
                        :disabled="approveManagerDisabled"
                        >{{
                          form.approveManager && form.managerApproveDate
                            ? "課長承認取消"
                            : "課長承認"
                        }}
                      </el-button>
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
                        :disabled="approveDirectorDisabled"
                        >{{
                          form.approveDirector && form.directorApproveDate
                            ? "部長承認取消"
                            : "部長承認"
                        }}
                      </el-button>
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
                        :disabled="approvePresidentDisabled"
                        >{{
                          form.approvePresident && form.presidentApproveDate
                            ? "社長承認取消"
                            : "社長承認"
                        }}
                      </el-button>
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
                  <el-select v-model="form.reportLoginId" placeholder="">
                    <el-option
                      v-for="user in bukaList"
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
                        :disabled="approveManagerDisabled"
                        >{{
                          form.reportApproveManager &&
                          form.reportManagerApproveDate
                            ? "課長承認取消"
                            : "課長承認"
                        }}
                      </el-button>
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
                        :disabled="approveDirectorDisabled"
                        >{{
                          form.reportApproveDirector &&
                          form.reportDirectorApproveDate
                            ? "部長承認取消"
                            : "部長承認"
                        }}
                      </el-button>
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
                        :disabled="approvePresidentDisabled"
                        >{{
                          form.reportApprovePresident &&
                          form.reportPresidentApproveDate
                            ? "社長承認取消"
                            : "社長承認"
                        }}
                      </el-button>
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
          <!-- <el-button type="primary" @click="handlePrint('reportPrint')"
          >出張報告書印刷
          </el-button
          >
          <el-button type="primary" @click="handlePrint('travelFeePrint')"
          >出張精算印刷
          </el-button
          > -->
          <el-button
            type="primary"
            @click="openReportAdd"
            :disabled="negotiationNoNameList.length < 1"
            style="height: 38px"
            >出張報告書追加
          </el-button>
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
                (queryParams.pageNum - 1) * queryParams.pageSize +
                scope.$index +
                1
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
            <el-table-column label="子番">
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
              width="180px"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="目的の補足欄"
              prop="locationSupplementary"
              width="180px"
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
              width="180px"
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
                  </el-button>
                  <!-- <el-button
                    size="mini"
                    type="primary"
                    @click="openTravelFee(scope.row)"
                    >出張精算書登録</el-button
                  > -->
                  <el-button
                    size="mini"
                    type="primary"
                    @click="handleDelete(scope.row)"
                    >削除
                  </el-button>
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
                style="color: #000 !important; cursor: default"
                disabled
                v-if="isBusTravelFee === '1'"
                >出張精算済
              </el-button>
              <el-button
                type="info"
                plain
                style="color: #000 !important; cursor: default"
                disabled
                v-if="isBusTravelFee === '0'"
                >出張精算未
              </el-button>
              <el-button
                type="primary"
                @click="openTravelFee()"
                style="height: 38px; margin-left: 20px"
                >{{
                  isBusTravelFee === "0" ? "出張精算書登録" : "出張精算書編集"
                }}
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </title-bar>
    <div class="footer-back">
      <el-button type="primary" @click="submitForm">登録</el-button>
      <el-button @click="handleClose" v-show="showFlg">戻る</el-button>
      <!-- <el-button type="primary" @click="handlePrint('instructionPrint')">印刷</el-button> -->
    </div>

    <reportDialog ref="reportDialog" @callback="handleReportCallback" />
    <travelFeeDialog
      ref="travelFeeDialog"
      @callback="handleTravelFeeCallback"
    />
  </div>
</template>

<script>
import {
  addInstruction,
  getNegotiationNo,
  getRoleMain,
  instructionPrint,
  reportPrint,
  travelFeePrint,
} from "@/api/business/instruction";
import { getNegotiations } from "@/api/business/negotiations";
import { getUserProfile, listUser, selectBukaList } from "@/api/system/user";
import { getByteLength } from "@/utils";
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
      if (rule.field === "periodStart" || rule.field === "periodStartTime") {
        if (this.form.periodStart && !this.form.periodStartTime) {
          callback(new Error("開始時間を入力してください"));
          return;
        } else if (this.form.periodStartTime && !this.form.periodStart) {
          callback(new Error("開始日を入力してください"));
          return;
        } else if (this.form.periodStart && this.form.periodStartTime) {
          const startDateTimeStr = `${this.form.periodStart} ${this.form.periodStartTime}`;
          const startTime = new Date(startDateTimeStr);
          if (isNaN(startTime.getTime())) {
            callback(new Error("開始時間が不正です"));
            return;
          }
        }
      } else if (rule.field === "periodEnd" || rule.field === "periodEndTime") {
        if (this.form.periodEnd && !this.form.periodEndTime) {
          callback(new Error("終了時間を入力してください"));
          return;
        } else if (this.form.periodEndTime && !this.form.periodEnd) {
          callback(new Error("終了日を入力してください"));
          return;
        } else if (this.form.periodEnd && this.form.periodEndTime) {
          const endDateTimeStr = `${this.form.periodEnd} ${this.form.periodEndTime}`;
          const endTime = new Date(endDateTimeStr);
          if (isNaN(endTime.getTime())) {
            callback(new Error("終了時間が不正です"));
            return;
          }

          if (this.form.periodStart && this.form.periodStartTime) {
            const startDateTimeStr = `${this.form.periodStart} ${this.form.periodStartTime}`;
            const startTime = new Date(startDateTimeStr);
            if (!isNaN(startTime.getTime()) && startTime > endTime) {
              callback(new Error("期限の大小関係が逆転しています"));
              return;
            }
          }
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
    const negotiationNoRequired = (rule, value, callback) => {
      if (this.searchForm.negotiationType === "1" && !value) {
        callback(
          new Error("案件連動モードの場合、案件番号を必ず選択してください")
        );
      } else {
        callback();
      }
    };
    const negotiationClassRequired = (rule, value, callback) => {
      if (this.searchForm.negotiationType === "0" && !value) {
        callback(
          new Error("案件非連動モードの場合、出張区分を必ず選択してください")
        );
      } else {
        callback();
      }
    };
    const byteLengthValidator = (rule, value, callback) => {
      const maxLength = rule.maxLength;
      if (value && getByteLength(value) > maxLength) {
        callback(new Error(`${maxLength}文字以内入力してください`));
      } else {
        callback();
      }
    };
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      isLoading: false,
      roleList: [],
      approvePresidentDisabled: true,
      approveDirectorDisabled: true,
      approveManagerDisabled: true,
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
        negotiationClass: "04",
      },

      fromRouterPath: "",
      fromRouterQuery: "",
      form: {
        expenses: 0,
        loginId: null,
        reportLoginId: null,
      },
      travelFeeForm: {},
      instructionReportList: [],
      negotiationNoNameList: [],
      negotiationNoNameAllList: [],
      hasUnsavedChanges: false,
      getInfoFlag: true,
      bukaList: [],
      rules: {
        loginId: [
          {
            required: true,
            message: "出張者は必須です",
            trigger: "change",
          },
        ],
        belonging: [
          {
            required: true,
            message: "所属は必須です",
            trigger: "blur",
          },
          {
            validator: byteLengthValidator,
            maxLength: 50,
            message: "所属には50バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        businessTrip: [
          { required: true, message: "出張先1は必須です", trigger: "blur" },
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "出張先1には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        businessTrip2: [
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "出張先2には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        businessTrip3: [
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "出張先3には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        location: [
          { required: true, message: "所在地1は必須です", trigger: "blur" },
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "所在地1には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        location2: [
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "所在地2には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        location3: [
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "所在地3には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        requirements: [
          { required: true, message: "要件1は必須です", trigger: "blur" },
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "要件1には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        requirements2: [
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "要件2には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        requirements3: [
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "要件3には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        periodStart: [
          { required: true, message: "開始期間は必須です", trigger: "blur" },
          { validator: timeRangeValidator, trigger: "blur" },
        ],
        periodStartTime: [
          { required: true, message: "開始期間は必須です", trigger: "blur" },
          { validator: timeRangeValidator, trigger: "blur" },
        ],
        periodEnd: [
          { required: true, message: "終了期間は必須です", trigger: "blur" },
          { validator: timeRangeValidator, trigger: "blur" },
        ],
        periodEndTime: [
          { required: true, message: "終了期間は必須です", trigger: "blur" },
          { validator: timeRangeValidator, trigger: "blur" },
        ],
        reportLoginId: [
          { required: true, message: "出張者氏名は必須です", trigger: "change" },
        ],
        expenses: [
          { required: true, message: "旅費概算払は必須です", trigger: "blur" },
        ],
        approveId: [
          { required: true, message: "承認者は必須です", trigger: "blur" },
          {
            max: 20,
            message: "は20文字以内で入力してください",
            trigger: "submit",
          },
        ],
        indication: [
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "指示事項には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        indicateId: [
          {
            max: 20,
            message: "は20文字以内で入力してください",
            trigger: "submit",
          },
          { validator: instructorRequired, trigger: "submit" },
        ],
      },
      searchRules: {
        negotiationNo: [
          { validator: negotiationNoRequired, trigger: "submit" },
        ],
        negotiationClass: [
          { validator: negotiationClassRequired, trigger: "submit" },
        ],
      },
      user: {},
      userList: [],
      loading: false,
      showFlg: this.$route.params.negotiationNo
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
    // whetherExceed() {
    //   return (
    //     this.submitSelections && this.submitSelections.length > this.previewSize
    //   );
    // },

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
      this.instructionReportList = [];
      if (newVal === "0") {
        const childComp = this.$refs.negotiationsComp;
        if (childComp) {
          childComp.clearTag();
        }

        this.subNumber = "000";
        this.form.negotiationNo = this.negotiationNo;

        this.negotiationNoNameList = [];
        this.negotiationNoNameList.push({
          label:
            "案件:" +
            this.negotiationNo +
            "|子番:" +
            this.subNumber +
            "|案件名:|活動:",
          value: this.negotiationNo + "|" + this.subNumber + "|",
        });
      } else {
        this.searchForm.negotiationClass = "04";
        this.subNumber = "";
        this.form.negotiationNo = "";
        this.negotiationNoNameList = [];
      }
    },
    form: {
      deep: true,
      handler() {
        if (this.getInfoFlag) {
          this.hasUnsavedChanges = true;
        }
      }
    },
    searchForm: {
      deep: true,
      handler() {
        if (this.getInfoFlag) {
          this.hasUnsavedChanges = true;
        }
      }
    },
    instructionReportList: {
      deep: true,
      handler() {
        if (this.getInfoFlag) {
          this.hasUnsavedChanges = true;
        }
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
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
    this.getInfoFlag = false;
    this.$modal.loading();
    await this.getUser();
    await this.getInfo();
    await this.route();
    await this.selectBukaInfos();
    this.getInfoFlag = true;
    this.form.loginId = Number(this.$store.getters.userId);
    this.handleLoginIdChange();
    this.$modal.closeLoading();
  },
  methods: {
    async selectBukaInfos() {
      await selectBukaList({userId: this.$store.getters.userId}).then(response => {
        this.bukaList = response.data;
      });
    },
    async route() {
      const negotiationNo = this.$route.params.negotiationNo;
      const subNumber = this.$route.params.subNumber;
      const activityNo = this.$route.params.activityNo ?? "";
      if (negotiationNo) {
        await getNegotiations(negotiationNo, subNumber).then(response => {
          console.log(response);
          if (activityNo + '' !== '-1') {
            this.searchForm.negotiationNo = negotiationNo + "|" + subNumber + "|" + activityNo;
            this.negotiationNoNameList.push({
              label:
                "案件:" +
                negotiationNo +
                "|子番:" +
                subNumber +
                "|案件名:" +
                response.data.negotiationName +
                "|活動:" +
                activityNo,
              value: negotiationNo + "|" + subNumber + "|" + activityNo,
            });
          } else {
            this.searchForm.negotiationNo = negotiationNo + "|" + subNumber;
            this.negotiationNoNameList.push({
              label:
                "案件:" +
                negotiationNo +
                "|子番:" +
                subNumber +
                "|案件名:" +
                response.data.negotiationName +
                "|活動:",
              value: negotiationNo + "|" + subNumber,
            });
          }
            console.log(this.searchForm.negotiationNo);
            console.log(this.negotiationNoNameList);
        });
      }
    },

    handleLoginIdChange() {
      if (!this.form.reportLoginId) {
        this.form.reportLoginId = this.form.loginId + "";
      }
    },

    async handlePrint(type) {
      this.isLoading = true;
      this.errorMessage = "";
      try {
        let blob;
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
        const printWindow = window.open(url, "_blank");
        if (!printWindow) {
          throw new Error(
            "ポップアップがブロックされました。許可して再試行してください。"
          );
        }
        this.$modal.msgSuccess("PDFファイルを作成しました。");
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

    handleApprove(value) {
      const nickName = this.$store.state.user.nickName;
      const date = this.formatToYmd();

      if (value === "approvePresident") {
        if (this.form.approvePresident && this.form.presidentApproveDate) {
          this.form.approvePresident = null;
          this.form.presidentApproveDate = null;
        } else {
          this.form.approvePresident = nickName;
          this.form.presidentApproveDate = date;
        }
      } else if (value === "approveDirector") {
        if (this.form.approveDirector && this.form.directorApproveDate) {
          this.form.approveDirector = null;
          this.form.directorApproveDate = null;
        } else {
          this.form.approveDirector = nickName;
          this.form.directorApproveDate = date;
        }
      } else if (value === "approveManager") {
        if (this.form.approveManager && this.form.managerApproveDate) {
          this.form.approveManager = null;
          this.form.managerApproveDate = null;
        } else {
          this.form.approveManager = nickName;
          this.form.managerApproveDate = date;
        }
      } else if (value === "reportApprovePresident") {
        if (
          this.form.reportApprovePresident &&
          this.form.reportPresidentApproveDate
        ) {
          this.form.reportApprovePresident = null;
          this.form.reportPresidentApproveDate = null;
        } else {
          this.form.reportApprovePresident = nickName;
          this.form.reportPresidentApproveDate = date;
        }
      } else if (value === "reportApproveDirector") {
        if (
          this.form.reportApproveDirector &&
          this.form.reportDirectorApproveDate
        ) {
          this.form.reportApproveDirector = null;
          this.form.reportDirectorApproveDate = null;
        } else {
          this.form.reportApproveDirector = nickName;
          this.form.reportDirectorApproveDate = date;
        }
      } else if (value === "reportApproveManager") {
        if (
          this.form.reportApproveManager &&
          this.form.reportManagerApproveDate
        ) {
          this.form.reportApproveManager = null;
          this.form.reportManagerApproveDate = null;
        } else {
          this.form.reportApproveManager = nickName;
          this.form.reportManagerApproveDate = date;
        }
      }
      this.$forceUpdate();
    },

    async getInfo() {
     await getNegotiationNo().then((response) => {
          this.negotiationNo = response.data;
        })
        .catch((err) => console.log(err))
        .finally(() => this.$modal.closeLoading());
      // getRoleMain("")
      //     .then((response) => {
      //         this.roleList = response.data;
      //         if (response.data.includes("admin")) {
      //             this.approvePresidentDisabled = false;
      //             this.approveDirectorDisabled = false;
      //             this.approveManagerDisabled = false;
      //         } else if (response.data.includes("shacho")) {
      //             this.approvePresidentDisabled = false;
      //         } else if (response.data.includes("bucho")) {
      //             this.approveDirectorDisabled = false;
      //         } else if (response.data.includes("kacho")) {
      //             this.approveManagerDisabled = false;
      //         }
      //     })
      //     .catch((err) => console.log(err))
      //     .finally(() => this.$modal.closeLoading());
    },

    openTravelFee() {
      const reportLoginId = this.form.reportLoginId + "";
      const selectedUser = this.userList.find(
        (user) => user.userId + "" === reportLoginId
      );
      const loginName = selectedUser ? selectedUser.nickName : "";
      let travelFee = {
        operation: "add",
        belonging: this.form.belonging,
        loginName: loginName,
        businessTrip: this.form.businessTrip,
        location: this.form.location,
        requirements: this.form.requirements,
        businessTrip2: this.form.businessTrip2,
        location2: this.form.location2,
        requirements2: this.form.requirements2,
        businessTrip3: this.form.businessTrip3,
        location3: this.form.location3,
        requirements3: this.form.requirements3,
        roleList: this.roleList,
        travelFeeForm: this.form.travelFeeForm,
        isBusTravelFee: this.isBusTravelFee,
      };
      this.$refs.travelFeeDialog.open(travelFee);
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
    handleTravelFeeCallback(callback) {
      this.form.travelFeeForm = callback;
      this.isBusTravelFee = "1";
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
        return noA.localeCompare(noB, "zh-CN", { numeric: true });
      });
      selections = sortedArr;

      this.instructionReportList = [];
      this.negotiationNoNameList = [];
      this.negotiationNoNameAllList = [];

      selections.forEach((item) => {
        // this.instructionReportList.push({
        //   negotiationNo: item.negotiationNo,
        //   negotiationNoStr: item.negotiationNo,
        // });

        this.negotiationNoNameList.push({
          label: item.negotiationNoName,
          value: item.negotiationNo,
        });
        this.negotiationNoNameAllList.push({
          label: item.negotiationNoName,
          value: item.negotiationNo,
        });
      });
    },
    openReportAdd() {
      let cont = this.instructionReportList.length + 1;
      let reportDialog = {
        negotiationNoNameList: this.negotiationNoNameList,
        reportNumber: cont + "/" + cont,
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
        operation: "edit",
        negotiationNoNameAllList: this.negotiationNoNameAllList,
        reportNumber: index + 1 + "/" + this.instructionReportList.length,
      };
      this.$refs.reportDialog.open(reportDialog);
    },
    async getUser() {
      await getUserProfile().then((response) => {
        this.user = response.data;
      });
      await listUser({ pageSize: -1 }).then((response) => {
        this.userList = response.rows;
      });
    },

    submitForm() {
      this.$refs.searchFormRef.validate((searchValid) => {
        if (!searchValid) return;
      });
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.searchForm.negotiationType === "1") {
            if (!this.searchForm.negotiationNo) {
              this.$modal.msgWarning(
                "案件連動モードの場合、案件番号を必ず選択してください"
              );
              return;
            }
            this.form.negotiationNo = this.searchForm.negotiationNo;
          } else {
            if (!this.searchForm.negotiationClass) {
              this.$modal.msgWarning(
                "案件非連動モードの場合、出張区分を必ず選択してください"
              );
              return;
            }
            this.form.negotiationNo =
              this.form.negotiationNo + "|" + this.subNumber + "|";
          }

          this.$modal.loading();
          this.form.negotiationClass = this.searchForm.negotiationClass;
          this.form.negotiationType = this.searchForm.negotiationType;

          this.instructionReportList.forEach((item, index) => {
            item.reportNumber =
              index + 1 + "/" + this.instructionReportList.length;
          });
          this.form.instructionReportList = this.instructionReportList;
          addInstruction(this.form)
            .then((response) => {
              (this.searchForm = {
                negotiationType: "1",
                negotiationNo: null,
                negotiationClass: null,
              }),
                (this.form = { expenses: 0, negotiationNo: "" });
              this.getInfo();
              this.roleList = [];
              this.approvePresidentDisabled = true;
              this.approveDirectorDisabled = true;
              this.approveManagerDisabled = true;
              this.isBusTravelFee = "0";
              this.travelFeeForm = {};
              this.instructionReportList = [];
              this.negotiationNoNameList = [];
              this.negotiationNoNameAllList = [];
              this.hasUnsavedChanges = false;

              const childComp = this.$refs.negotiationsComp;
              if (childComp) {
                childComp.clearTag();
              }

              this.$modal.msgSuccess("登録しました。");
              const router =
                "/instruction/instruction/instructionDetail/" + response.data;
              this.$router.push(router);
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              this.$modal.closeLoading();
            });
        } else {
            this.$nextTick(() => {
                const errorEl = document.querySelector('.el-form-item.is-error');
                if (errorEl) {
                    errorEl.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
            });
        }
      });
    },

    handleClose() {
        const router = "/newCase/negotiations/negotiationsEdit/index/" + this.$route.params.negotiationNo + "/" + this.$route.params.subNumber + "/" + this.$route.params.route;
        this.$router.push(router);
    },

    formatToYmd() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}/${month}/${day}`;
    },
    handleDelete(row) {
      let that = this;
      that.$modal
        .confirm("データを削除してもよろしいですか？")
        .then(function () {
          const index = that.instructionReportList.findIndex(
            (item) => item.negotiationNo === row.negotiationNo
          );
          that.instructionReportList.splice(index, 1);

          that.negotiationNoNameList.push({
            label: row.negotiationNoName,
            value: row.negotiationNo,
          });
        })
        .catch(() => {});
    },
  },
};
</script>

