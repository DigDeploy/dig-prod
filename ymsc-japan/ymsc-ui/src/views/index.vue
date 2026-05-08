<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <div class="header-section">
      <div class="top-cards">
        <!-- 日報卡片 -->
        <el-card class="card-item daily-report-card" style="height: 175px">
          <div class="daily-report-content">
            <div class="daily-header">
              <div class="logo-image">
               <img src="@/assets/logo/homeLogo.png" alt="株式会社 第一技研" class="company-logo-img"/>
              </div>
              <div class="daily-title">日報</div>
            </div>
            <div class="card-content">
              <div class="stat-circle warning">
                <span class="circle-label">未入力</span>
                <span class="circle-count">{{ counts.dailyReport }}<span class="unit">件</span></span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 案件情報卡片 -->
        <el-card class="card-item case-info-card" style="height: 175px">
          <div class="case-stats-container">
            <div class="stats-header">
              <div class="header-left">
                <i class="el-icon-suitcase card-icon"></i>
                <span class="card-title">案件情報</span>
              </div>
            </div>
            <div class="case-stats-grid">
              <div class="stat-item alert">
                <div class="stat-icon-wrapper">
                  <i class="el-icon-bell"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">アラート</div>
                  <div class="stat-value">
                    <span class="number">{{ counts.alert }}</span>
                    <span class="unit">件</span>
                  </div>
                </div>
                <div class="stat-trend up">
                  <i class="el-icon-top"></i>
                </div>
              </div>
              <div class="stat-item overdue">
                <div class="stat-icon-wrapper">
                  <i class="el-icon-time"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">期限超過</div>
                  <div class="stat-value">
                    <span class="number">{{ counts.overdue }}</span>
                    <span class="unit">件</span>
                  </div>
                </div>
                <div class="stat-trend down">
                  <i class="el-icon-bottom"></i>
                </div>
              </div>
              <div class="stat-item processing">
                <div class="stat-icon-wrapper">
                  <i class="el-icon-time"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">対応中</div>
                  <div class="stat-value">
                    <span class="number">{{ counts.inProgress }}</span>
                    <span class="unit">件</span>
                  </div>
                </div>
                <div class="stat-trend up">
                  <i class="el-icon-top"></i>
                </div>
              </div>
              <div class="stat-item completed">
                <div class="stat-icon-wrapper">
                  <i class="el-icon-success"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">受注済</div>
                  <div class="stat-value">
                    <span class="number">{{ counts.order }}</span>
                    <span class="unit">件</span>
                  </div>
                </div>
                <div class="stat-trend up">
                  <i class="el-icon-top"></i>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧导航 -->
      <el-card class="left-nav-card" shadow="never">
        <div class="nav-title">
          <i class="el-icon-menu"></i>
          対応リスト
        </div>
        <div class="nav-content">
          <div class="nav-group">
            <div class="group-title business">
              <i class="el-icon-office-building"></i>
              業務
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'newNotice' }" @click="switchTab('newNotice')">
              <span class="item-label">新着通知（案件）</span>
              <el-tag size="mini" type="primary" class="item-count">{{ counts.newNotice }}件</el-tag>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'instructionNotice' }" @click="switchTab('instructionNotice')">
              <span class="item-label">新着通知（命令書）</span>
              <el-tag size="mini" type="primary" class="item-count">{{ counts.instructionNotice }}件</el-tag>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'alert' }" @click="switchTab('alert')">
              <span class="item-label">アラート</span>
              <el-tag size="mini" type="danger" class="item-count">{{ counts.alert }}件</el-tag>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'dailyReport' }" @click="switchTab('dailyReport')">
              <span class="item-label">日報未入力</span>
              <el-tag size="mini" type="warning" class="item-count">{{ counts.dailyReport }}件</el-tag>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'favorite' }" @click="switchTab('favorite')">
              <span class="item-label">お気に入り</span>
              <el-tag size="mini" type="success" class="item-count">{{ counts.favorite }}件</el-tag>
            </div>
          </div>
          <div class="nav-group">
            <div class="group-title case">
              <i class="el-icon-folder"></i>
              案件
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'tempCase' }" @click="switchTab('tempCase')">
              <span class="item-label">仮登録</span>
              <span class="item-count">（{{ counts.tempCase }}）件</span>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'newCase' }" @click="switchTab('newCase')">
              <span class="item-label">新規</span>
              <span class="item-count">（{{ counts.newCase }}）件</span>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'inquiry' }" @click="switchTab('inquiry')">
              <span class="item-label">引合</span>
              <span class="item-count">（{{ counts.inquiry }}）件</span>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'sales' }" @click="switchTab('sales')">
              <span class="item-label">営業</span>
              <span class="item-count">（{{ counts.sales }}）件</span>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'proposal' }" @click="switchTab('proposal')">
              <span class="item-label">提案</span>
              <span class="item-count">（{{ counts.proposal }}）件</span>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'negotiation' }" @click="switchTab('negotiation')">
              <span class="item-label">商談</span>
              <span class="item-count">（{{ counts.negotiation }}）件</span>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'estimate' }" @click="switchTab('estimate')">
              <span class="item-label">見積</span>
              <span class="item-count">（{{ counts.estimate }}）件</span>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'approval' }" @click="switchTab('approval')">
              <span class="item-label">内示</span>
              <span class="item-count">（{{ counts.approval }}）件</span>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'order' }" @click="switchTab('order')">
              <span class="item-label">受注</span>
              <span class="item-count">（{{ counts.order }}）件</span>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'hold' }" @click="switchTab('hold')">
              <span class="item-label">保留</span>
              <span class="item-count">（{{ counts.hold }}）件</span>
            </div>
          </div>
          <div class="nav-group">
            <div class="group-title archive">
              <i class="el-icon-collection"></i>
              登録日（年別）一覧
            </div>
            <div
              class="nav-item archive-item"
              v-for="year in availableYears"
              :key="year"
              :class="{ active: (selectedYear === year && activeTab ==='yearlyCases')}"
              @click="selectYear(year)"
            >
              <i class="el-icon-date"></i>
              {{ year }}年度
            </div>
          </div>
        </div>
      </el-card>

      <!-- 右侧内容 -->
      <div class="right-content">
        <!-- 案件一覧表格 -->
        <el-card class="table-card" shadow="never" v-if="isCaseTab && activeTab !== 'instructionNotice'">
          <div slot="header" class="table-header">
            <span class="header-title">
              <i class="el-icon-s-order"></i>
              {{ currentTabTitle }}
            </span>
          </div>
          <el-table
            :data="caseList"
            border
            stripe
            size="small"
            class="case-table"
            highlight-current-row
            height="100%"
            @selection-change="handleSelectionChange"
            @sort-change="handleCaseSortChange"
            key="case-table"
          >
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-column label="No." type="index" width="55" :header-align="alignTableConfig.header"
                             :align="alignTableConfig.text"></el-table-column>
            <el-table-column prop="caseNo" label="案件番号" width="140" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <span @click="handleUpdate(scope.row)" style="cursor: pointer; color: #409EFF;">{{ scope.row.caseNo }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="customerName" label="得意先名" width="180" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip sortable/>
            <el-table-column prop="businessContent" label="案件概要" min-width="230" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip/>
            <el-table-column prop="responsiblePersonName" label="発行者" width="110" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip sortable/>
            <el-table-column prop="status" label="ステータス" width="130" :align="alignTableConfig.tag" sortable>
              <template slot-scope="scope">
                <dict-tag :options="dict.type.negotiation_status" :value="scope.row.status"/>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">
                  編集
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <div class="header-actions">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-star-on"
                @click="addToFavorite"
                :disabled="selectedCases.length === 0"
                v-if="activeTab !== 'favorite'"
              >
                お気に入り登録
              </el-button>
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click="removeFromFavorite"
                :disabled="selectedCases.length === 0"
                v-if="activeTab === 'favorite'"
              >
                お気に入り削除
              </el-button>
              <el-button size="small" icon="el-icon-refresh" type="primary" @click="refreshAllData()">更新</el-button>
            </div>
          </div>
        </el-card>

        <!-- 命令書新着通知表格 -->
        <el-card class="table-card" shadow="never" v-if="activeTab === 'instructionNotice'">
          <div slot="header" class="table-header">
            <span class="header-title">
              <i class="el-icon-document"></i>
              {{ currentTabTitle }}
            </span>
          </div>
          <el-table
            :data="instructionNoticeList"
            border
            stripe
            size="small"
            class="case-table"
            highlight-current-row
            height="100%"
            @sort-change="handleInstructionNoticeSortChange"
            key="instruction-notice-table"
          >
            <el-table-column label="No." width="50" align="center" type="index"/>
            <el-table-column prop="negotiationNo" label="案件番号" width="140" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.negotiationNo }}-{{ scope.row.subNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="instructionNo" label="出張命令書番号" width="180" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <span @click="handleInstructionNoticeUpdate(scope.row)" style="cursor: pointer; color: #409EFF;">{{ scope.row.instructionNo }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="loginName" label="出張者" width="120" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip sortable/>
            <el-table-column prop="businessTrip" label="出張先１" min-width="150" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip/>
            <el-table-column prop="requirements" label="要件１" min-width="200" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip/>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleInstructionNoticeUpdate(scope.row)">
                  編集
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <div class="header-actions">
              <el-button size="small" icon="el-icon-refresh" type="primary" @click="refreshAllData()">更新</el-button>
            </div>
          </div>
        </el-card>

        <!-- アラート一覧 -->
        <el-card class="table-card" shadow="never" v-else-if="activeTab === 'alert'">
          <div slot="header" class="table-header">
            <span class="header-title">
              <i class="el-icon-bell"></i>
              アラート一覧
            </span>
          </div>
          <el-table
            :data="alertList"
            border
            stripe
            size="small"
            class="case-table"
            highlight-current-row
            height="100%"
            @sort-change="handleAlertSortChange"
            key="alert-table"
          >
            <el-table-column label="No." width="50" align="center" type="index"/>
            <el-table-column prop="createTime" label="日付" width="100" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip sortable/>
            <el-table-column prop="correlation" label="案件番号" width="140" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <span @click="handleAlert(scope.row)" style="cursor: pointer; color: #409EFF;">{{ scope.row.correlation.split('|').slice(0, 2).join('-') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="alertType" label="種別" width="160" :header-align="alignTableConfig.header" :align="alignTableConfig.tag" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <dict-tag :options="dict.type.alert_type" :value="scope.row.alertType"/>
              </template>
            </el-table-column>
            <el-table-column prop="alertContent" label="内容" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip/>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="confirmAlert(scope.row)">
                  確認
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 日報未入力一覧 -->
        <el-card class="table-card" shadow="never" v-else-if="activeTab === 'dailyReport'">
          <div slot="header" class="table-header">
            <span class="header-title">
              <i class="el-icon-document"></i>
              日報未入力一覧
            </span>
          </div>
          <el-table
            :data="dailyReportList"
            border
            stripe
            size="small"
            class="case-table"
            highlight-current-row
            height="100%"
            @sort-change="handleDailySortChange"
            key="daily-table"
          >
            <el-table-column label="No." width="50" align="center" type="index"/>
            <el-table-column prop="reportDate" label="日付" width="120" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip sortable/>
            <el-table-column prop="resolveUserName" label="担当者" width="160" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip sortable/>
            <el-table-column prop="content" label="作業区分" width="140" :header-align="alignTableConfig.header" :align="alignTableConfig.teext" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <dict-tag :options="dict.type.work_type" :value="scope.row.content"/>
              </template>
            </el-table-column>
            <el-table-column prop="contentDetail" label="作業内容" :header-align="alignTableConfig.header" :align="alignTableConfig.txt" show-overflow-tooltip/>
            <el-table-column prop="joushiFeedback" label="上司フィードバック" width="170" :header-align="alignTableConfig.header" :align="alignTableConfig.text" show-overflow-tooltip/>
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="loginDailyReport(scope.row)">
                  {{ scope.row.filled ? 'フィードバック' : '日報登録' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 掲示板 -->
        <el-card class="notice-card" shadow="never">
          <div slot="header" class="notice-header">
            <span class="header-title">
              <i class="el-icon-message-solid"></i>
              掲示板（会社からの連絡）
            </span>
          </div>
          <div class="notice-list" ref="noticeList" @mouseenter="pauseScroll" @mouseleave="startScroll">
            <div
              class="notice-item"
              v-for="(item, index) in displayNoticeList"
              :key="index"
            >
              <div class="notice-content">
                <div class="notice-meta">
                  <span class="notice-date">{{ parseTime(item.createTime, '{y}/{m}/{d}') }}</span>
                  <span class="notice-type">{{ getNoticeType(item.noticeType) }}</span>
                  <el-tag size="mini" :type="getNoticeTagType(item.noticeType)" class="notice-sender">
                    {{ item.noticeTitle }}
                  </el-tag>
                </div>
                <div class="notice-text">{{ item.noticeContent }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 日報登録/編集ダイアログ -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="148px">
        <el-row :gutter="10">
          <el-col :span="24">
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
                                    }">
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
                                    }">
              </el-time-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="担当者" prop="resolveUser">
              <el-input v-model="form.resolveUserName" disabled></el-input>
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
              <el-input v-model="form.contentDetail" type="textarea"
                        placeholder="" maxlength="500" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button @click="cancel">キャンセル</el-button>
      </div>
    </el-dialog>

    <!-- フィードバックダイアログ -->
    <el-dialog title="日報フィードバック" :visible.sync="reactionOpen" width="900px" append-to-body>
      <el-form ref="form" :model="form" label-width="138px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上司フィードバック" prop="joushiFeedback">
              <el-input v-model="form.joushiFeedback" type="textarea"
                        placeholder="" maxlength="200" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
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
        <el-button type="primary" @click="submitFeedback">確定</el-button>
        <el-button @click="reactionOpen = false">キャンセル</el-button>
      </div>
    </el-dialog>

    <Negotiations ref="negotiations" @callback="handleNegotiationsCallback"/>
  </div>
</template>

<script>
import {
  newNotice,
  delNewNotice,
  alertList,
  dailyReportList,
  favoriteList,
  negotiationsList,
  listNotice,
  getHomeCounts,
  instructionNoticeList,
  delInstructionNotice
} from "@/api/business/home";
import {updateAlert, delAlert} from "@/api/business/alert";
import {addFavoriteBatch, delFavorite} from "@/api/business/favorite";
import {addReport, updateReport} from "@/api/business/report";
import {getNegotiationAndActivityList} from "@/api/business/negotiations";
import Negotiations from "@/components/Negotiations/radioIndex";

export default {
  name: "Index",
  components: {
    Negotiations,
  },
  dicts: ['negotiation_type', 'negotiation_status', 'alert_type', 'work_type', 'sys_notice_type', 'sys_notice_icon'],
  data() {
    return {
      activeTab: 'newNotice',
      selectedCases: [],
      caseList: [],
      alertList: [],
      dailyReportList: [],
      instructionNoticeList: [],
      noticeList: [],
      displayNoticeList: [],
      scrollAnimationId: null,
      lastScrollTime: 0,
      scrollSpeed: 75,
      isPaused: false,
      selectedYear: null,
      currentYear: new Date().getFullYear(),
      tabTitles: {
        newNotice: '新着通知・案件一覧',
        instructionNotice: '新着通知・命令書一覧',
        favorite: 'お気に入り・案件一覧',
        newCase: '新規・案件一覧',
        tempCase: '仮登録・案件一覧',
        inquiry: '引合・案件一覧',
        sales: '営業・案件一覧',
        proposal: '提案・案件一覧',
        negotiation: '商談・案件一覧',
        estimate: '見積・案件一覧',
        approval: '内示・案件一覧',
        order: '受注・案件一覧',
        hold: '保留・案件一覧',
      },
      user: this.$store.getters.userId,
      open: false,
      reactionOpen: false,
      form: {},
      selectedReactions: [],
      subNumberList: [],
      activityList: [],
      title:'',
      reactions: [
        { value: 'ok', label: 'OK', emoji: '✅', color: '#67C23A' },
        { value: 'good', label: 'Good', emoji: '⭐', color: '#E6A23C' },
        { value: 'ng', label: 'NG', emoji: '❌', color: '#F56C6C' },
        { value: 'thanks', label: 'ありがとう', emoji: '🙏', color: '#909399' },
        { value: 'read', label: '既読', emoji: '👁️', color: '#409EFF' },
        { value: 'sorry', label: 'すみません', emoji: '😔', color: '#F7BA1E' }
      ],
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
        joushiFeedback: [
          {max: 200, message: "は200文字以内で入力してください", trigger: "blur",},
        ]
      },
      counts: {
        newNotice: 0,
        instructionNotice: 0,
        alert: 0,
        dailyReport: 0,
        favorite: 0,
        newCase: 0,
        tempCase: 0,
        inquiry: 0,
        sales: 0,
        proposal: 0,
        negotiation: 0,
        estimate: 0,
        approval: 0,
        order: 0,
        hold: 0,
        inProgress: 0,
        overdue: 0
      },
      headerCellStyle: {
        background: '#f5f7fa',
        color: '#606266',
        fontSize: '12px'
      }
    };
  },
  computed: {
    isCaseTab() {
      return ['newNotice', 'instructionNotice', 'favorite', 'newCase', 'tempCase', 'inquiry', 'sales', 'proposal', 'negotiation', 'estimate', 'approval', 'order', 'hold', 'yearlyCases'].includes(this.activeTab);
    },
    currentTabTitle() {
      if (this.activeTab === 'yearlyCases') {
        return `${this.selectedYear}年度 案件一覧`;
      }
      return this.tabTitles[this.activeTab] || '案件一覧';
    },
    availableYears() {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let year = currentYear; year >= 2026; year--) {
        years.push(year);
      }
      return years;
    }
  },
  watch: {
    '$route.query': {
      handler(newQuery, oldQuery) {
        const tabChanged = newQuery.tab !== oldQuery?.tab;
        const yearChanged = newQuery.year !== oldQuery?.year;
        
        if (tabChanged) {
          this.activeTab = newQuery.tab || 'newNotice';
        }
        if (yearChanged && newQuery.year) {
          this.selectedYear = parseInt(newQuery.year);
        }
        
        if (tabChanged || yearChanged) {
          this.$nextTick(() => {
            this.listTableData();
          });
        }
      },
      deep: true
    }
  },
  created() {
    if (this.$route.query.tab) {
      this.activeTab = this.$route.query.tab;
    }
    if (this.$route.query.year) {
      this.selectedYear = parseInt(this.$route.query.year);
    }
    this.init();
  },
  methods: {
    refreshAllData() {
      this.init();
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
    cancel() {
        this.open = false;
        this.reactionOpen = false;
        this.reset();
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
    getHomeCounts() {
      this.$modal.loading();
      getHomeCounts(this.user, null).then(response => {
        const data = response.data;
        this.counts = {
          newNotice: data.newNoticeCount || 0,
          instructionNotice: data.instructionNoticeCount || 0,
          alert: data.alertCount || 0,
          dailyReport: data.dailyReportCount || 0,
          favorite: data.favoriteCount || 0,
          newCase: data.newCaseCount || 0,
          tempCase: data.tempCaseCount || 0,
          inquiry: data.inquiryCount || 0,
          sales: data.salesCount || 0,
          proposal: data.proposalCount || 0,
          negotiation: data.negotiationCount || 0,
          estimate: data.estimateCount || 0,
          approval: data.approvalCount || 0,
          order: data.orderCount || 0,
          hold: data.holdCount || 0,
          inProgress: data.inProgressCount || 0,
          overdue: data.overdueCount || 0
        };
        this.$modal.closeLoading();
      });
    },
    async selectYear(year) {
      this.selectedYear = year;
      this.activeTab = 'yearlyCases';
      this.$modal.loading();
      negotiationsList({
          loginUser: this.user,
          kariFlg: '2',
          createBy: this.user,
          year: this.selectedYear
      }).then(data => {
          this.caseList = data;
          this.$modal.closeLoading()
      }).catch((err) => this.$modal.closeLoading())
    },
    async init() {
        await this.listTableData();
        await this.listNotice();
        await this.getHomeCounts();
    },
    listNotice() {
      let vo = {status: '0'};
      listNotice(vo).then(data => {
        this.noticeList = data;
        this.displayNoticeList = [...data];
        this.$nextTick(() => {
          this.startScroll();
        });
      }).catch((err) => console.log(err))
        .finally(() => this.$modal.closeLoading());
    },
    startScroll() {
        this.stopScroll();
        const noticeListEl = this.$refs.noticeList;
        if (!noticeListEl || this.displayNoticeList.length === 0) return;

        noticeListEl.style.overflow = 'auto';
        const actualScrollHeight = noticeListEl.scrollHeight;
        noticeListEl.style.overflow = 'hidden';


        const scrollStep = (timestamp) => {
            if (this.isPaused) {
                this.scrollAnimationId = requestAnimationFrame(scrollStep);
                return;
            }

            if (!this.lastScrollTime || timestamp - this.lastScrollTime >= this.scrollSpeed) {
                noticeListEl.scrollTop += 1;
                this.lastScrollTime = timestamp;

                if (noticeListEl.scrollTop >= actualScrollHeight / 2) {
                    noticeListEl.scrollTop = 0;
                }
            }

            this.scrollAnimationId = requestAnimationFrame(scrollStep);
        };

        setTimeout(() => {
            this.scrollAnimationId = requestAnimationFrame(scrollStep);
        }, 100);
    },

    pauseScroll() {
        this.isPaused = true;
    },

    stopScroll() {
        if (this.scrollAnimationId) {
            cancelAnimationFrame(this.scrollAnimationId);
            this.scrollAnimationId = null;
        }
        this.lastScrollTime = 0;
    },

    beforeDestroy() {
        this.stopScroll();
    },
    listTableData() {
      this.$modal.loading();
      if (this.isCaseTab) {
        switch (this.activeTab) {
          case 'yearlyCases':
            negotiationsList({
              loginUser: this.user,
              kariFlg: '2',
              createBy: this.user,
              year: this.selectedYear
            }).then(data => {
              this.caseList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
          case 'newCase':
            negotiationsList({
              loginUser: this.user,
              kariFlg: '0',
              status: null,
            }).then(data => {
              this.caseList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
          case 'tempCase':
            negotiationsList({
              loginUser: this.user,
              kariFlg: '1',
              createBy: this.user,
            }).then(data => {
              this.caseList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
          case 'newNotice':
            newNotice({
              noticeUser: this.user,
            }).then(data => {
              this.caseList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
          case 'instructionNotice':
            instructionNoticeList({
              noticeUser: this.user,
            }).then(data => {
              this.instructionNoticeList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
          case 'favorite':
            favoriteList({
              user: this.user,
            }).then(data => {
              this.caseList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
          case 'inquiry':
            negotiationsList({
              loginUser: this.user,
              kariFlg: '0',
              status: '01',
            }).then(data => {
              this.caseList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
          case 'sales':
            negotiationsList({
              loginUser: this.user,
              kariFlg: '0',
              status: '02',
            }).then(data => {
              this.caseList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
          case 'proposal':
            negotiationsList({
              loginUser: this.user,
              kariFlg: '0',
              status: '03',
            }).then(data => {
              this.caseList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
          case 'negotiation':
            negotiationsList({
              loginUser: this.user,
              kariFlg: '0',
              status: '04',
            }).then(data => {
              this.caseList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
          case 'estimate':
            negotiationsList({
              loginUser: this.user,
              kariFlg: '0',
              status: '05',
            }).then(data => {
              this.caseList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
          case 'approval':
            negotiationsList({
              loginUser: this.user,
              kariFlg: '0',
              status: '06',
            }).then(data => {
              this.caseList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
          case 'order':
            negotiationsList({
              loginUser: this.user,
              kariFlg: '0',
              status: '07',
            }).then(data => {
              this.caseList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
          case 'hold':
            negotiationsList({
              loginUser: this.user,
              kariFlg: '0',
              status: '08',
            }).then(data => {
              this.caseList = data;
            }).catch((err) => console.log(err))
              .finally(() => this.$modal.closeLoading());
            break;
        }
      } else if (this.activeTab === 'alert') {
        alertList({alertUser: this.user}).then(data => {
          this.alertList = data;
        }).catch((err) => console.log(err))
          .finally(() => this.$modal.closeLoading());
      } else if (this.activeTab === 'dailyReport') {
        dailyReportList({userId: this.user}).then(data => {
          this.dailyReportList = data;
        }).catch((err) => console.log(err))
          .finally(() => this.$modal.closeLoading());
      }
    },
    switchTab(tabName) {
      this.activeTab = tabName;
      this.selectedCases = [];
      this.init();
    },
    handleSelectionChange(val) {
      this.selectedCases = val;
    },
    addToFavorite() {
      if (this.selectedCases.length === 0) {
        this.$modal.msgWarning('案件を選択してください');
        return;
      }
      this.$modal.confirm('選択した案件をお気に入りに登録しますか？').then(() => {
        this.$modal.loading('お気に入りに登録中...');
        const favoriteList = this.selectedCases.map(item => ({
          negotiationNo: item.negotiationNo,
          subNumber: item.subNumber,
          user: this.user,
        }));
        addFavoriteBatch(favoriteList).then(() => {
          this.$modal.msgSuccess(`${this.selectedCases.length}件の案件をお気に入りに登録しました`);
          this.selectedCases = [];
          this.init();
        }).catch((err) => {
          console.log(err);
          this.$modal.msgError('お気に入り登録に失敗しました');
        }).finally(() => {
          this.$modal.closeLoading();
        });
      }).catch(() => {});
    },
    removeFromFavorite() {
      if (this.selectedCases.length === 0) {
        this.$modal.msgWarning('案件を選択してください');
        return;
      }
      this.$modal.confirm('選択した案件をお気に入りから削除しますか？').then(() => {
        this.$modal.loading('お気に入りから削除中...');
        const favoriteList = this.selectedCases.map(item => ({
          negotiationNo: item.negotiationNo,
          subNumber: item.subNumber,
          user: this.user,
        }));
        delFavorite(favoriteList).then(() => {
          this.$modal.msgSuccess(`${this.selectedCases.length}件の案件をお気に入りから削除しました`);
          this.selectedCases = [];
          this.init();
        }).catch((err) => {
          console.log(err);
          this.$modal.msgError('お気に入り削除に失敗しました');
        }).finally(() => {
          this.$modal.closeLoading();
        });
      }).catch(() => {});
    },
    handleDetail(row) {
      const router = "/newCase/negotiations/negotiationsDetail/index/" + row.negotiationNo + "/" + row.subNumber;
      this.$router.push(router);
    },
    handleUpdate(row) {
        if (this.activeTab === 'newNotice') {
            delNewNotice({
                noticeUser: this.user,
                negotiationNo: row.negotiationNo,
                subNumber: row.subNumber
            }).then(data => {
                let router = "/newCase/negotiations/negotiationsEdit/index/" + row.negotiationNo + "/" + row.subNumber + "/home?tab=" + this.activeTab;
                if (this.activeTab === 'yearlyCases' && this.selectedYear) {
                    router += "&year=" + this.selectedYear;
                }
                this.$router.push(router);
            }).catch((err) => console.log(err))
                .finally(() => this.$modal.closeLoading());
        } else {
            let router = "/newCase/negotiations/negotiationsEdit/index/" + row.negotiationNo + "/" + row.subNumber + "/home?tab=" + this.activeTab;
            if (this.activeTab === 'yearlyCases' && this.selectedYear) {
                router += "&year=" + this.selectedYear;
            }
            this.$router.push(router);
        }

    },
    handleInstructionNoticeUpdate(row) {
        delInstructionNotice({
            noticeUser: this.user,
            negotiationNo: row.negotiationNo,
            subNumber: row.subNumber,
            instructionNo: row.instructionNo
        }).then(data => {
            let router = "/instruction/instruction/instructionEdit/" + row.instructionNo + "?tab=" + this.activeTab;
            this.$router.push(router);
        }).catch((err) => console.log(err))
            .finally(() => this.$modal.closeLoading());
    },
    handleAlert(row) {
        let negotiationNo = row.correlation.split('|')[0];
        let subNumber = row.correlation.split('|')[1];
        let router = "/newCase/negotiations/negotiationsEdit/index/" + negotiationNo + "/" + subNumber + "/home?tab=" + this.activeTab;
        this.$router.push(router);
    },
    loginDailyReport(row) {
      this.selectedReactions = [];
      if (row.filled) {
        this.form = {
          dailyReportId: row.dailyReportId,
          resolveUser: row.resolveUser,
          resolveUserName: row.resolveUserName,
          reportDate: row.reportDate,
          content: row.content,
          contentDetail: row.contentDetail,
          joushiFeedback: row.joushiFeedback,
          reactions: row.reactions
        };
        this.selectedReactions = row.reactions ? row.reactions.split(",") : [];
        this.reactionOpen = true;
      } else {
        this.form = {
          date: row.reportDate,
          startTime: '09:00',
          endTime: '18:00',
          resolveUser: row.resolveUser,
          resolveUserName: row.resolveUserName,
          content: null,
          negotiationNo: null,
          subNumber: null,
          activityNo: null,
          contentDetail: null,
        };
        this.open = true;
        this.title = "日報情報登録";
      }
    },
    toggleReaction(value) {
      if (this.selectedReactions.includes(value)) {
        this.selectedReactions = this.selectedReactions.filter(v => v !== value);
      } else {
        this.selectedReactions.push(value);
      }
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addReport(this.form).then(response => {
            this.$modal.msgSuccess("登録しました。");
            this.open = false;
            this.init();
          });
        }
      });
    },
    submitFeedback() {
      this.form.reactions = this.selectedReactions.join(',');
      updateReport(this.form).then(response => {
        this.$modal.msgSuccess("フィードバックしました。");
        this.reactionOpen = false;
        this.init();
      });
    },
    handleCaseSortChange({prop, order}) {
      if (prop && order) {
        this.caseList.sort((a, b) => {
          const valA = a[prop] || '';
          const valB = b[prop] || '';
          if (valA < valB) return order === 'ascending' ? -1 : 1;
          if (valA > valB) return order === 'ascending' ? 1 : -1;
          return 0;
        });
      }
    },
    handleAlertSortChange({prop, order}) {
      if (prop && order) {
        this.alertList.sort((a, b) => {
          if (prop === 'time') {
            const dateA = new Date(a.time.replace(/\//g, '-'));
            const dateB = new Date(b.time.replace(/\//g, '-'));
            return order === 'ascending' ? dateA - dateB : dateB - dateA;
          } else if (prop === 'correlation') {
            const valA = a[prop] ? a[prop].split('|').slice(0, 2).join('-') : '';
            const valB = b[prop] ? b[prop].split('|').slice(0, 2).join('-') : '';
            if (valA < valB) return order === 'ascending' ? -1 : 1;
            if (valA > valB) return order === 'ascending' ? 1 : -1;
            return 0;
          } else {
            const valA = a[prop] || '';
            const valB = b[prop] || '';
            if (valA < valB) return order === 'ascending' ? -1 : 1;
            if (valA > valB) return order === 'ascending' ? 1 : -1;
            return 0;
          }
        });
      }
    },
    handleDailySortChange({prop, order}) {
      if (prop && order) {
        this.dailyReportList.sort((a, b) => {
          if (prop === 'reportDate') {
            const dateA = new Date(a.reportDate.replace(/\//g, '-'));
            const dateB = new Date(b.reportDate.replace(/\//g, '-'));
            return order === 'ascending' ? dateA - dateB : dateB - dateA;
          } else {
            const valA = a[prop] || '';
            const valB = b[prop] || '';
            if (valA < valB) return order === 'ascending' ? -1 : 1;
            if (valA > valB) return order === 'ascending' ? 1 : -1;
            return 0;
          }
        });
      }
    },
    handleInstructionNoticeSortChange({prop, order}) {
      if (prop && order) {
        this.instructionNoticeList.sort((a, b) => {
          const valA = a[prop] || '';
          const valB = b[prop] || '';
          if (valA < valB) return order === 'ascending' ? -1 : 1;
          if (valA > valB) return order === 'ascending' ? 1 : -1;
          return 0;
        });
      }
    },
    confirmAlert(row) {
     this.$modal.confirm('このアラートを確認済みにしますか？').then(() => {
        let vo = {
          alertId: row.alertId,
          status: '1'
        }
        delAlert(row.alertId).then(() => {
          this.init();
        });
      });
    },
    getNoticeType(sender) {
      return 'system';
    },
    getNoticeIcon(type) {
      let typeItem = this.dict.type.sys_notice_type.find(x => x.raw.dictValue === type);
      let iconItem = this.dict.type.sys_notice_icon.find(x => x.raw.dictLabel === typeItem.label);
      return iconItem.value;
    },
    getNoticeTagType(type) {
      let item = this.dict.type.sys_notice_type.find(x => x.raw.dictValue === type);
      return item.raw.listClass;
    },
    getNoticeType(type) {
      let item = this.dict.type.sys_notice_type.find(x => x.raw.dictValue === type);
      return item.raw.dictLabel;
    },
    handleNegotiationNoBlur() {
      const currentValue = this.form.negotiationNo;
      if (currentValue !== this.negotiationNoOld) {
          this.form.subNumber = "";
          this.form.activityNo = "";
          this.subNumberList = [];
          this.activityList = [];
          if (currentValue) {
              this.listSubNumber();
          }
          this.negotiationNoOld = currentValue;
      }
    },
    handleSubNumberChange(val) {
      this.form.activityNo = null;
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
    }
  },
};
</script>

<style scoped lang="scss">

::v-deep {
  // Smooth scrolling
  html {
    scroll-behavior: smooth;
  }

  // Custom scrollbar - Educational style
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #e8eef3;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #1e3a5f;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover {
      background: #0d7377;
    }
  }

  /*// Focus visible for keyboard navigation*/
  /**:focus-visible {*/
  /*  outline: 2px solid #1e3a5f;*/
  /*  outline-offset: 2px;*/
  /*}*/

  // Reduced motion support
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

.dashboard-container {
  padding: 16px;
  background-color: #f0f4f8;
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;

  @media (max-height: 768px) {
    padding: 12px;
  }
}

.header-section {
  margin-bottom: 6px;
  flex-shrink: 0;

  @media (max-height: 768px) {
    margin-bottom: 12px;
  }
}

.top-cards {
  display: flex;
  gap: 16px;

  @media (max-height: 768px) {
    gap: 12px;
  }
}

.card-item {
  border-radius: 4px;
  border: 1px solid #d0dae6;

  ::v-deep .el-card__body {
    padding: 20px;
  }

  ::v-deep {
    box-shadow: 0 1px 3px rgba(30, 58, 95, 0.08) !important;

    &:hover {
      box-shadow: 0 4px 12px rgba(30, 58, 95, 0.12) !important;
    }
  }
}

.daily-report-card {
  width: 320px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #e3f2fd 0%, #f5f7fa 50%, #e8f4f8 100%);
  border: 1px solid #bbdefb;
  position: relative;
  overflow: hidden;

  ::v-deep .el-card__body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .daily-report-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .daily-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 2px solid rgba(30, 58, 95, 0.1);
    width: 100%;

    .logo-image {
      flex: 1;
      display: flex;
      align-items: center;

      .company-logo-img {
        max-width: 100%;
        max-height: 45px;
        object-fit: contain;
      }
    }

    .daily-title {
      font-size: 20px;
      font-weight: 700;
      color: #1e3a5f;
      letter-spacing: 4px;
      padding-left: 12px;
      border-left: 2px solid rgba(30, 58, 95, 0.2);
      flex-shrink: 0;
    }
  }

  @media (max-height: 768px) {
    width: 280px;

    ::v-deep .el-card__body {
      padding: 12px;
    }

    .daily-header {
      margin-bottom: 12px;
      padding-bottom: 10px;
      gap: 8px;

      .logo-image {
        .company-logo-img {
          max-height: 36px;
        }
      }

      .daily-title {
        font-size: 16px;
        letter-spacing: 3px;
        padding-left: 8px;
      }
    }
  }
}

.case-info-card {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e3f2fd;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #1e3a5f 0%, #0d7377 50%, #1e3a5f 100%);
  }

  ::v-deep .el-card__body {
    padding: 0;
  }
}

.case-stats-container {
  padding: 16px 20px 16px 20px;

  @media (max-height: 768px) {
    padding: 12px 16px 12px 16px;
  }
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  @media (max-height: 768px) {
    margin-bottom: 10px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .card-icon {
      font-size: 24px;
      color: #1e3a5f;
    }

    .card-title {
      font-size: 18px;
      font-weight: 700;
      color: #1e3a5f;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
  }

  .year-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #1e3a5f 0%, #0d7377 100%);
    border-radius: 24px;
    font-size: 14px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    box-shadow: 0 4px 15px rgba(30, 58, 95, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: linear-gradient(135deg, #0d7377 0%, #1e3a5f 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(30, 58, 95, 0.4);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 10px rgba(30, 58, 95, 0.3);
    }

    i:first-child {
      font-size: 16px;
    }

    i:last-child {
      font-size: 12px;
      margin-left: 4px;
      transition: transform 0.3s ease;
    }

    &:hover i:last-child {
      transform: rotate(180deg);
    }
  }
}

.case-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 10px 20px;

  @media (max-height: 768px) {
    gap: 16px;
    padding: 8px 16px;
  }
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);
  border-radius: 12px;
  border: 1px solid #e8eef3;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(30, 58, 95, 0.06);
  cursor: default;
  transition: none;

  @media (max-height: 768px) {
    padding: 16px;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    border-radius: 12px 0 0 12pxs;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: radial-gradient(circle, rgba(30, 58, 95, 0.03) 0%, transparent 70%);
    pointer-events: none;
  }

  &.alert {
    &::before { background: linear-gradient(180deg, #ff5252 0%, #d32f2f 100%); }
    .stat-icon-wrapper {
      background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
      color: #d32f2f;
    }
    .stat-value .number {
      background: linear-gradient(135deg, #ff5252 0%, #d32f2f 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &.overdue {
    &::before { background: linear-gradient(180deg, #ff9800 0%, #f57c00 100%); }
    .stat-icon-wrapper {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      color: #f57c00;
    }
    .stat-value .number {
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &.processing {
    &::before { background: linear-gradient(180deg, #00bcd4 0%, #0097a7 100%); }
    .stat-icon-wrapper {
      background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
      color: #0097a7;
    }
    .stat-value .number {
      background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &.completed {
    &::before { background: linear-gradient(180deg, #4caf50 0%, #388e3c 100%); }
    .stat-icon-wrapper {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      color: #388e3c;
    }
    .stat-value .number {
      background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-right: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  @media (max-height: 768px) {
    width: 40px;
    height: 40px;
    font-size: 18px;
    margin-right: 12px;
  }
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 12px;
  color: #78909c;
  margin-bottom: 6px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 4px;

  .number {
    font-size: 26px;
    font-weight: 700;
    line-height: 1;
    background: linear-gradient(135deg, #1e3a5f 0%, #0d7377 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .unit {
    font-size: 13px;
    color: #90a4ae;
    font-weight: 500;
  }

  @media (max-height: 768px) {
    .number {
      font-size: 22px;
    }
  }
}

.stat-trend {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.04);
  font-weight: 600;

  &.up {
    color: #0d7377;
    background: rgba(13, 115, 119, 0.1);
  }

  &.down {
    color: #c62828;
    background: rgba(198, 40, 40, 0.1);
  }

  i {
    font-size: 12px;
    font-weight: bold;
  }

  @media (max-height: 768px) {
    top: 12px;
    right: 12px;
    padding: 3px 6px;
    font-size: 10px;

    i {
      font-size: 11px;
    }
  }
}

.card-content {
  display: flex;
  justify-content: center;
}

.stat-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 3px solid;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
  position: relative;
  overflow: hidden;

  &.warning {
    border-color: #ff9800;
    background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);

    .circle-label {
      color: #f57c00;
    }
    .circle-count {
      color: #e65100;
    }
  }

  .circle-label {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 6px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .circle-count {
    font-size: 32px;
    font-weight: 700;

    .unit {
      font-size: 14px;
      font-weight: 500;
      margin-left: 2px;
    }
  }

  @media (max-height: 768px) {
    width: 85px;
    height: 85px;

    .circle-label {
      font-size: 12px;
      margin-bottom: 4px;
    }

    .circle-count {
      font-size: 26px;

      .unit {
        font-size: 12px;
      }
    }
  }
}

.main-content {
  display: flex;
  gap: 16px;
  flex: 1;
  overflow: hidden;
  min-height: 0;

  @media (max-height: 768px) {
    gap: 12px;
  }
}

.left-nav-card {
  width: 320px;
  flex-shrink: 0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #d0dae6;
  background: #ffffff;

  ::v-deep .el-card__body {
    padding: 0;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

@media (max-height: 768px) {
    width: 280px;
  }
}

.nav-title {
  background: #1e3a5f;
  color: #ffffff;
  padding: 10px 14px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  flex-shrink: 0;

  i {
    font-size: 18px;
  }

  @media (max-height: 768px) {
    padding: 10px 12px;
    font-size: 14px;

    i {
      font-size: 16px;
    }
  }
}

.nav-content {
  padding: 10px 10px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (max-height: 768px) {
    padding: 8px 6px;
  }
}

.nav-group {
  margin-bottom: 12px;
  flex-shrink: 0;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-height: 768px) {
    margin-bottom: 8px;
  }
}

.group-title {
  font-size: 15px;
  font-weight: 700;
  padding: 8px 10px;
  margin-bottom: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.business {
    color: #1e3a5f;
    background: #e3f2fd;
    border-left: 3px solid #1e3a5f;
  }

  &.case {
    color: #0d7377;
    background: #e0f2f1;
    border-left: 3px solid #0d7377;
  }

  &.archive {
    color: #6a4c93;
    background: #f3e5f5;
    border-left: 3px solid #6a4c93;
  }

  i {
    font-size: 20px;
  }

  @media (max-height: 768px) {
    font-size: 12px;
    padding: 6px 8px;
    margin-bottom: 4px;

    i {
      font-size: 14px;
    }
  }
}

.nav-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  margin: 0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;

  &:hover {
    background: #f0f4f8;
    border-left-color: #1e3a5f;

    .item-label {
      color: #1e3a5f;
    }
  }

  &:active {
    background: #e3f2fd;
  }

  &.active {
    background: #e3f2fd;
    border-left-color: #1e3a5f;

    .item-label {
      color: #1e3a5f;
      font-weight: 600;
    }
  }

  .item-label {
    font-size: 14px;
    color: #37474f;
    transition: color 0.2s;
    font-weight: 500;
  }

  .item-count {
    font-size: 16px;
    font-weight: 700;
  }

  ::v-deep .el-tag.item-count {
    font-size: 16px !important;
    padding: 2px 8px !important;
    min-width: 32px !important;
    height: 24px !important;
    line-height: 20px !important;
  }

  &.archive-item {
    color: #37474f;
    font-size: 14px;
    font-weight: 500;

    i {
      color: #0d7377;
      margin-right: 6px;
      font-size: 12px;
    }

    &:hover {
      color: #0d7377;

      i {
        color: #1e3a5f;
      }
    }
  }

  @media (max-height: 768px) {
    padding: 3px 6px;
    margin: 0;

    .item-label {
      font-size: 14px;
    }

    .item-count {
      font-size: 16px;
    }

    &.archive-item {
      font-size: 16px;
    }
  }
}

// 右侧内容
.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  min-height: 0;

  @media (max-height: 768px) {
    gap: 8px;
  }
}

// 表格卡片
.table-card {
  border-radius: 4px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #d0dae6;
  background: #ffffff;
  min-height: 300px;

  ::v-deep .el-card__header {
    padding: 8px 20px;
    background: #1e3a5f;
    border-bottom: none;
    flex-shrink: 0;
  }

  ::v-deep .el-card__body {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
  }

  @media (max-height: 768px) {
    ::v-deep .el-card__header {
      padding: 12px 16px;
    }

    ::v-deep .el-card__body {
      padding: 12px;
    }
  }
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    i {
      font-size: 20px;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;

    .el-button {
      border-radius: 4px;
      padding: 8px 16px;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  @media (max-height: 768px) {
    .header-title {
      font-size: 15px;

      i {
        font-size: 18px;
      }
    }
  }
}

.case-table {
  border-radius: 4px;
  overflow: hidden;
  flex: 1;

  ::v-deep {
    .el-table__body-wrapper {
      overflow-y: auto !important;

      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #e8eef3;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #1e3a5f;
        border-radius: 4px;

        &:hover {
          background: #0d7377;
        }
      }
    }

    .el-table__header-wrapper {
      th {
        background: #f0f4f8;
        color: #1e3a5f;
        font-weight: 700;
        padding: 8px 0;
        height: 36px;
        font-size: 15px !important;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #1e3a5f;
      }
    }

    .el-table__fixed-header-wrapper {
      th {
        background: #f0f4f8;
        color: #1e3a5f;
        font-weight: 700;
        padding: 8px 0;
        height: 36px;
        font-size: 15px !important;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #1e3a5f;
      }
    }

    .el-table__row {
      transition: all 0.2s ease;

      td {
        padding: 8px 0;
        height: 40px;
        font-size: 15px !important;
        color: #37474f;
        border-bottom: 1px solid #e8eef3;
      }

      &:hover {
        background: #e3f2fd !important;
      }

      &:nth-child(even) {
        background: #fafbfc;
      }
    }
  }



  @media (max-height: 768px) {
    ::v-deep .el-table__header-wrapper {
      th {
        padding: 6px 0;
        height: 32px;
        font-size: 11px;
      }
    }

    ::v-deep .el-table__row {
      td {
        padding: 6px 0;
        height: 36px;
        font-size: 13px;
      }
    }
  }
}

.table-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #d0dae6;
  flex-shrink: 0;

  .tip-text {
    font-size: 13px;
    color: #546e7a;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;

    i {
      color: #0d7377;
      font-size: 14px;
    }
  }
}

// 掲示板卡片
.notice-card {
  border-radius: 4px;
  flex-shrink: 0;
  flex-basis: 180px;
  max-height: 180px;
  border: 1px solid #d0dae6;
  background: #ffffff;
  display: flex;
  flex-direction: column;

  ::v-deep .el-card__header {
    padding: 10px 16px;
    background: #0d7377;
    border-bottom: none;
    flex-shrink: 0;
  }

  ::v-deep .el-card__body {
    padding: 0;
    overflow: hidden;
    flex: 1;
  }

  @media (max-height: 768px) {
    flex-basis: 150px;
    max-height: 150px;

    ::v-deep .el-card__header {
      padding: 8px 12px;
    }
  }
}

.notice-header {
  .header-title {
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    i {
      font-size: 18px;
    }
  }

  @media (max-height: 768px) {
    .header-title {
      font-size: 14px;

      i {
        font-size: 16px;
      }
    }
  }
}

.notice-list {
  padding: 0;
  height: 100%;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #e8eef3;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #1e3a5f;
    border-radius: 3px;

    &:hover {
      background: #0d7377;
    }
  }
}
.notice-list {
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

.notice-item {
  display: flex;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid #e8eef3;
  transition: all 0.2s ease;
  flex-shrink: 0;

  @media (max-height: 768px) {
    gap: 10px;
    padding: 8px 12px;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f0f4f8;
  }

  &.important {
    .notice-icon {
      background: #ffebee;
      color: #c62828;
    }
  }

  &.normal {
    .notice-icon {
      background: #e3f2fd;
      color: #1e3a5f;
    }
  }

  &.system {
    .notice-icon {
      background: #fff3e0;
      color: #ef6c00;
    }
  }
}

.notice-icon {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  i {
    font-size: 16px;
  }

  @media (max-height: 768px) {
    width: 32px;
    height: 32px;

    i {
      font-size: 14px;
    }
  }
}

.notice-content {
  flex: 1;
  min-width: 0;
}

.notice-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.notice-date {
  font-size: 15px;
  color: #78909c;
  font-weight: 500;
  white-space: nowrap;
}

.notice-type {
  background-color: #fff8e6;
  border-color: #fff1cc solid 1px;
  color: #ffba00;
  font-size: 14px;
  font-weight: 600;
  padding: 0 3px;
  border-radius: 3px;
}

.notice-sender {
  font-size: 14px;
  font-weight: 600;
}

.notice-text {
  font-size: 15px;
  color: #37474f;
  line-height: 1.4;
  font-weight: 400;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-height: 768px) {
  .notice-meta {
    gap: 6px;
    margin-bottom: 2px;
  }

  .notice-date {
    font-size: 11px;
  }

  .notice-sender {
    font-size: 10px;
  }

  .notice-text {
    font-size: 12px;
    line-height: 1.3;
    -webkit-line-clamp: 1;
  }
}

// 响应式适配
@media (min-width: 1920px) {
  .dashboard-container {
    padding: 16px;
  }

  .left-nav-card {
    width: 260px;
  }

  .nav-item .item-label {
    font-size: 15px;
  }
}

@media (max-width: 1400px) {
  .case-stats-grid {
    gap: 8px;
  }

  .stat-item {
    padding: 8px;
  }
}

@media (max-width: 1200px) {
  .top-cards {
    flex-direction: column;
  }

  .daily-report-card {
    width: 100%;
  }

  .case-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-content {
    flex-direction: column;
  }

  .left-nav-card {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .case-stats-grid {
    grid-template-columns: 1fr;
  }

  .stats-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}

// 14寸笔记本高度适配
@media (max-height: 768px) {
  .dashboard-container {
    padding: 8px;
  }

  .header-section {
    margin-bottom: 8px;
  }

  .top-cards {
    gap: 8px;
  }

  .case-stats-container {
    padding: 10px;
  }

  .stats-header {
    margin-bottom: 8px;
  }

  .case-stats-grid {
    gap: 8px;
  }

  .stat-item {
    padding: 8px;
  }

  .main-content {
    gap: 8px;
  }

  .right-content {
    gap: 8px;
  }
}

// 更小屏幕高度适配
@media (max-height: 700px) {
  .notice-card {
    max-height: 120px;
  }

  .case-table ::v-deep .el-table__header-wrapper th,
  .case-table ::v-deep .el-table__row td {
    height: 28px;
    padding: 4px 0;
  }
}

// 对话框样式
.reaction-container {
  padding: 16px;
  background-color: #F5F7FA;
  border-radius: 8px;
}

.reaction-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: #C0C4CC;
  }

  &.active {
    border-color: #409EFF;
    background-color: #ECF5FF;
  }
}

.reaction-emoji {
  font-size: 24px;
  margin-bottom: 4px;
}

.reaction-label {
  font-size: 12px;
  color: #606266;
  text-align: center;
}
::v-deep .daily-report-content,
::v-deep .case-info-card {
  user-select: none !important;
  -webkit-user-select: none !important;
  pointer-events: none !important;
}
</style>
