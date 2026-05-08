<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="コンポーネントプロパティ" name="field" />
      <el-tab-pane label="フォームプロパティ" name="form" />
    </el-tabs>
    <div class="field-box">
      <a class="document-link" target="_blank" :href="documentLink" title="コンポーネントドキュメントを表示">
        <i class="el-icon-link" />
      </a>
      <el-scrollbar class="right-scrollbar">
        <!-- コンポーネントプロパティ -->
        <el-form v-show="currentTab==='field' && showField" size="small" label-width="90px">
          <el-form-item v-if="activeData.changeTag" label="コンポーネントタイプ">
            <el-select
              v-model="activeData.tagIcon"
              placeholder="コンポーネントタイプを選択してください"
              :style="{width: '100%'}"
              @change="tagChange"
            >
              <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.label"
                  :label="item.label"
                  :value="item.tagIcon"
                >
                  <svg-icon class="node-icon" :icon-class="item.tagIcon" />
                  <span> {{ item.label }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.vModel!==undefined" label="フィールド名">
            <el-input v-model="activeData.vModel" placeholder="フィールド名を入力してください（v-model）" />
          </el-form-item>
          <el-form-item v-if="activeData.componentName!==undefined" label="コンポーネント名">
            {{ activeData.componentName }}
          </el-form-item>
          <el-form-item v-if="activeData.label!==undefined" label="タイトル">
            <el-input v-model="activeData.label" placeholder="タイトルを入力してください" />
          </el-form-item>
          <el-form-item v-if="activeData.placeholder!==undefined" label="プレースホルダー">
            <el-input v-model="activeData.placeholder" placeholder="プレースホルダーを入力してください" />
          </el-form-item>
          <el-form-item v-if="activeData['start-placeholder']!==undefined" label="開始プレースホルダー">
            <el-input v-model="activeData['start-placeholder']" placeholder="プレースホルダーを入力してください" />
          </el-form-item>
          <el-form-item v-if="activeData['end-placeholder']!==undefined" label="終了プレースホルダー">
            <el-input v-model="activeData['end-placeholder']" placeholder="プレースホルダーを入力してください" />
          </el-form-item>
          <el-form-item v-if="activeData.span!==undefined" label="フォームグリッド">
            <el-slider v-model="activeData.span" :max="24" :min="1" :marks="{12:''}" @change="spanChange" />
          </el-form-item>
          <el-form-item v-if="activeData.layout==='rowFormItem'" label="グリッド間隔">
            <el-input-number v-model="activeData.gutter" :min="0" placeholder="グリッド間隔" />
          </el-form-item>
          <el-form-item v-if="activeData.layout==='rowFormItem'" label="レイアウトモード">
            <el-radio-group v-model="activeData.type">
              <el-radio-button label="default" />
              <el-radio-button label="flex" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.justify!==undefined&&activeData.type==='flex'" label="水平配置">
            <el-select v-model="activeData.justify" placeholder="水平配置を選択してください" :style="{width: '100%'}">
              <el-option
                v-for="(item, index) in justifyOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.align!==undefined&&activeData.type==='flex'" label="垂直配置">
            <el-radio-group v-model="activeData.align">
              <el-radio-button label="top" />
              <el-radio-button label="middle" />
              <el-radio-button label="bottom" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.labelWidth!==undefined" label="ラベル幅">
            <el-input v-model.number="activeData.labelWidth" type="number" placeholder="ラベル幅を入力してください" />
          </el-form-item>
          <el-form-item v-if="activeData.style&&activeData.style.width!==undefined" label="コンポーネント幅">
            <el-input v-model="activeData.style.width" placeholder="コンポーネント幅を入力してください" clearable />
          </el-form-item>
          <el-form-item v-if="activeData.vModel!==undefined" label="デフォルト値">
            <el-input
              :value="setDefaultValue(activeData.defaultValue)"
              placeholder="デフォルト値を入力してください"
              @input="onDefaultValueInput"
            />
          </el-form-item>
          <el-form-item v-if="activeData.tag==='el-checkbox-group'" label="最小選択数">
            <el-input-number
              :value="activeData.min"
              :min="0"
              placeholder="最小選択数"
              @input="$set(activeData, 'min', $event?$event:undefined)"
            />
          </el-form-item>
          <el-form-item v-if="activeData.tag==='el-checkbox-group'" label="最大選択数">
            <el-input-number
              :value="activeData.max"
              :min="0"
              placeholder="最大選択数"
              @input="$set(activeData, 'max', $event?$event:undefined)"
            />
          </el-form-item>
          <el-form-item v-if="activeData.prepend!==undefined" label="プレフィックス">
            <el-input v-model="activeData.prepend" placeholder="プレフィックスを入力してください" />
          </el-form-item>
          <el-form-item v-if="activeData.append!==undefined" label="サフィックス">
            <el-input v-model="activeData.append" placeholder="サフィックスを入力してください" />
          </el-form-item>
          <el-form-item v-if="activeData['prefix-icon']!==undefined" label="プレフィックスアイコン">
            <el-input v-model="activeData['prefix-icon']" placeholder="プレフィックスアイコン名を入力してください">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
                選択
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['suffix-icon'] !== undefined" label="サフィックスアイコン">
            <el-input v-model="activeData['suffix-icon']" placeholder="サフィックスアイコン名を入力してください">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
                選択
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" label="オプション区切り文字">
            <el-input v-model="activeData.separator" placeholder="オプション区切り文字を入力してください" />
          </el-form-item>
          <el-form-item v-if="activeData.autosize !== undefined" label="最小行数">
            <el-input-number v-model="activeData.autosize.minRows" :min="1" placeholder="最小行数" />
          </el-form-item>
          <el-form-item v-if="activeData.autosize !== undefined" label="最大行数">
            <el-input-number v-model="activeData.autosize.maxRows" :min="1" placeholder="最大行数" />
          </el-form-item>
          <el-form-item v-if="activeData.min !== undefined" label="最小値">
            <el-input-number v-model="activeData.min" placeholder="最小値" />
          </el-form-item>
          <el-form-item v-if="activeData.max !== undefined" label="最大値">
            <el-input-number v-model="activeData.max" placeholder="最大値" />
          </el-form-item>
          <el-form-item v-if="activeData.step !== undefined" label="ステップ">
            <el-input-number v-model="activeData.step" placeholder="ステップ" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-input-number'" label="精度">
            <el-input-number v-model="activeData.precision" :min="0" placeholder="精度" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-input-number'" label="ボタン位置">
            <el-radio-group v-model="activeData['controls-position']">
              <el-radio-button label="">
                デフォルト
              </el-radio-button>
              <el-radio-button label="right">
                右側
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.maxlength !== undefined" label="最大入力文字数">
            <el-input v-model="activeData.maxlength" placeholder="文字数を入力してください">
              <template slot="append">
                文字
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['active-text'] !== undefined" label="有効テキスト">
            <el-input v-model="activeData['active-text']" placeholder="有効テキストを入力してください" />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-text'] !== undefined" label="無効テキスト">
            <el-input v-model="activeData['inactive-text']" placeholder="無効テキストを入力してください" />
          </el-form-item>
          <el-form-item v-if="activeData['active-value'] !== undefined" label="有効値">
            <el-input
              :value="setDefaultValue(activeData['active-value'])"
              placeholder="有効値を入力してください"
              @input="onSwitchValueInput($event, 'active-value')"
            />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-value'] !== undefined" label="無効値">
            <el-input
              :value="setDefaultValue(activeData['inactive-value'])"
              placeholder="無効値を入力してください"
              @input="onSwitchValueInput($event, 'inactive-value')"
            />
          </el-form-item>
          <el-form-item
            v-if="activeData.type !== undefined && 'el-date-picker' === activeData.tag"
            label="日付タイプ"
          >
            <el-select
              v-model="activeData.type"
              placeholder="日付タイプを選択してください"
              :style="{ width: '100%' }"
              @change="dateTypeChange"
            >
              <el-option
                v-for="(item, index) in dateOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.name !== undefined" label="ファイルフィールド名">
            <el-input v-model="activeData.name" placeholder="アップロードファイルフィールド名を入力してください" />
          </el-form-item>
          <el-form-item v-if="activeData.accept !== undefined" label="ファイルタイプ">
            <el-select
              v-model="activeData.accept"
              placeholder="ファイルタイプを選択してください"
              :style="{ width: '100%' }"
              clearable
            >
              <el-option label="画像" value="image/*" />
              <el-option label="動画" value="video/*" />
              <el-option label="音声" value="audio/*" />
              <el-option label="excel" value=".xls,.xlsx" />
              <el-option label="word" value=".doc,.docx" />
              <el-option label="pdf" value=".pdf" />
              <el-option label="txt" value=".txt" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.fileSize !== undefined" label="ファイルサイズ">
            <el-input v-model.number="activeData.fileSize" placeholder="ファイルサイズを入力してください">
              <el-select slot="append" v-model="activeData.sizeUnit" :style="{ width: '66px' }">
                <el-option label="KB" value="KB" />
                <el-option label="MB" value="MB" />
                <el-option label="GB" value="GB" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.action !== undefined" label="アップロードURL">
            <el-input v-model="activeData.action" placeholder="アップロードURLを入力してください" clearable />
          </el-form-item>
          <el-form-item v-if="activeData['list-type'] !== undefined" label="リストタイプ">
            <el-radio-group v-model="activeData['list-type']" size="small">
              <el-radio-button label="text">
                text
              </el-radio-button>
              <el-radio-button label="picture">
                picture
              </el-radio-button>
              <el-radio-button label="picture-card">
                picture-card
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="activeData.buttonText !== undefined"
            v-show="'picture-card' !== activeData['list-type']"
            label="ボタンテキスト"
          >
            <el-input v-model="activeData.buttonText" placeholder="ボタンテキストを入力してください" />
          </el-form-item>
          <el-form-item v-if="activeData['range-separator'] !== undefined" label="範囲区切り文字">
            <el-input v-model="activeData['range-separator']" placeholder="区切り文字を入力してください" />
          </el-form-item>
          <el-form-item v-if="activeData['picker-options'] !== undefined" label="選択可能時間帯">
            <el-input
              v-model="activeData['picker-options'].selectableRange"
              placeholder="選択可能時間帯を入力してください"
            />
          </el-form-item>
          <el-form-item v-if="activeData.format !== undefined" label="日付フォーマット">
            <el-input
              :value="activeData.format"
              placeholder="日付フォーマットを入力してください"
              @input="setTimeValue($event)"
            />
          </el-form-item>
          <template v-if="['el-checkbox-group', 'el-radio-group', 'el-select'].indexOf(activeData.tag) > -1">
            <el-divider>オプション</el-divider>
            <draggable
              :list="activeData.options"
              :animation="340"
              group="selectItem"
              handle=".option-drag"
            >
              <div v-for="(item, index) in activeData.options" :key="index" class="select-item">
                <div class="select-line-icon option-drag">
                  <i class="el-icon-s-operation" />
                </div>
                <el-input v-model="item.label" placeholder="オプション名" size="small" />
                <el-input
                  placeholder="オプション値"
                  size="small"
                  :value="item.value"
                  @input="setOptionValue(item, $event)"
                />
                <div class="close-btn select-line-icon" @click="activeData.options.splice(index, 1)">
                  <i class="el-icon-remove-outline" />
                </div>
              </div>
            </draggable>
            <div style="margin-left: 20px;">
              <el-button
                style="padding-bottom: 0"
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="addSelectItem"
              >
                オプションを追加
              </el-button>
            </div>
            <el-divider />
          </template>

          <template v-if="['el-cascader'].indexOf(activeData.tag) > -1">
            <el-divider>オプション</el-divider>
            <el-form-item label="データタイプ">
              <el-radio-group v-model="activeData.dataType" size="small">
                <el-radio-button label="dynamic">
                  動的データ
                </el-radio-button>
                <el-radio-button label="static">
                  静的データ
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <template v-if="activeData.dataType === 'dynamic'">
              <el-form-item label="ラベルキー名">
                <el-input v-model="activeData.labelKey" placeholder="ラベルキー名を入力してください" />
              </el-form-item>
              <el-form-item label="値キー名">
                <el-input v-model="activeData.valueKey" placeholder="値キー名を入力してください" />
              </el-form-item>
              <el-form-item label="子要素キー名">
                <el-input v-model="activeData.childrenKey" placeholder="子要素キー名を入力してください" />
              </el-form-item>
            </template>

            <el-tree
              v-if="activeData.dataType === 'static'"
              draggable
              :data="activeData.options"
              node-key="id"
              :expand-on-click-node="false"
              :render-content="renderContent"
            />
            <div v-if="activeData.dataType === 'static'" style="margin-left: 20px">
              <el-button
                style="padding-bottom: 0"
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="addTreeItem"
              >
                親要素を追加
              </el-button>
            </div>
            <el-divider />
          </template>

          <el-form-item v-if="activeData.optionType !== undefined" label="オプションスタイル">
            <el-radio-group v-model="activeData.optionType">
              <el-radio-button label="default">
                デフォルト
              </el-radio-button>
              <el-radio-button label="button">
                ボタン
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData['active-color'] !== undefined" label="有効色">
            <el-color-picker v-model="activeData['active-color']" />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-color'] !== undefined" label="無効色">
            <el-color-picker v-model="activeData['inactive-color']" />
          </el-form-item>

          <el-form-item v-if="activeData['allow-half'] !== undefined" label="半選択許可">
            <el-switch v-model="activeData['allow-half']" />
          </el-form-item>
          <el-form-item v-if="activeData['show-text'] !== undefined" label="補助テキスト表示">
            <el-switch v-model="activeData['show-text']" @change="rateTextChange" />
          </el-form-item>
          <el-form-item v-if="activeData['show-score'] !== undefined" label="スコア表示">
            <el-switch v-model="activeData['show-score']" @change="rateScoreChange" />
          </el-form-item>
          <el-form-item v-if="activeData['show-stops'] !== undefined" label="区切り点表示">
            <el-switch v-model="activeData['show-stops']" />
          </el-form-item>
          <el-form-item v-if="activeData.range !== undefined" label="範囲選択">
            <el-switch v-model="activeData.range" @change="rangeChange" />
          </el-form-item>
          <el-form-item
            v-if="activeData.border !== undefined && activeData.optionType === 'default'"
            label="ボーダー表示"
          >
            <el-switch v-model="activeData.border" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-color-picker'" label="色フォーマット">
            <el-select
              v-model="activeData['color-format']"
              placeholder="色フォーマットを選択してください"
              :style="{ width: '100%' }"
              @change="colorFormatChange"
            >
              <el-option
                v-for="(item, index) in colorFormatOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeData.size !== undefined &&
              (activeData.optionType === 'button' ||
                activeData.border ||
                activeData.tag === 'el-color-picker')"
            label="オプションサイズ"
          >
            <el-radio-group v-model="activeData.size">
              <el-radio-button label="medium">
                ミディアム
              </el-radio-button>
              <el-radio-button label="small">
                スモール
              </el-radio-button>
              <el-radio-button label="mini">
                ミニ
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData['show-word-limit'] !== undefined" label="入力文字数表示">
            <el-switch v-model="activeData['show-word-limit']" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-input-number'" label="ステップ厳守">
            <el-switch v-model="activeData['step-strictly']" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" label="多選許可">
            <el-switch v-model="activeData.props.props.multiple" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" label="全パス表示">
            <el-switch v-model="activeData['show-all-levels']" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" label="検索許可">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item v-if="activeData.clearable !== undefined" label="クリア許可">
            <el-switch v-model="activeData.clearable" />
          </el-form-item>
          <el-form-item v-if="activeData.showTip !== undefined" label="ヒント表示">
            <el-switch v-model="activeData.showTip" />
          </el-form-item>
          <el-form-item v-if="activeData.multiple !== undefined" label="ファイル多選">
            <el-switch v-model="activeData.multiple" />
          </el-form-item>
          <el-form-item v-if="activeData['auto-upload'] !== undefined" label="自動アップロード">
            <el-switch v-model="activeData['auto-upload']" />
          </el-form-item>
          <el-form-item v-if="activeData.readonly !== undefined" label="読み取り専用">
            <el-switch v-model="activeData.readonly" />
          </el-form-item>
          <el-form-item v-if="activeData.disabled !== undefined" label="無効化">
            <el-switch v-model="activeData.disabled" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-select'" label="検索許可">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-select'" label="多選許可">
            <el-switch v-model="activeData.multiple" @change="multipleChange" />
          </el-form-item>
          <el-form-item v-if="activeData.required !== undefined" label="必須項目">
            <el-switch v-model="activeData.required" />
          </el-form-item>

          <template v-if="activeData.layoutTree">
            <el-divider>レイアウト構造ツリー</el-divider>
            <el-tree
              :data="[activeData]"
              :props="layoutTreeProps"
              node-key="renderKey"
              default-expand-all
              draggable
            >
              <span slot-scope="{ node, data }">
                <span class="node-label">
                  <svg-icon class="node-icon" :icon-class="data.tagIcon" />
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </template>

          <template v-if="activeData.layout === 'colFormItem' && activeData.tag !== 'el-button'">
            <el-divider>正規表現バリデーション</el-divider>
            <div
              v-for="(item, index) in activeData.regList"
              :key="index"
              class="reg-item"
            >
              <span class="close-btn" @click="activeData.regList.splice(index, 1)">
                <i class="el-icon-close" />
              </span>
              <el-form-item label="正規表現">
                <el-input v-model="item.pattern" placeholder="正規表現を入力してください" />
              </el-form-item>
              <el-form-item label="エラーメッセージ" style="margin-bottom:0">
                <el-input v-model="item.message" placeholder="エラーメッセージを入力してください" />
              </el-form-item>
            </div>
            <div style="margin-left: 20px">
              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">
                ルールを追加
              </el-button>
            </div>
          </template>
        </el-form>
        <!-- フォームプロパティ -->
        <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
          <el-form-item label="フォーム名">
            <el-input v-model="formConf.formRef" placeholder="フォーム名を入力してください（ref）" />
          </el-form-item>
          <el-form-item label="フォームモデル">
            <el-input v-model="formConf.formModel" placeholder="データモデルを入力してください" />
          </el-form-item>
          <el-form-item label="バリデーションモデル">
            <el-input v-model="formConf.formRules" placeholder="バリデーションモデルを入力してください" />
          </el-form-item>
          <el-form-item label="フォームサイズ">
            <el-radio-group v-model="formConf.size">
              <el-radio-button label="medium">
                ミディアム
              </el-radio-button>
              <el-radio-button label="small">
                スモール
              </el-radio-button>
              <el-radio-button label="mini">
                ミニ
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="ラベル配置">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left">
                左寄せ
              </el-radio-button>
              <el-radio-button label="right">
                右寄せ
              </el-radio-button>
              <el-radio-button label="top">
                上寄せ
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="ラベル幅">
            <el-input-number v-model="formConf.labelWidth" placeholder="ラベル幅" />
          </el-form-item>
          <el-form-item label="グリッド間隔">
            <el-input-number v-model="formConf.gutter" :min="0" placeholder="グリッド間隔" />
          </el-form-item>
          <el-form-item label="フォーム無効化">
            <el-switch v-model="formConf.disabled" />
          </el-form-item>
          <el-form-item label="フォームボタン表示">
            <el-switch v-model="formConf.formBtns" />
          </el-form-item>
          <el-form-item label="未選択コンポーネントボーダー表示">
            <el-switch v-model="formConf.unFocusedComponentBorder" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <treeNode-dialog :visible.sync="dialogVisible" title="オプションを追加" @commit="addNode" />
    <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" />
  </div>
</template>

<script>
import { isArray } from 'util'
import draggable from 'vuedraggable'
import TreeNodeDialog from './TreeNodeDialog'
import { isNumberStr } from '@/utils/index'
import IconsDialog from './IconsDialog'
import {
  inputComponents,
  selectComponents,
  layoutComponents
} from '@/utils/generator/config'

const dateTimeFormat = {
  date: 'yyyy-MM-dd',
  week: 'yyyy 第 WW 週',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss'
}

export default {
  components: {
    draggable,
    TreeNodeDialog,
    IconsDialog
  },
  props: ['showField', 'activeData', 'formConf'],
  data() {
    return {
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      dateTypeOptions: [
        {
          label: '日付(date)',
          value: 'date'
        },
        {
          label: '週(week)',
          value: 'week'
        },
        {
          label: '月(month)',
          value: 'month'
        },
        {
          label: '年(year)',
          value: 'year'
        },
        {
          label: '日時(datetime)',
          value: 'datetime'
        }
      ],
      dateRangeTypeOptions: [
        {
          label: '日付範囲(daterange)',
          value: 'daterange'
        },
        {
          label: '月範囲(monthrange)',
          value: 'monthrange'
        },
        {
          label: '日時範囲(datetimerange)',
          value: 'datetimerange'
        }
      ],
      colorFormatOptions: [
        {
          label: 'hex',
          value: 'hex'
        },
        {
          label: 'rgb',
          value: 'rgb'
        },
        {
          label: 'rgba',
          value: 'rgba'
        },
        {
          label: 'hsv',
          value: 'hsv'
        },
        {
          label: 'hsl',
          value: 'hsl'
        }
      ],
      justifyOptions: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ],
      layoutTreeProps: {
        label(data, node) {
          return data.componentName || `${data.label}: ${data.vModel}`
        }
      }
    }
  },
  computed: {
    documentLink() {
      return (
        this.activeData.document
        || 'https://element.eleme.cn/#/zh-CN/component/installation'
      )
    },
    dateOptions() {
      if (
        this.activeData.type !== undefined
        && this.activeData.tag === 'el-date-picker'
      ) {
        if (this.activeData['start-placeholder'] === undefined) {
          return this.dateTypeOptions
        }
        return this.dateRangeTypeOptions
      }
      return []
    },
    tagList() {
      return [
        {
          label: '入力型コンポーネント',
          options: inputComponents
        },
        {
          label: '選択型コンポーネント',
          options: selectComponents
        }
      ]
    }
  },
  methods: {
    addReg() {
      this.activeData.regList.push({
        pattern: '',
        message: ''
      })
    },
    addSelectItem() {
      this.activeData.options.push({
        label: '',
        value: ''
      })
    },
    addTreeItem() {
      ++this.idGlobal
      this.dialogVisible = true
      this.currentNode = this.activeData.options
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i on-click={() => this.append(data)}
              class="el-icon-plus"
              title="追加"
            ></i>
            <i on-click={() => this.remove(node, data)}
              class="el-icon-delete"
              title="削除"
            ></i>
          </span>
        </div>
      )
    },
    append(data) {
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      this.dialogVisible = true
      this.currentNode = data.children
    },
    remove(node, data) {
      const { parent } = node
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    addNode(data) {
      this.currentNode.push(data)
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(',')
      }
      if (['string', 'number'].indexOf(val) > -1) {
        return val
      }
      if (typeof val === 'boolean') {
        return `${val}`
      }
      return val
    },
    onDefaultValueInput(str) {
      if (isArray(this.activeData.defaultValue)) {
        // 配列
        this.$set(
          this.activeData,
          'defaultValue',
          str.split(',').map(val => (isNumberStr(val) ? +val : val))
        )
      } else if (['true', 'false'].indexOf(str) > -1) {
        // ブール値
        this.$set(this.activeData, 'defaultValue', JSON.parse(str))
      } else {
        // 文字列・数値
        this.$set(
          this.activeData,
          'defaultValue',
          isNumberStr(str) ? +str : str
        )
      }
    },
    onSwitchValueInput(val, name) {
      if (['true', 'false'].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val))
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
      }
    },
    setTimeValue(val, type) {
      const valueFormat = type === 'week' ? dateTimeFormat.date : val
      this.$set(this.activeData, 'defaultValue', null)
      this.$set(this.activeData, 'value-format', valueFormat)
      this.$set(this.activeData, 'format', val)
    },
    spanChange(val) {
      this.formConf.span = val
    },
    multipleChange(val) {
      this.$set(this.activeData, 'defaultValue', val ? [] : '')
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val)
    },
    rangeChange(val) {
      this.$set(
        this.activeData,
        'defaultValue',
        val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      )
    },
    rateTextChange(val) {
      if (val) this.activeData['show-score'] = false
    },
    rateScoreChange(val) {
      if (val) this.activeData['show-text'] = false
    },
    colorFormatChange(val) {
      this.activeData.defaultValue = null
      this.activeData['show-alpha'] = val.indexOf('a') > -1
      this.activeData.renderKey = +new Date() // renderKeyを更新し、コンポーネントを再描画
    },
    openIconsDialog(model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(item => item.tagIcon === tagIcon)
      if (!target) target = selectComponents.find(item => item.tagIcon === tagIcon)
      this.$emit('tag-change', target)
    }
  }
}
</script>

<style lang="scss" scoped>
.right-board {
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;
  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .el-scrollbar {
    height: 100%;
  }
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label{
  font-size: 14px;
}
.node-icon{
  color: #bebfc3;
}
</style>