<template>
  <el-dialog
    title="旅費精算請求書"
    :visible.sync="visible"
    width="1400px"
    append-to-body
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <div style="width: 100%">
        <el-row :gutter="10">
          <el-col :span="6" style="padding-top: 70px">
            <el-form-item
              label="命令書No"
              prop="instructionNo"
              label-width="140px"
              style="margin: 0"
            >
              <el-input v-model="form.instructionNo" placeholder="" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="4" style="padding-top: 70px">
            <el-form-item
              label="旅費精算No"
              prop="travelFeeNo"
              label-width="90px"
              style="margin: 0"
            >
              <el-input v-model="form.travelFeeNo" placeholder="" disabled />
            </el-form-item>
          </el-col>

          <el-col :span="2" style="min-height: 1px; width: 150px"></el-col>
          <el-col :span="2" style="padding: 0 !important">
            <div
              style="
                border: 1px solid #c6e2ff;
                min-height: 129px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 13px;
              "
            >
              承認者
            </div>
          </el-col>

          <el-col :span="2" style="padding: 0 !important">
            <div style="border: 1px solid #dcdfe6; border-left: none">
              <div
                style="
                  text-align: center;
                  padding: 5px;
                  border-bottom: 1px solid #dcdfe6;
                  font-weight: bold;
                  font-size: 13px;
                "
              >
                社長
              </div>
              <div
                style="
                  padding: 8px;
                  font-size: 13px;
                  line-height: 1.5;
                  width: 100px;
                  min-height: 76px;
                  flex-direction: column;
                  display: flex;
                  justify-content: center;
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
                :disabled="approvePresidentDisabled || initialApprovePresident"
                >{{ initialApprovePresident ? '社長承認済' : (form.approvePresident && form.presidentApproveDate ? '社長承認取消' : '社長承認') }}</el-button
              >
            </div>
          </el-col>

          <el-col :span="2" style="padding: 0 !important">
            <div style="border: 1px solid #dcdfe6; border-left: none">
              <div
                style="
                  text-align: center;
                  padding: 5px;
                  border-bottom: 1px solid #dcdfe6;
                  font-weight: bold;
                  font-size: 13px;
                "
              >
                総務部長
              </div>
              <div
                style="
                  padding: 8px;
                  font-size: 13px;
                  line-height: 1.5;
                  width: 100px;
                  min-height: 76px;
                  flex-direction: column;
                  display: flex;
                  justify-content: center;
                "
              >
                <div style="text-align: center">
                  {{
                    form.affairsApproveDate === true
                      ? ""
                      : form.affairsApproveDate || ""
                  }}
                </div>
                <div style="text-align: center">
                  {{ form.approveAffairs || "" }}
                </div>
              </div>
              <el-button
                type="primary"
                @click="handleApprove('approveAffairs')"
                style="
                  text-align: center;
                  padding: 4px;
                  font-size: 12px;
                  width: 100%;
                "
                :disabled="approveAffairsDisabled || initialApproveAffairs"
                >{{ initialApproveAffairs ? '総務承認済' : (form.approveAffairs && form.affairsApproveDate ? '総務承認取消' : '総務承認') }}</el-button
              >
            </div>
          </el-col>

          <el-col :span="2" style="padding: 0 !important">
            <div style="border: 1px solid #dcdfe6; border-left: none">
              <div
                style="
                  text-align: center;
                  padding: 5px;
                  border-bottom: 1px solid #dcdfe6;
                  font-weight: bold;
                  font-size: 13px;
                "
              >
                所属部長
              </div>
              <div
                style="
                  padding: 8px;
                  font-size: 13px;
                  line-height: 1.5;
                  width: 100px;
                  min-height: 76px;
                  flex-direction: column;
                  display: flex;
                  justify-content: center;
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
                :disabled="approveDirectorDisabled || initialApproveDirector"
                >{{ initialApproveDirector ? '部長承認済' : (form.approveDirector && form.directorApproveDate ? '部長承認取消' : '部長承認') }}</el-button
              >
            </div>
          </el-col>

          <el-col :span="2" style="padding: 0 !important">
            <div style="border: 1px solid #dcdfe6; border-left: none">
              <div
                style="
                  text-align: center;
                  padding: 5px;
                  border-bottom: 1px solid #dcdfe6;
                  font-weight: bold;
                  font-size: 13px;
                "
              >
                所属課長
              </div>
              <div
                style="
                  padding: 8px;
                  font-size: 13px;
                  line-height: 1.5;
                  width: 100px;
                  min-height: 76px;
                  flex-direction: column;
                  display: flex;
                  justify-content: center;
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
                :disabled="approveManagerDisabled || initialApproveManager"
                >{{ initialApproveManager ? '課長承認済' : (form.approveManager && form.managerApproveDate ? '課長承認取消' : '課長承認') }}</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="app-container-router">
        <title-bar
          title="旅費精算請求書"
          is-top
          style="width: 100%"
        >
          <el-row :gutter="10" style="padding: 0 1em 0 1em">
            <el-col :span="8">
              <el-form-item
                label="出張者・所属"
                prop="belonging"
                label-width="140px"
                style="font-weight: normal"
              >
                <el-input v-model="form.belonging" placeholder="" :disabled="detailDisabled" show-word-limit maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="出張者・氏名"
                prop="loginName"
                label-width="140px"
                style="font-weight: normal"
              >
                <el-input v-model="form.loginName" placeholder="" :disabled="detailDisabled" show-word-limit maxlength="50" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="padding: 0 1em 0 1em">
            <el-col :span="8">
              <el-form-item
                label="出張先1"
                prop="businessTrip"
                label-width="140px"
                style="font-weight: normal"
              >
                <el-input v-model="form.businessTrip" placeholder="" :disabled="detailDisabled" show-word-limit maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="所在地1"
                prop="location"
                label-width="140px"
                style="font-weight: normal"
              >
                <el-input v-model="form.location" placeholder="" :disabled="detailDisabled" show-word-limit maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="要件・作業内容1"
                prop="requirements"
                label-width="140px"
                style="font-weight: normal"
              >
                <el-input
                  v-model="form.requirements"
                  placeholder=""
                  type="textarea"
                  :rows="2"
                  :disabled="detailDisabled"
                  show-word-limit maxlength="100"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="padding: 0 1em 0 1em">
            <el-col :span="8">
              <el-form-item
                label="出張先2"
                prop="businessTrip2"
                label-width="140px"
                style="font-weight: normal"
              >
                <el-input v-model="form.businessTrip2" placeholder="" :disabled="detailDisabled" show-word-limit maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="所在地2"
                prop="location2"
                label-width="140px"
                style="font-weight: normal"
              >
                <el-input v-model="form.location2" placeholder="" :disabled="detailDisabled" show-word-limit maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="要件・作業内容2"
                prop="requirements2"
                label-width="140px"
                style="font-weight: normal"
              >
                <el-input
                  v-model="form.requirements2"
                  placeholder=""
                  type="textarea"
                  :rows="2"
                  :disabled="detailDisabled"
                  show-word-limit maxlength="100"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="padding: 0 1em 0 1em">
            <el-col :span="8">
              <el-form-item
                label="出張先3"
                prop="businessTrip3"
                label-width="140px"
                style="font-weight: normal"
              >
                <el-input v-model="form.businessTrip3" placeholder="" :disabled="detailDisabled" show-word-limit maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="所在地3"
                prop="location3"
                label-width="140px"
                style="font-weight: normal"
              >
                <el-input v-model="form.location3" placeholder="" :disabled="detailDisabled" show-word-limit maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="要件・作業内容3"
                prop="requirements3"
                label-width="140px"
                style="font-weight: normal"
              >
                <el-input
                  v-model="form.requirements3"
                  placeholder=""
                  type="textarea"
                  :rows="2"
                  :disabled="detailDisabled"
                  show-word-limit maxlength="100"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div style="width: 100%; margin: 0px 0; padding-left: 1em">
            <el-row :gutter="0" style="width: 100%">
              <el-col :span="4" style="font-weight: bold;">
                1. 乗り物代
              </el-col>
              <el-col
                :span="20"
                style="
                  min-height: 68px;
                  box-sizing: border-box;
                  line-height: 1.6;
                  padding-left: 250px;
                "
              >
                <!-- <span style="display: block">（注</span>
                <span
                  style="
                    display: block;
                    text-indent: 2em;
                    margin-top: -1.6em;
                    padding-left: 1em;
                  "
                  >
                  1.複数で出張した場合のタクシー代等の共通経費は上席者が請求すること</span
                >
                <span style="display: block; text-indent: 3em"
                  >   2.タクシー代その他の支出は領収書を添付すること）</span
                > -->
                <pre>{{ dictData[0].remark.replace(/\\?u2009/g, '\u2009') }}</pre>
              </el-col>
            </el-row>
          </div>

          <div class="editable-table-container">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="handleAddRow"
              style="margin-bottom: 5px"
              :disabled="detailDisabled"
              >新規行</el-button
            >
            <el-form
              ref="tableForm"
              :model="tableFormData"
              :rules="tableRules"
              style="width: 100%"
            >
              <el-table
                :data="tableData"
                border
                :header-align="center"
                :align="center"
                ref="editableTable"
                style="width: 100%"
                show-summary
                :summary-method="getTableSummary"
                max-height="500px"
              >
                <el-table-column
                  label="年月日"
                  prop="date"
                  width="175px"
                >
                  <template #header>
                    <span class="el-table-required">*</span>
                    <span>年月日</span>
                  </template>
                  <template #default="scope">
                    <div>
                      <el-form-item
                        :prop="`tableData[${scope.$index}].travelDetailDate`"
                        :rules="tableRules.travelDetailDate"
                        style="margin-bottom: 20px;"
                      >
                        <el-date-picker
                          clearable
                          v-model="scope.row.travelDetailDate"
                          type="date"
                          value-format="yyyy/MM/dd"
                          placeholder="YYYY-MM-DD"
                          style="width: 100%"
                          :disabled="detailDisabled"
                        />
                      </el-form-item>
                    </div>
                    <!-- <div v-else @click="handleEdit(scope)" class="cell-text">
                      {{ scope.row.travelDetailDate || "" }}
                    </div> -->
                  </template>
                </el-table-column>

                <el-table-column
                  label="発着時刻"
                  prop="time"
                  width="180px"
                >
                  <template #header>
                    <span class="el-table-required">*</span>
                    <span>発着時刻</span>
                  </template>
                  <template #default="scope">
                    <div>
                      <el-form-item
                        :prop="`tableData[${scope.$index}].startTime`"
                        style="margin-bottom: 20px;"
                        :rules="tableRules.startTime"
                      >
                        <el-time-select
                          clearable
                          style="width: 120px"
                          v-model="scope.row.startTime"
                          value-format="HH:mm"
                          placeholder="HH:MM"
                          :picker-options="{
                            start: '00:00',
                            step: '00:30',
                            end: '23:30',
                          }"
                          :disabled="detailDisabled"
                        ></el-time-select>
                      </el-form-item>
                      <el-form-item
                        :prop="`tableData[${scope.$index}].endTime`"
                        style="margin-bottom: 20px;"
                        :rules="tableRules.endTime"
                      >
                        <el-time-select
                          clearable
                          style="width: 120px"
                          v-model="scope.row.endTime"
                          value-format="HH:mm"
                           placeholder="HH:MM"
                          :picker-options="{
                            start: '00:30',
                            step: '00:30',
                            end: '23:30',
                          }"
                          :disabled="detailDisabled"
                        ></el-time-select>
                      </el-form-item>
                    </div>
                    <!-- <div v-else @click="handleEdit(scope)" class="cell-text">
                      {{
                        scope.row.startTime && scope.row.endTime
                          ? `${scope.row.startTime}-${scope.row.endTime}`
                          : ""
                      }}
                    </div> -->
                  </template>
                </el-table-column>

                <el-table-column
                  label="場所(駅)名"
                  prop="stationName"
                  width="140px"
                >
                  <template #header>
                    <span class="el-table-required">*</span>
                    <span>場所(駅)名</span>
                  </template>
                  <template #default="scope">
                    <div>
                      <el-form-item
                        :prop="`tableData[${scope.$index}].stationName`"
                        :rules="tableRules.stationName"
                        style="margin-bottom: 63px;"
                      >
                        <el-input
                          v-model="scope.row.stationName"
                          size="mini"
                          placeholder=""
                          :disabled="detailDisabled"
                          maxlength="30"
                        />
                      </el-form-item>
                    </div>
                    <!-- <div v-else @click="handleEdit(scope)" class="cell-text">
                      {{ scope.row.stationName || "" }}
                    </div> -->
                  </template>
                </el-table-column>

                <el-table-column
                  prop="level"
                  width="140px"
                >
                <template #header>
                      <span>急行の名前</span>
                      <br/>
                      <span>寝台の等級</span>
                  </template>
                  <template #default="scope">
                    <div>
                      <el-form-item
                        :prop="`tableData[${scope.$index}].level`"
                        :rules="tableRules.level"
                        style="margin-bottom: 63px;"
                      >
                      <el-input
                        v-model="scope.row.level"
                        size="mini"
                        placeholder=""
                        :disabled="detailDisabled"
                        maxlength="50"
                      />
                      </el-form-item>
                    </div>
                    <!-- <div v-else @click="handleEdit(scope)" class="cell-text">
                      {{ scope.row.level || "" }}
                    </div> -->
                  </template>
                </el-table-column>

                <el-table-column
                  prop="tramAndBoat"
                  width="115px"
                >
                <template #header>
                      <span>電車賃</span>
                      <br/>
                      <span>船賃</span>
                  </template>
                  <template #default="scope">
                    <div>
                      <el-form-item
                        :prop="`tableData[${scope.$index}].tramAndBoat`"
                        :rules="tableRules.tramAndBoat"
                        style="margin-bottom: 63px;"
                      >
                        <!-- <el-input
                          v-model.number="scope.row.tramAndBoat"
                          size="mini"
                          placeholder=""
                          type="number"
                          min="0"
                          :disabled="detailDisabled"
                          show-word-limit maxlength="8"
                        /> -->
                        <ElAmountInput v-model.number="scope.row.tramAndBoat" style="width: 100%;" :disabled="detailDisabled" />
                      </el-form-item>
                    </div>
                    <!-- <div v-else @click="handleEdit(scope)" class="cell-text">
                      {{ formatThousands(scope.row.tramAndBoat) || "" }}
                    </div> -->
                  </template>
                </el-table-column>

                <el-table-column
                  prop="express"
                  width="115px"
                >
                <template #header>
                      <span>急行</span>
                      <br/>
                      <span>寝台料</span>
                  </template>
                  <template #default="scope">
                    <div>
                      <el-form-item
                        :prop="`tableData[${scope.$index}].express`"
                        :rules="tableRules.express"
                        style="margin-bottom: 63px;"
                      >
                        <!-- <el-input
                          v-model.number="scope.row.express"
                          size="mini"
                          placeholder=""
                          type="number"
                          min="0"
                          :disabled="detailDisabled"
                          show-word-limit maxlength="8"
                        /> -->
                        <ElAmountInput v-model.number="scope.row.express" style="width: 100%;" :disabled="detailDisabled" />
                      </el-form-item>
                    </div>
                    <!-- <div v-else @click="handleEdit(scope)" class="cell-text">
                      {{ formatThousands(scope.row.express) || "" }}
                    </div> -->
                  </template>
                </el-table-column>

                <el-table-column
                  prop="fare"
                  width="100px"
                >
                <template #header>
                      <span class="el-table-required">*</span>
                      <span>車賃</span>
                      <br/>
                      <span>ﾀｸｼ-賃</span>
                  </template>
                  <template #default="scope">
                    <div>
                      <el-form-item
                        :prop="`tableData[${scope.$index}].fare`"
                        :rules="tableRules.fare"
                        style="margin-bottom: 63px;"
                      >
                        <!-- <el-input
                          v-model.number="scope.row.fare"
                          size="mini"
                          placeholder=""
                          type="number"
                          min="1"
                          :disabled="detailDisabled"
                          show-word-limit maxlength="8"
                        /> -->
                        <ElAmountInput v-model.number="scope.row.fare" :disabled="detailDisabled" style="width: 100%;"/>
                      </el-form-item>
                    </div>
                    <!-- <div v-else @click="handleEdit(scope)" class="cell-text">
                      {{ formatThousands(scope.row.fare) || "" }}
                    </div> -->
                  </template>
                </el-table-column>

                <el-table-column
                  prop="instructions"
                  width="170px"
                >
                <template #header>
                      <span>車賃･その他の</span>
                      <br/>
                      <span>支出説明</span>
                  </template>
                  <template #default="scope">
                    <div>
                      <el-form-item
                        :prop="`tableData[${scope.$index}].instructions`"
                        :rules="tableRules.instructions"
                        style="margin-bottom: 40px;"
                      >
                      <el-input
                        v-model="scope.row.instructions"
                        type="textarea"
                        size="mini"
                        placeholder=""
                        :rows="2"
                        :disabled="detailDisabled"
                        show-word-limit maxlength="100"
                      />
                      </el-form-item>
                    </div>
                    <!-- <div
                      v-else
                      @click="handleEdit(scope)"
                      class="cell-text"
                    >
                      {{ scope.row.instructions || "" }}
                    </div> -->
                  </template>
                </el-table-column>
                 <el-table-column label="操作" width="90" fixed="right">
                  <template #default="scope">
                    <!-- <el-button
                      v-if="!scope.row.edit"
                      size="mini"
                      type="primary"
                      icon="el-icon-edit"
                      @click="handleEdit(scope)"
                      :disabled="detailDisabled"
                      >編集</el-button
                    >
                    <el-button
                      v-if="scope.row.edit"
                      size="mini"
                      type="success"
                      icon="el-icon-check"
                      @click="handleSave(scope)"
                      :disabled="detailDisabled"
                      >保存</el-button
                    > -->
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="handleDelete(scope.row.id)"
                      :disabled="detailDisabled"
                      >削除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>

          <div class="expense-report-container">
            <div class="section1">
              <span style="font-weight: bold">2. その他</span>
              <table class="expense-table">
                <thead>
                  <tr>
                    <th rowspan="2" class="day-column">
                      <template>
                        <span class="el-table-required">*</span>
                      </template>
                      <span style="letter-spacing: 20px; margin-right: -30px"
                        >日当</span
                      >
                    </th>
                    <th colspan="2">
                      <template>
                        <span class="el-table-required">*</span>
                      </template>
                      <span style="letter-spacing: 20px; margin-right: -30px"
                        >宿泊費</span
                      >
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>出発から帰着<br />までの日数</td>
                    <td>
                      <span style="letter-spacing: 20px; margin-right: -20px"
                        >旅館</span
                      >
                    </td>
                    <td>
                      <span style="letter-spacing: 20px; margin-right: -20px"
                        >車中泊</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td class="fee-amount1">
                      <el-form-item label="" prop="days" label-width="0px"
                        ><input
                          style="width: 100px; height: 25px; margin-right: 10px;text-align: right !important;"
                          @input="filterNumber"
                          v-model="form.days"
                          @change="changeDays"
                          :disabled="detailDisabled"
                          maxlength="5"
                        /><span>日</span></el-form-item
                      >
                    </td>
                    <td class="fee-amount1">
                      <el-form-item label="" prop="innDays" label-width="0px"
                        ><input
                          style="width: 100px; height: 25px; margin-right: 10px;text-align: right !important;"
                          @input="filterNumber"
                          v-model="form.innDays"
                          @change="changeInnDaysByCarDays"
                          :disabled="detailDisabled"
                          maxlength="5"
                        /><span>泊</span></el-form-item
                      >
                    </td>
                    <td class="fee-amount1">
                      <el-form-item label="" prop="carDays" label-width="0px"
                        ><input
                          style="width: 100px; height: 25px; margin-right: 10px;text-align: right !important;"
                          @input="filterNumber"
                          v-model="form.carDays"
                          @change="changeInnDaysByCarDays"
                          :disabled="detailDisabled"
                          maxlength="5"
                        /><span>泊</span></el-form-item
                      >
                    </td>
                  </tr>
                  <tr>
                    <td class="fee-amount1">
                      <el-form-item label="" prop="amounts" label-width="0px">
                        <AmountInput
                          v-model="form.amounts"
                          @change="changeDays"
                          :disabled="detailDisabled"
                        />
                        <span>円</span></el-form-item
                      >
                    </td>
                    <td class="fee-amount1">
                      <el-form-item label="" prop="innAmounts" label-width="0px"
                        ><AmountInput
                          v-model="form.innAmounts"
                          @change="changeInnDaysByCarDays"
                          :disabled="detailDisabled"
                        /><span>円</span></el-form-item
                      >
                    </td>
                    <td class="fee-amount1">
                      <el-form-item label="" prop="carAmounts" label-width="0px"
                        ><AmountInput
                          v-model="form.carAmounts"
                          @change="changeInnDaysByCarDays"
                          :disabled="detailDisabled"
                        /><span>円</span></el-form-item
                      >
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="notes">
                <pre >{{ dictData[1].remark.replace(/\\?u2009/g, '\u2009') }}</pre>
                <!-- <p>・手続</p>
                <span
                  style="display: block; padding-left: 70px; margin-top: -2.4em"
                  >出張者→所属課長→所属部長→社長→総務課 (フル)</span
                >
                <p>・書類</p>
                <span
                  style="display: block; padding-left: 70px; margin-top: -2.4em"
                  >出張報告書（１）</span
                >
                <span style="display: block; padding-left: 70px"
                  >出費精算請求書（２）</span
                >
                <p>（注）３．(1) と(2)はまとめて速やか(10日以内)に提出のこと</p> -->
              </div>
            </div>

            <div class="section2">
              <span style="font-weight: bold">3. 精算</span>
              <table class="expense-table">
                <tbody>
                  <tr>
                    <td class="fee-name">
                      <span style="letter-spacing: 20px; margin-right: -20px"
                        >運賃</span
                      >
                    </td>
                    <td class="fee-amount">
                      <span style="margin-right: 10px">
                        {{ form.fare }}
                      </span>
                      円
                    </td>
                    <td rowspan="7" class="remark-column">
                      <pre >{{ dictData[2].remark.replace(/\\?u2009/g, '\u2009') }}</pre>
                      <!-- <span style="display: block; text-align: center"
                        >備考(特別の支出があるとき</span
                      >
                      <span style="display: block; text-align: right"
                        >はその説明資料添付のこと)</span
                      > -->
                      <el-form-item prop="remark" label-width="0">
                        <el-input
                          type="textarea"
                          :rows="10"
                          maxlength="200"
                          show-word-limit
                          v-model="form.remark"
                        />
                      </el-form-item>
                    </td>
                  </tr>
                  <tr>
                    <td class="fee-name">
                      <span style="letter-spacing: 20px; margin-right: -20px"
                        >日当</span
                      >
                    </td>
                    <td class="fee-amount">
                      <span style="margin-right: 10px">
                        {{ form.dailyAllowance }}
                      </span>
                      円
                    </td>
                  </tr>
                  <tr>
                    <td class="fee-name">宿泊費</td>
                    <td class="fee-amount">
                      <span style="margin-right: 10px">
                        {{ form.lodging }}
                      </span>
                      円
                    </td>
                  </tr>
                  <tr>
                    <td class="fee-name">その他</td>
                    <td class="fee-amount">
                      <!-- <span style="margin-right: 10px">
                        {{ form.others }}
                      </span> -->
                      <el-form-item label="" prop="others" label-width="0px">
                        <AmountInput v-model="form.others" :disabled="detailDisabled" />
                        円
                      </el-form-item>
                    </td>
                  </tr>
                  <tr>
                    <td class="fee-name">出張経費(A)</td>
                    <td class="fee-amount">
                      <span style="margin-right: 10px">
                        {{ form.fareA }}
                      </span>
                      円
                    </td>
                  </tr>
                  <tr>
                    <td class="fee-name">仮払金(B)</td>
                    <td class="fee-amount">
                      <!-- <span style="margin-right: 10px">
                        {{ form.fareB }}
                      </span> -->
                      <el-form-item label="" prop="fareB" label-width="0px">
                        <AmountInput v-model="form.fareB" :disabled="detailDisabled"/>
                        円
                      </el-form-item>
                    </td>
                  </tr>
                  <tr>
                    <td class="fee-name">精算額<br />(A)-(B)</td>
                    <td class="fee-amount">
                      <span style="margin-right: 10px">
                        {{ form.fareC }}
                      </span>
                      円
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </title-bar>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :disabled="detailDisabled">確 定</el-button>
      <el-button @click="handleClose">キャンセル</el-button>
    </div>
  </el-dialog>
</template>


<script>
import { getDialogFee } from "@/api/business/travelFee";
import { getByteLength } from "@/utils";
import AmountInput from "@/components/Input/AmountInput";
import ElAmountInput from "@/components/Input/ElAmountInput";
import {
  getDict
} from "@/api/business/instruction";

export default {
  name: "InfoAdd",
  dicts: [
    "bus_travel_fee_text",
  ],
  components: { AmountInput, ElAmountInput},
  data() {
    const byteLengthValidator = (rule, value, callback) => {
      const maxLength = rule.maxLength;
      if (value && getByteLength(value) > maxLength) {
        callback(new Error(`${maxLength}文字以内入力してください`));
      } else {
        callback();
      }
    };
    return {
      approvePresidentDisabled: true,
      approveDirectorDisabled: true,
      approveManagerDisabled: true,
      approveAffairsDisabled: true,
      initialApprovePresident: false,
      initialApproveAffairs: false,
      initialApproveDirector: false,
      initialApproveManager: false,
      dictData:[],
      getInfoFlag: false,
      rowHandle: {},
      detailDisabled: false,
      visible: false,
      tableData: [],
      tableFormData: {
        tableData: [],
        sums4: 0,
        sums5: 0,
        sums6: 0,
        startTime: "",
        endTime: "",
      },
      originalData: {},
      nextId: 1,
      fromRouterPath: "",
      fromRouterQuery: "",
      formCopy: {},
      form: {
        days: "0",
        innDays: "0",
        carDays: "0",
        amounts: "0",
        innAmounts: "0",
        carAmounts: "0",
        fare: 0,
        dailyAllowance: 0,
        lodging: 0,
        others: "0",
        fareA: 0,
        fareB: "0",
        fareC: 0,
        fareNum: 0,
        dailyAllowanceNum: 0,
        lodgingNum: 0,
        othersNum: 0,
        fareANum: 0,
        fareBNum: 0,
        fareCNum: 0,
        businessTrip2: "",
        location2: "",
        requirements2: "",
        businessTrip3: "",
        location3: "",
        requirements3: "",
        remark: "",
      },
      // フォーム検証ルール
      rules: {
        others: [
          { required: true, message: "その他は必須です", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              this.validateDigitLength(value, 8, callback);
            },
            trigger: "submit",
          },
        ],
        fareB: [
          { required: true, message: "仮払金(B)は必須です", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              this.validateDigitLength(value, 8, callback);
            },
            trigger: "submit",
          },
        ],
        belonging: [
          { required: true, message: "出張者・所属は必須です", trigger: "blur" },
          {
            validator: byteLengthValidator,
            maxLength: 50,
            message: "出張者・所属には50バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        loginName: [
          { required: true, message: "出張者・氏名は必須です", trigger: "blur" },
          {
            validator: byteLengthValidator,
            maxLength: 50,
            message: "出張者・氏名には50バイトを超えて入力できません",
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
          { required: true, message: "要件・作業内容1は必須です", trigger: "blur" },
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "要件・作業内容1には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        requirements2: [
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "要件・作業内容2には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        requirements3: [
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "要件・作業内容3には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        remark: [
          {
            validator: byteLengthValidator,
            maxLength: 200,
            message: "備考には200バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        days: [
          { required: true, message: "日数は必須です", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              this.validateDigitLength(value, 8, callback);
            },
            trigger: "submit",
          },
        ],
        innDays: [
          { required: true, message: "旅館は必須です", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              this.validateDigitLength(value, 8, callback);
            },
            trigger: "submit",
          },
        ],
        carDays: [
          { required: true, message: "車中は必須です", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              this.validateDigitLength(value, 8, callback);
            },
            trigger: "submit",
          },
        ],
        amounts: [
          { required: true, message: "きんがくは必須です", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              this.validateDigitLength(value, 8, callback);
            },
            trigger: "submit",
          },
        ],
        innAmounts: [
          { required: true, message: "旅館きんがくは必須です", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              this.validateDigitLength(value, 8, callback);
            },
            trigger: "submit",
          },
        ],
        carAmounts: [
          { required: true, message: "車中きんがくは必須です", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              this.validateDigitLength(value, 8, callback);
            },
            trigger: "submit",
          },
        ],
      },
      tableRules: {
        travelDetailDate: [
          {
            required: true,
            message: "年月日は必須です",
            trigger: "blur",
          },
        ],
        startTime: [
          {
            required: true,
            message: "開始時間は必須です",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "終了時間は必須です",
            trigger: "blur",
          },
          { validator: this.validateDateTime, trigger: "submit" },
        ],
        stationName: [
          {
            required: true,
            message: "場所(駅)名は必須です",
            trigger: "blur",
          },
          {
            validator: byteLengthValidator,
            maxLength: 30,
            message: "場所(駅)名には30バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        level: [
          {
            validator: byteLengthValidator,
            maxLength: 50,
            message: "急行の名前 寝台の等級には50バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        fare: [
          {
            required: true,
            message: "車賃ﾀｸｼ-賃は必須です",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              this.validateDigitLength(value, 8, callback);
            },
            trigger: "submit",
          },
        ],
        tramAndBoat: [
          {
            validator: (rule, value, callback) => {
              this.validateDigitLength(value, 8, callback);
            },
            trigger: "submit",
          },
        ],
        express: [
          {
            validator: (rule, value, callback) => {
              this.validateDigitLength(value, 8, callback);
            },
            trigger: "submit",
          },
        ],
        instructions: [
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "車賃、その他運賃説明には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
      },
    };
  },
  // ルート遷移時
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.fromRouterPath) {
        vm.fromRouterPath = from.path;
        vm.fromRouterQuery = from.query;
      }
    });
  },
  created() {
    this.$modal.closeLoading();
    this.getDict();
  },
  watch: {
    tableData: {
      handler(val) {
        this.tableFormData.tableData = val;
      },
      deep: true,
      immediate: true,
    },
    "form.fare": {
      handler(newVal, oldVal) {
        this.form.fareA = this.formatThousands(
          this.form.fareNum +
            this.form.dailyAllowanceNum +
            this.form.lodgingNum +
            this.form.othersNum
        );
      },
    },
    "form.dailyAllowance": {
      handler(newVal, oldVal) {
        this.form.fareA = this.formatThousands(
          this.form.fareNum +
            this.form.dailyAllowanceNum +
            this.form.lodgingNum +
            this.form.othersNum
        );
      },
    },
    "form.lodging": {
      handler(newVal, oldVal) {
        this.form.fareA = this.formatThousands(
          this.form.fareNum +
            this.form.dailyAllowanceNum +
            this.form.lodgingNum +
            this.form.othersNum
        );
      },
    },
    "form.others": {
      handler(newVal, oldVal) {
        this.form.othersNum = this.parseThousandsToNumber(newVal);
        this.form.fareA = this.formatThousands(
          this.form.fareNum +
            this.form.dailyAllowanceNum +
            this.form.lodgingNum +
            this.form.othersNum
        );
      },
    },
    "form.fareA": {
      handler(newVal, oldVal) {
        this.form.fareANum = this.parseThousandsToNumber(newVal);
        this.form.fareC = this.formatThousands(
          this.form.fareANum - this.form.fareBNum
        );
      },
    },
    "form.fareB": {
      handler(newVal, oldVal) {
        this.form.fareBNum = this.parseThousandsToNumber(newVal);
        this.form.fareC = this.formatThousands(
          this.form.fareANum - this.form.fareBNum
        );
      },
    },
  },
  methods: {
    roleDisabled(roleList) {
      if (roleList.includes("admin")) {
        this.approvePresidentDisabled = false;
        this.approveAffairsDisabled = false;
        this.approveDirectorDisabled = false;
        this.approveManagerDisabled = false;
      } else if (roleList.includes("shacho")) {
        this.approvePresidentDisabled = false;
        this.approveAffairsDisabled = false;
        this.approveDirectorDisabled = false;
        this.approveManagerDisabled = false;
      } else if (roleList.includes("somu")) {
        this.approveAffairsDisabled = false;
        this.approveDirectorDisabled = false;
        this.approveManagerDisabled = false;
      }else if (roleList.includes("bucho")) {
        this.approveDirectorDisabled = false;
        this.approveManagerDisabled = false;
      } else if (roleList.includes("kacho")) {
        this.approveManagerDisabled = false;
      } else if (roleList.includes("yakuin")) {
        this.approveAffairsDisabled = false;
        this.approveDirectorDisabled = false;
        this.approveManagerDisabled = false;
      }
    },
    getDict() {
      getDict("bus_travel_fee_text")
        .then((response) => {
          this.dictData = response.data;
        })
        .catch((err) => console.log(err))
        .finally(() => this.$modal.closeLoading());
    },
    getInfo(instructionNo) {
      this.$modal.loading();
      getDialogFee(instructionNo)
        .then((response) => {
          response.data.fareNum = response.data.fare;
          response.data.dailyAllowanceNum = response.data.dailyAllowance;
          response.data.lodgingNum = response.data.lodging;
          response.data.othersNum = response.data.others;
          response.data.fareANum = response.data.fareA;
          response.data.fareBNum = response.data.fareB;
          response.data.fareCNum = response.data.fareC;

          this.form = response.data;

          this.initialApprovePresident = !!this.form.approvePresident && !!this.form.presidentApproveDate;
          this.initialApproveAffairs = !!this.form.approveAffairs && !!this.form.affairsApproveDate;
          this.initialApproveDirector = !!this.form.approveDirector && !!this.form.directorApproveDate;
          this.initialApproveManager = !!this.form.approveManager && !!this.form.managerApproveDate;

          this.form.fare = this.formatThousands(this.form.fare);
          this.form.dailyAllowance = this.formatThousands(
            this.form.dailyAllowance
          );
          this.form.lodging = this.formatThousands(this.form.lodging);

          //総務
          if(this.form.approveAffairs && this.form.approveAffairs !== this.$store.state.user.nickName){
            this.disabled = true;
            this.detailDisabled = true;
          }
          //---------------------
          this.rowHandle = {};
          this.originalData = {};
          const tableData = response.data.busTravelDetailList || [];
          this.tableData = tableData.map((row, index) => {
            return {
              ...row,
              edit: false,
              id: row.id || this.nextId + index,
              travelDetailDate: row.travelDetailDate || "",
              startTime: row.startTime || "",
              endTime: row.endTime || "",
              stationName: row.stationName || "",
              fare: row.fare || 0,
              level: row.level || "",
              tramAndBoat: row.tramAndBoat || 0,
              express: row.express || 0,
              instructions: row.instructions || "",
            };
          });
          this.nextId =
            this.tableData.length > 0
              ? Math.max(...this.tableData.map((item) => item.id)) + 1
              : 11;
          this.tableFormData.tableData = [...this.tableData];

          this.formCopy =  _.cloneDeep(this.form);
        })
        .catch((err) => console.log(err))
        .finally(() => this.$modal.closeLoading());
    },
    validateDigitLength(value,maxlength = 8, callback) {
      const pureNum = this.parseThousandsToNumber(value);

      if (pureNum === 0) {
        callback();
        return;
      }

      const numStr = pureNum.toString().replace(/\.0+$/, "").replace(/\./, "");
      const digitLength = numStr.length;

      if (digitLength > maxlength) {
        callback(new Error(`は${maxlength}桁以内の数値は必須です`));
      } else {
        callback();
      }
    },
    validateDateTime(rule, value, callback) {
      // 从prop中提取行索引
      const index = rule.field.match(/\[(\d+)\]/)[1];
      const row = this.tableData[index];

      if (!row.startTime) {
        return callback(new Error("開始時間を選択してください"));
      }

      if (!row.endTime) {
        return callback(new Error("終了時間を選択してください"));
      }

      const start = new Date(`2000-01-01T${row.startTime}`);
      const end = new Date(`2000-01-01T${row.endTime}`);
      if (end <= start) {
        return callback(
          new Error("終了時間は開始時間より後に")
        );
      }

      callback();
    },
    parseThousandsToNumber(str) {
      if (typeof str == "number") return str;
      if (!str || typeof str !== "string") return 0;
      const pureStr = str.replace(/,/g, "");
      const num = Number(pureStr);
      return isNaN(num) ? 0 : num;
    },
    formatThousands(num, decimalDigits = 0) {
      if (!num || isNaN(Number(num))) return 0;

      const numObj = Number(num);
      const fixedNum = numObj.toFixed(decimalDigits);

      const [integerPart, decimalPart] = fixedNum.split(".");

      const formattedInteger = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      );

      return decimalDigits > 0
        ? `${formattedInteger}.${decimalPart}`
        : formattedInteger;
    },
    changeInnDaysByCarDays() {
      const carDays = this.form.carDays ? this.form.carDays : 0;
      const carAmounts = this.form.carAmounts ? this.form.carAmounts : 0;
      const car = carDays * carAmounts;

      const innDays = this.form.innDays ? this.form.innDays : 0;
      const innAmounts = this.form.innAmounts ? this.form.innAmounts : 0;
      const inn = innDays * innAmounts;
      this.form.lodging = this.formatThousands(inn + car);
      this.form.lodgingNum = inn + car;
    },
    changeDays() {
      const days = this.form.days ? this.form.days : 0;
      const amounts = this.form.amounts ? this.form.amounts : 0;
      this.form.dailyAllowance = this.formatThousands(days * amounts);
      this.form.dailyAllowanceNum = days * amounts;
    },
    filterNumber() {
      this.form.days = this.form.days.replace(/[^0-9]/g, "");
      this.form.innDays = this.form.innDays.replace(/[^0-9]/g, "");
      this.form.carDays = this.form.carDays.replace(/[^0-9]/g, "");
    },
    handleClose() {
      const form1 = _.omit(this.form, ['fareA', 'fareC','operation']);
      const form2 = _.omit(this.formCopy, ['fareA', 'fareC','operation']);
      if(this.detailDisabled || _.isEqual(form1, form2)){
        this.$refs.form.clearValidate();
        this.$refs.tableForm.clearValidate();
        this.visible = false;
        return;
      }else{
        let that = this;
        that.$modal.confirm(
            '保存されていないデータがあります。保存せずに終了しますか?',
            '確認',
            {
                confirmButtonText: 'はい',
                cancelButtonText: 'いいえ',
                type: 'warning'
            }).then(function () {
        that.$refs.form.clearValidate();
        that.$refs.tableForm.clearValidate();
         that.visible = false;
      }).catch(() => {});
      }

      // this.rowHandle = {};
      // this.resetForm("form");
    },
    submitForm() {
      // if (Object.keys(this.rowHandle).length !== 0) {
      //   this.$modal.msgWarning("先に明細データを保存してください");
      //   return;
      // }
      this.$refs["form"].validate((formValid) => {
        if (this.tableData.length > 0) {
          this.tableData.forEach((row, index) => {
            this.handleSave(row,index);
          });
        } else {
          this.$modal.msgWarning("明細データは必須です。");
          return
        }


        if (formValid) {
            this.tableData.forEach((row, index) => {
              this.handleSave(row,index);
            });

            this.$refs.tableForm.validate((tableValid) => {
              if (tableValid) {
                this.form.busTravelDetailList = this.tableFormData.tableData;
                this.$emit("callback", this.form);
                this.formCopy =  _.cloneDeep(this.form);
                this.visible = false;
              }
            });
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
    open(vo) {
      const form2 = _.omit(this.formCopy, ['fareA', 'fareC','operation']);
      if (vo.operation === "add") {
        this.roleDisabled(vo.roleList);
        if(!vo.travelFeeForm && Object.keys(form2).length === 0){
          this.form = {
            days: "0",
            innDays: "0",
            carDays: "0",
            amounts: "0",
            innAmounts: "0",
            carAmounts: "0",
            fare: 0,
            dailyAllowance: 0,
            lodging: 0,
            others: "0",
            fareA: 0,
            fareB: "0",
            fareC: 0,
            fareNum: 0,
            dailyAllowanceNum: 0,
            lodgingNum: 0,
            othersNum: 0,
            fareANum: 0,
            fareBNum: 0,
            fareCNum: 0,
            businessTrip2: "",
            location2: "",
            requirements2: "",
            businessTrip3: "",
            location3: "",
            requirements3: "",
          };
          this.tableFormData= {
            tableData: [],
            sums4: 0,
            sums5: 0,
            sums6: 0,
            startTime: "",
            endTime: "",
          };
        }
      } else if (vo.operation === "edit") {
        this.roleDisabled(vo.roleList);
        this.getInfoFlag = vo.getInfoFlag;
        if ((vo.getInfoFlag && vo.isBusTravelFee==='1')) {
          this.getInfo(vo.instructionNo);
        }
      } else if (vo.operation === "detail") {
        this.getInfo(vo.instructionNo);
        this.detailDisabled = true;
      }

      this.form = {
        ...this.form,
        operation: vo.operation,
        belonging: this.form.belonging ? this.form.belonging : vo.belonging,
        loginName: this.form.loginName ? this.form.loginName : vo.loginName,
        businessTrip: this.form.businessTrip
          ? this.form.businessTrip
          : vo.businessTrip,
        location: this.form.location ? this.form.location : vo.location,
        requirements: this.form.requirements
          ? this.form.requirements
          : vo.requirements,
        businessTrip2: this.form.businessTrip2
          ? this.form.businessTrip2
          : vo.businessTrip2,
        location2: this.form.location2 ? this.form.location2 : vo.location2,
        requirements2: this.form.requirements2
          ? this.form.requirements2
          : vo.requirements2,
        businessTrip3: this.form.businessTrip3
          ? this.form.businessTrip3
          : vo.businessTrip3,
        location3: this.form.location3 ? this.form.location3 : vo.location3,
        requirements3: this.form.requirements3
          ? this.form.requirements3
          : vo.requirements3,
          instructionNo: vo.instructionNo,
      };

      if(vo.operation === "add" && Object.keys(form2).length === 0){
        this.formCopy =  _.cloneDeep(this.form);
      }

      this.visible = true;
    },
    // handleEdit(scope) {
    //   if(this.detailDisabled){
    //     return;
    //   }
    //   if (Object.keys(this.rowHandle).length > 0) {
    //     this.$modal.msgWarning("先に明細データを保存してください");
    //     return;
    //   }
    //   const { row } = scope;
    //   this.originalData[row.id] = { ...row };
    //   row.edit = true;
    //   // this.tableData.forEach((item) => {
    //   //   if (item.id !== row.id) item.edit = false;
    //   // });
    //   this.rowHandle = scope;
    // },

    handleSave(row,index) {
      // const { row, $index } = scope;
      const fields = [
        `tableData[${index}].travelDetailDate`,
        `tableData[${index}].startTime`,
        `tableData[${index}].endTime`,
        `tableData[${index}].stationName`,
        `tableData[${index}].fare`,
        `tableData[${index}].tramAndBoat`,
        `tableData[${index}].express`,
        `tableData[${index}].instructions`,
        `tableData[${index}].level`,
      ];

      // this.tableFormData.startTime = row.startTime;
      // this.tableFormData.endTime = row.endTime;

      let isValid = true;

      const validatePromises = fields.map((field) => {
        return new Promise((resolve) => {
          this.$refs.tableForm.validateField(field, (error) => {
            if (error) {
              isValid = false;
            }
            resolve();
          });
        });
      });

      Promise.all(validatePromises).then(() => {
        if (!isValid) {
          return;
        }

        // if (row.startTime && row.endTime) {
        //   row.time = `${row.startTime}-${row.endTime}`;
        // }

        // row.edit = false;
        delete this.originalData[row.id];
        this.rowHandle = {};
      });

      // this.tableFormData.startTime = "";
      // this.tableFormData.endTime = "";
    },

    handleAddRow() {
      // if (Object.keys(this.rowHandle).length !== 0) {
      //   this.$modal.msgWarning("先に明細データを保存してください");
      //   return;
      // }
      const newRow = {
        id: this.nextId++,
        travelDetailDate: "",
        startTime: "",
        endTime: "",
        time: "",
        stationName: "",
        level: "",
        tramAndBoat: "0",
        express: "0",
        fare: "0",
        instructions: "",
        edit: true,
      };
      this.tableData.push(newRow);
      this.originalData[newRow.id] = { ...newRow };
      // this.tableData.forEach((item) => {
      //   if (item.id !== newRow.id) item.edit = false;
      // });

      this.rowHandle = newRow;
    },

    // 删除行
    handleDelete(id) {
      let that = this;
      that.$modal.confirm("データを削除してもよろしいですか？").then(function () {
          that.tableData = that.tableData.filter((item) => item.id !== id);
          delete that.originalData[id];
          that.rowHandle = {};
      }).catch(() => {
      });
    },
    getTableSummary({ columns, data }) {
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "小計";
        } else if (index === 7) {
          sums[index] = "計";
        } else if (index === 8) {
          sums[index] = this.formatThousands(this.tableFormData.sums4 + this.tableFormData.sums5 + this.tableFormData.sums6);
          this.form.fareNum = this.tableFormData.sums4 + this.tableFormData.sums5 + this.tableFormData.sums6;
          this.form.fare = sums[index];
        } else if (["tramAndBoat", "express", "fare"].includes(column.property)) {
          const values = data.map((item) => Number(item[column.property]) || 0);
          sums[index] = this.formatThousands(values.reduce((prev, curr) => prev + curr, 0));
          if (index === 4) {
            this.tableFormData.sums4 = values.reduce((prev, curr) => prev + curr, 0);
          } else if (index === 5) {
            this.tableFormData.sums5 = values.reduce((prev, curr) => prev + curr, 0);
          } else if (index === 6) {
            this.tableFormData.sums6 = values.reduce((prev, curr) => prev + curr, 0);
          }
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
      if (formName === "form" && this.$refs.tableForm) {
        this.$refs.tableForm.resetFields();
      }
      this.tableData = [];
      this.originalData = {};
      this.nextId = 11;
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
      } else if (value === "approveAffairs") {
        if (this.form.approveAffairs && this.form.affairsApproveDate) {
          this.form.approveAffairs = null;
          this.form.affairsApproveDate = null;
        } else {
          this.form.approveAffairs = nickName;
          this.form.affairsApproveDate = date;
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
      }
      this.$forceUpdate();
    },
    formatToYmd() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}/${month}/${day}`;
    },
  },
};
</script>

<style scoped>
.expense-report-container {
  font-family: Arial, sans-serif;
  padding: 1rem;
  display: flex;
  gap: 10rem;
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
  line-height: 1.5;
}

.fee-name {
  width: 10%;
  white-space: nowrap;
}
.fee-amount {
  width: 20%;
  text-align: right !important;
  padding-right: 20px !important;
  height: 40px;
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

/* .cell-text:hover {
  text-decoration: underline;
} */

.multi-line {
  white-space: pre-line;
  line-height: 1.4;
}

.el-table__summary td {
  font-weight: bold;
  text-align: center !important;
}

.el-table-required {
  color: #f56c6c;
  margin-left: 4px;
  font-weight: 700;
  margin-right: 6px;
}
</style>
