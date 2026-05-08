<template>
  <div class="interact-container">
    <!-- 点赞按钮 -->
    <div
      class="interact-btn"
      :class="{ active: isLiked }"
      @click="handleLike"
    >
      <font-awesome-icon icon="fal fa-thumbs-up" />
    </div>

    <!-- 收藏按钮 -->
    <div
      class="interact-btn"
      :class="{ active: isCollected }"
      @click="handleCollect"
    >
      <i class="el-icon-delete"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LikeCollectDemo',
  data() {
    return {
      // 点赞状态和数量
      isLiked: false,
      likeCount: 100,
      likeCountChanged: false, // 标记数字是否变化，用于动效

      // 收藏状态和数量
      isCollected: false,
      collectCount: 50,
      collectCountChanged: false
    }
  },
  methods: {
    // 点赞处理
    handleLike() {
      // 防抖：避免快速重复点击
      if (this.likeCountChanged) return;

      this.isLiked = !this.isLiked;
      // 更新数量：点赞+1，取消点赞-1
      this.likeCount = this.isLiked ? this.likeCount + 1 : this.likeCount - 1;

      // 触发数字变化动效
      this.likeCountChanged = true;
      // 1秒后移除动效类，恢复初始状态
      setTimeout(() => {
        this.likeCountChanged = false;
      }, 1000);
    },

    // 收藏处理（逻辑和点赞一致）
    handleCollect() {
      if (this.collectCountChanged) return;

      this.isCollected = !this.isCollected;
      this.collectCount = this.isCollected ? this.collectCount + 1 : this.collectCount - 1;

      this.collectCountChanged = true;
      setTimeout(() => {
        this.collectCountChanged = false;
      }, 1000);
    }
  }
}
</script>

<style scoped>
.interact-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.interact-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #999;
  transition: all 0.3s ease;
  /* 初始缩放 */
  transform: scale(1);
}

/* 激活状态（已点赞/收藏） */
.interact-btn.active {
  color: #e63946;
}

/* 点击时的缩放动画 */
.interact-btn:active {
  transform: scale(1.2);
}

/* 数字变化动效 */
.count.change {
  animation: countBounce 1s ease;
}

@keyframes countBounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* 图标样式（根据实际icon调整） */
.iconfont {
  font-size: 20px;
}
</style>
