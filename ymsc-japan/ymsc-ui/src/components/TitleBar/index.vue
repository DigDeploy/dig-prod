<template>
  <div class="bar-wrapper" :class="{'bar-wrapper-is-top': isTop}">
    <!-- 标题栏头部（点击可展开/收起，仅当可折叠时） -->
    <div
      class="bar-wrapper-header"
      @click="toggleExpand"
      :class="{'non-collapsible': !collapsible}"
    >
      <el-divider direction="vertical" class="bar-wrapper-divider" />
      <span v-text="title"></span>
      <span v-text="quantity" class="bar-quantity-span"></span>
      <!-- 仅当可折叠时显示图标 -->
      <span v-if="collapsible" class="toggle-icon">{{ isExpanded ? '▼' : '▲' }}</span>
    </div>

    <!-- 可展开收起的内容插槽 -->
    <div
      v-if="collapsible"
      class="expand-container"
      :class="{'expanded': isExpanded}"
      ref="expandContainer"
    >
      <div class="content-wrapper">
        <slot></slot> <!-- 插槽用于插入表单内容 -->
      </div>
    </div>

    <!-- 不可折叠时直接显示内容 -->
    <div v-else class="content-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
    export default {
        name: "TitleBar",
        props: {
            // タイトル名
            title: {
                type: String,
                default: "タイトルバー",
                required: true
            },
            // 上部に配置するか
            isTop: {
                type: Boolean,
                default: false
            },
            // 数量
            quantity: {
                type: [String, Number],
                default: ""
            },
            // 是否可折叠（新增属性）
            collapsible: {
                type: Boolean,
                default: true // 默认启用展开收起功能
            },
            // 默认是否展开
            defaultExpanded: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                isExpanded: this.defaultExpanded, // 控制展开/收起状态
                contentHeight: '0px' // 内容实际高度
            };
        },
        mounted() {
            // 初始化时获取内容高度
            if (this.collapsible && this.isExpanded) {
                this.$nextTick(() => {
                    this.updateContentHeight();
                });
            }
        },
        watch: {
            // 监听默认展开状态变化
            defaultExpanded(newValue) {
                if (this.collapsible) {
                    this.isExpanded = newValue;
                    if (newValue) {
                        this.$nextTick(() => {
                            this.updateContentHeight();
                        });
                    }
                }
            },
            // 监听展开状态变化
            isExpanded(newValue) {
                if (this.collapsible) {
                    this.$emit("toggle", newValue);
                    if (newValue) {
                        this.$nextTick(() => {
                            this.updateContentHeight();
                        });
                    }
                }
            }
        },
        methods: {
            toggleExpand() {
                if (this.collapsible) {
                    this.isExpanded = !this.isExpanded;
                }
            },
            // 更新内容实际高度
            updateContentHeight() {
                if (this.$refs.expandContainer) {
                    const content = this.$refs.expandContainer.querySelector('.content-wrapper');
                    if (content) {
                        this.contentHeight = `${content.scrollHeight}px`;
                    }
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
  .bar-wrapper {
    width: 100%;
    border-bottom: 2px solid #dfe4ed;
    margin-bottom: 12px;
    margin-top: 20px;

    /* 标题栏背景色 */
    .bar-wrapper-header {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: flex-start; /* 保持标题左对齐 */
      padding-right: 16px;
      cursor: pointer; /* 鼠标悬停显示手型 */
      user-select: none; /* 禁止选中文字 */
      background-color: #f5f7fa; /* 浅灰色背景 */
      transition: background-color 0.2s ease; /* 平滑背景色变化 */

      .bar-wrapper-divider {
        width: 2.5px;
        background-color: #102a8d;
        margin-right: 12px;
        align-items: center;
      }

      .toggle-icon {
        font-size: 16px;
        color: #909399;
        margin-left: auto; /* 将图标推到最右侧 */
        transition: transform 0.2s ease; /* 平滑图标旋转 */
      }

      /* 不可折叠时的样式 */
      &.non-collapsible {
        cursor: default; /* 移除手型光标 */
      }

      /* 鼠标悬停效果（可选，可根据需要移除） */
      &:hover {
        background-color: #e9ecef; /* 略深的灰色背景 */
      }

      &:hover .toggle-icon {
        transform: scale(1.1); /* 图标轻微放大 */
      }
    }

    /* 优化后的展开收起容器 */
    .expand-container {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* 更自然的过渡曲线 */
      will-change: max-height; /* 启用硬件加速 */
      border-top: 1px solid #e4e7ed;
      transform: translateZ(0); /* 强制GPU加速 */

      /* 展开状态 */
      &.expanded {
        max-height: 2000px; /* 设置一个足够大的值 */
      }

      .content-wrapper {
        padding: 16px;
        background-color: transparent; /* 内容区域无背景色 */
        transition: opacity 0.2s ease; /* 平滑内容透明度变化 */
      }
    }

    /* 不可折叠时的内容样式 */
    .content-wrapper {
      padding: 16px;
      background-color: transparent; /* 内容区域无背景色 */
    }
  }

  .bar-wrapper-is-top {
    margin-top: 0;
  }

  .bar-quantity-span {
    margin-left: 10px;
    color: #8b8989;
    font-weight: 400;
  }
</style>
