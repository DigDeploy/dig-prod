<template>
  <div class="show-container">
    <el-row :class="['container', border ? 'border' : 'normal']" :style="{'--labelWidth': labelWidth}">
      <el-col v-for="(item,index) in renderArrays" :key="index" :span="item.span" class="item-col">
        <div class="item-container">
          <div class="item-label">
            {{ item.label }}
          </div>
          <div class="item-value">
            <template v-if="item.slot">
              <slot :name="item.slot"/>
            </template>
            <template v-else>
              {{ value(item) }}
            </template>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'ShowContainer',
    props: {
      // 元データ
      dataSource: {
        type: Object,
        default: () => {
          return {}
        }
      },
      // 描画列 {label: 必須, field: 必須, span: 任意(Number), money: 任意(Boolean) ,appendText: 任意}
      renderItems: {
        type: Array,
        default: () => []
      },
      // label幅
      labelWidth: {
        type: String,
        default: '100px'
      },
      // ボーダー表示するか
      border: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },

    /* 計算プロパティ */
    computed: {
      // 値
      value() {
        return (item) => {
          // デフォルトテキスト値
          let text = this.dataSource[item.field]
          // 存在しない場合
          if (text === null || text === undefined || text.toString().trim() === '') {
            return '--'
          }
          // 金額の場合
          if (item['money']) {
            text = this.toThousandsNoZero(text)
          }
          // テキストを追加
          text += item['appendText'] || ''
          // 戻り値
          return text
        }
      },
      // 描画フィールドリスト
      renderArrays() {
        // リスト
        let arrays = []
        // ボーダー形式
        if (this.border) {
          // 長さ
          let len = this.renderItems.length
          // 長さが0の場合
          if (len === 0) {
            return arrays
          }
          // 残りlayout
          let residueLayout = 24
          // ループ処理
          this.renderItems.forEach((item, index) => {
            // 次の項目が存在するか
            let next = index + 1 < len
            // 次のグリッドのspan数 デフォルト0
            let nextSpan = 0
            // 次の項目が存在する場合
            if (next) {
              nextSpan = this.renderItems[index + 1].span
            }
            // 現在のグリッドのspan数
            let itemSpan = Number(item.span || 24)
            // 残りlayoutが次のitemに不足する場合
            if (nextSpan > residueLayout - itemSpan) {
              // このlayoutを全体に敷き詰める
              arrays.push({
                ...item,
                span: residueLayout
              })
              // 残りlayoutをリセット
              residueLayout = 24
              // 今回の結果を次回に使用
              return
            }

            // 追加
            arrays.push(item)
            // 残りlayoutを計算
            residueLayout = residueLayout - itemSpan
            // 行layoutが全て使用された場合 リセット
            if (residueLayout === 0) {
              residueLayout = 24
            }
          })
        }
        // 通常形式
        else {
          arrays = this.renderItems
        }
        // 戻り値
        return arrays
      }
    },

    /* メソッド */
    methods: {
      // 金額変換
      toThousandsNoZero: function (val) {
        return val ? ((isNaN(parseFloat(val.toString().replace(/,/g, ""))) ? 1 :
          parseFloat(val.toString().replace(/,/g, ""))))
          .toFixed(2).toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
            return $1 + ",";
          }) : "0.00";
      },
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep.show-container {
    /* ボーダー色 */
    --borderColor: #e6e9f0;
    font-size: 15px;

    .item-label {
      justify-content: right;
      min-width: var(--labelWidth);
      color: #909399;
    }

    .item-value {
      color: #606266;
    }

    .container {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      .item-col {
        .item-container {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          color: rgba(0, 0, 0, .65);
          font-size: 14px;
          line-height: 1.5;
          width: 100%;
          height: 100%;

          .item-label {
            flex-grow: 0;
            flex-shrink: 0;
            font-weight: 400;
            font-size: 14px;
            line-height: 1.5;
            height: 100%;
            display: flex;
          }

          .item-value {
            flex-grow: 1;
            overflow: hidden;
            word-break: break-all;
            height: 100%;
            display: flex;

            // データが空の場合に表示する内容
            &:empty::after {
              content: '--';
            }
          }
        }
      }
    }

    /* ボーダー形式 */
    .border {
      border-radius: 2px;
      border: 1px solid var(--borderColor);
      border-bottom: 0;
      border-right: 0;

      .item-col {
        border-right: 1px solid var(--borderColor);
        border-bottom: 1px solid var(--borderColor);

        .item-label {
          padding: 12px 16px;
          background-color: #fafafa;
          border-right: 1px solid var(--borderColor);
          align-items: center;
        }

        .item-value {
          padding: 12px 16px;
          align-items: center;
        }
      }
    }

    /* 通常形式 */
    .normal {
      .item-label {
        padding: 12px 5px 12px 16px;

        &:after {
          content: "：";
          margin: 0 2px;
          position: relative;
          top: -0.5px;
        }
      }

      .item-value {
        padding: 12px 16px 12px 5px;
      }
    }
  }
</style>