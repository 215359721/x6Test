<template>
  <div class="home-container">
    <el-container>
      <el-header class="header">
        <h1>Vue + TypeScript + Element Plus</h1>
      </el-header>
      <el-main class="main">
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <span>欢迎使用</span>
            </div>
          </template>
          <p>这是一个基于 Vite 构建的 Vue 3 + TypeScript 项目</p>
          <p>已集成 Element Plus UI 组件库和 AntV X6 流程图</p>
          <el-divider />
          <el-space wrap>
            <el-button type="primary" @click="handleClick">主要按钮</el-button>
            <el-button @click="router.push('/about')">关于页面</el-button>
            <el-button type="success" @click="router.push('/flowchart')">流程图 Demo</el-button>
          </el-space>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const handleClick = () => {
  ElMessage.success('项目运行成功！')
}
</script>

<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .header {
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    h1 {
      margin: 0;
      color: #333;
      font-size: 24px;
    }
  }

  .main {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .welcome-card {
    max-width: 500px;
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

    .card-header {
      font-size: 18px;
      font-weight: bold;
    }

    p {
      margin: 8px 0;
      color: #666;
      line-height: 1.8;
    }
  }
}
</style>
