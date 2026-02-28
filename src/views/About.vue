<template>
  <div class="about-container">
    <el-container>
      <el-header class="header">
        <el-button @click="router.push('/')" :icon="ArrowLeft">返回首页</el-button>
        <h1>关于页面</h1>
      </el-header>
      <el-main class="main">
        <el-card class="info-card">
          <el-descriptions title="项目信息" :column="1" border>
            <el-descriptions-item label="Vue版本">3.5.13</el-descriptions-item>
            <el-descriptions-item label="Vue Router">4.4.5</el-descriptions-item>
            <el-descriptions-item label="Axios">1.7.8</el-descriptions-item>
            <el-descriptions-item label="Vite">5.4.10</el-descriptions-item>
            <el-descriptions-item label="Sass">1.80.6</el-descriptions-item>
            <el-descriptions-item label="UI库">Element Plus</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
</script>

<style lang="scss" scoped>
.about-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  .header {
    background-color: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    h1 {
      margin: 0;
      color: #333;
    }
  }

  .main {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info-card {
    max-width: 600px;
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
}
</style>
