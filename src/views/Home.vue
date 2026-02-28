<template>
  <div class="home-container">
    <!-- 背景装饰元素 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- Hero 卡片 - 玻璃拟态效果 -->
      <div class="hero-card">
        <!-- 图标 -->
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>

        <!-- 标题 -->
        <h1 class="title">AntV X6 流程图</h1>

        <!-- 描述 -->
        <p class="description">
          基于 Vue 3 + TypeScript 的专业流程图编辑器<br>
          支持自定义节点、自动布局、拖拽交互
        </p>

        <!-- 分割线 -->
        <div class="divider"></div>

        <!-- 入口按钮 -->
        <div class="action-section">
          <el-button
            type="primary"
            size="large"
            class="enter-button"
            @click="goToFlowchart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            进入流程图 Demo
          </el-button>
        </div>

        <!-- 特性标签 -->
        <div class="features">
          <span class="feature-tag">
            <svg xmlns="http://www.w3.org/2000/svg" class="tag-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            自定义节点
          </span>
          <span class="feature-tag">
            <svg xmlns="http://www.w3.org/2000/svg" class="tag-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            自动布局
          </span>
          <span class="feature-tag">
            <svg xmlns="http://www.w3.org/2000/svg" class="tag-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            拖拽交互
          </span>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="footer-info">
        <span>Vue 3.5 + TypeScript + Vite + Element Plus + AntV X6</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 跳转到流程图页面
 */
const goToFlowchart = () => {
  router.push('/flowchart')
}
</script>

<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  position: relative;
  overflow: hidden;
}

// 背景装饰圆圈
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 20s infinite ease-in-out;
  }

  .circle-1 {
    width: 400px;
    height: 400px;
    top: -100px;
    right: -100px;
    animation-delay: 0s;
  }

  .circle-2 {
    width: 300px;
    height: 300px;
    bottom: -50px;
    left: -50px;
    animation-delay: 5s;
  }

  .circle-3 {
    width: 200px;
    height: 200px;
    top: 50%;
    left: 10%;
    animation-delay: 10s;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -20px) scale(1.05);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.95);
  }
  75% {
    transform: translate(-10px, -10px) scale(1.02);
  }
}

// 主内容区
.main-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

// Hero 卡片 - 玻璃拟态效果
.hero-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  padding: 48px 40px;
  max-width: 480px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 图标包装器
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  .icon {
    width: 40px;
    height: 40px;
    color: #fff;
  }
}

// 标题
.title {
  margin: 0 0 16px;
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
}

// 描述
.description {
  margin: 0 0 24px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

// 分割线
.divider {
  width: 60px;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin: 0 auto 32px;
}

// 操作区域
.action-section {
  margin-bottom: 32px;
}

// 入口按钮
.enter-button {
  height: 52px;
  padding: 0 40px;
  font-size: 18px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  color: #0ea5e9;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    background: #fff;
    color: #0369a1;
  }

  &:active {
    transform: translateY(0);
  }

  .button-icon {
    width: 20px;
    height: 20px;
  }
}

// 特性标签组
.features {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

// 特性标签
.feature-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.2s ease;
  cursor: default;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
  }

  .tag-icon {
    width: 14px;
    height: 14px;
    color: rgba(255, 255, 255, 0.8);
  }
}

// 底部信息
.footer-info {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  animation: fadeIn 1s ease-out 0.3s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .hero-card {
    padding: 36px 24px;
    max-width: 90%;
  }

  .title {
    font-size: 26px;
  }

  .description {
    font-size: 14px;
  }

  .enter-button {
    height: 48px;
    font-size: 16px;
    padding: 0 32px;
  }

  .circle-1 {
    width: 250px;
    height: 250px;
  }

  .circle-2 {
    width: 180px;
    height: 180px;
  }

  .circle-3 {
    width: 120px;
    height: 120px;
  }
}
</style>
