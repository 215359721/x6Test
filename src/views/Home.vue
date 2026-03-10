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
      <!-- Hero 区域 -->
      <div class="hero-section">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h1 class="title">组件演示平台</h1>
        <p class="description">Vue 3 + TypeScript 组件开发示例合集</p>
        <div class="divider"></div>
      </div>

      <!-- 演示入口卡片网格 -->
      <div class="demo-grid">
        <!-- 流程图 Card -->
        <div class="demo-card" @click="goToFlowchart">
          <div class="card-icon card-icon--blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="card-body">
            <h3 class="card-title">AntV X6 流程图</h3>
            <p class="card-desc">基于 X6 的专业流程图编辑器，支持自定义节点、自动布局与拖拽交互</p>
            <div class="card-tags">
              <span class="tag">自定义节点</span>
              <span class="tag">自动布局</span>
              <span class="tag">拖拽交互</span>
            </div>
          </div>
          <div class="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>

        <!-- 树形表格 Card -->
        <div class="demo-card" @click="goToTreeTable">
          <div class="card-icon card-icon--green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0120.25 6v12.75m-18.375.625a1.125 1.125 0 001.125 1.125h15.75a1.125 1.125 0 001.125-1.125v-.375A1.125 1.125 0 0020.25 18h-15a1.125 1.125 0 00-1.125 1.125v.375z" />
            </svg>
          </div>
          <div class="card-body">
            <h3 class="card-title">vxe-table 树形表格</h3>
            <p class="card-desc">基于 vxe-table 的树形表格组件，支持多根节点、懒加载与节点图标展示</p>
            <div class="card-tags">
              <span class="tag">多根节点</span>
              <span class="tag">懒加载</span>
              <span class="tag">单列树</span>
            </div>
          </div>
          <div class="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="footer-info">
        <span>Vue 3.5 · TypeScript · Vite · Element Plus · AntV X6 · vxe-table</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToFlowchart = () => router.push('/flowchart')
const goToTreeTable = () => router.push('/tree-table')
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
  0%, 100% { transform: translate(0, 0) scale(1); }
  25%       { transform: translate(20px, -20px) scale(1.05); }
  50%       { transform: translate(-20px, 20px) scale(0.95); }
  75%       { transform: translate(-10px, -10px) scale(1.02); }
}

// 主内容
.main-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px 16px;
  width: 100%;
  max-width: 760px;
}

// Hero 区域
.hero-section {
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  .icon {
    width: 36px;
    height: 36px;
    color: #fff;
  }
}

.title {
  margin: 0 0 10px;
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
}

.description {
  margin: 0 0 20px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
}

.divider {
  width: 48px;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin: 0 auto;
}

// 演示卡片网格
.demo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  animation: fadeInUp 0.8s ease-out 0.15s both;
}

// 单张演示卡片
.demo-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 24px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0);
    transition: background 0.3s ease;
    border-radius: 20px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.5);

    &::before {
      background: rgba(255, 255, 255, 0.05);
    }

    .card-arrow {
      transform: translateX(4px);
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
}

// 卡片图标
.card-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 26px;
    height: 26px;
  }

  &--blue {
    background: rgba(59, 130, 246, 0.3);
    svg { color: #bfdbfe; }
  }

  &--green {
    background: rgba(16, 185, 129, 0.3);
    svg { color: #a7f3d0; }
  }
}

// 卡片内容
.card-body {
  flex: 1;
}

.card-title {
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 600;
  color: #fff;
}

.card-desc {
  margin: 0 0 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
}

// 箭头
.card-arrow {
  align-self: flex-end;
  width: 24px;
  height: 24px;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0.6;
  transition: all 0.3s ease;

  svg {
    width: 100%;
    height: 100%;
  }
}

// 底部信息
.footer-info {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  animation: fadeIn 1s ease-out 0.3s both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

// 响应式
@media (max-width: 600px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 24px;
  }

  .main-content {
    max-width: 100%;
  }
}
</style>
