<template>
  <!--
    DraggableTabsDemo.vue - El-Tabs 跨组拖拽演示页
    ================================================
    布局：
      顶部固定 Header（56px）+ 下方 Body
      Body 内：提示栏 + DraggableTabs 主体
  -->
  <div class="demo-container">

    <!-- ════════════════════════════════════════
         顶部工具栏
         ════════════════════════════════════════ -->
    <div class="demo-header">
      <div class="header-left">
        <el-button text :icon="ArrowLeft" class="back-btn" @click="goHome">
          返回首页
        </el-button>
        <div class="divider-v"></div>
        <!-- 拖拽/交换图标 -->
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 3M21 7.5H7.5" />
        </svg>
        <span class="header-title">El-Tabs 拖拽</span>
        <span class="header-sub">跨分组拖拽 · 动态布局 · 标签重组</span>
      </div>
      <div class="header-right">
        <el-tag type="warning" size="small">HTML5 DnD API</el-tag>
        <el-tag type="success" size="small">Element Plus</el-tag>
      </div>
    </div>

    <!-- ════════════════════════════════════════
         主体内容区
         ════════════════════════════════════════ -->
    <div class="demo-body">

      <!-- 操作提示栏 -->
      <div class="demo-hint">
        <svg class="hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <span>拖拽标签头的 <b>⠿</b> 图标即可将 Tab 移至对方分组 · 每侧至少保留 1 个标签</span>
        <div class="hint-switch">
          <span class="hint-switch-label">允许拖拽</span>
          <el-switch v-model="allowDrag" />
        </div>
      </div>

      <!-- DraggableTabs 主体 -->
      <div class="tabs-wrapper">
        <DraggableTabs
          :initial-left-tabs="leftTabs"
          :initial-right-tabs="rightTabs"
          :allow-drag="allowDrag"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import DraggableTabs from '@/components/DraggableTabs.vue'
import type { TabItem } from '@/components/DraggableTabs.vue'

const router = useRouter()
const goHome = () => router.push('/')

/** 是否允许拖拽，对应 DraggableTabs :allow-drag prop */
const allowDrag = ref(true)

// ════════════════════════════════════════════════════════
// 左分组初始数据（工作台 A：3 个 tab）
// ════════════════════════════════════════════════════════
const leftTabs: TabItem[] = [
  {
    name: 'overview',
    label: '数据总览',
    emoji: '📊',
    desc: '实时业务指标监控，展示核心 KPI 与趋势走势，支持多维度数据下钻。',
  },
  {
    name: 'tasks',
    label: '任务看板',
    emoji: '📋',
    desc: '以看板视图管理进行中的工作项，按优先级排列，支持状态流转与指派。',
  },
  {
    name: 'messages',
    label: '消息中心',
    emoji: '💬',
    desc: '汇聚团队消息、系统通知与待办提醒，支持按类型筛选与已读标记。',
  },
]

// ════════════════════════════════════════════════════════
// 右分组初始数据（工作台 B：3 个 tab）
// ════════════════════════════════════════════════════════
const rightTabs: TabItem[] = [
  {
    name: 'charts',
    label: '图表分析',
    emoji: '📈',
    desc: '多维度数据图表展示，涵盖折线、柱状、饼图，支持时间范围自定义。',
  },
  {
    name: 'files',
    label: '文件管理',
    emoji: '📁',
    desc: '项目文档与资源库，支持版本历史、权限控制与在线预览。',
  },
  {
    name: 'members',
    label: '成员管理',
    emoji: '👥',
    desc: '查看团队成员在线状态、工作负载与角色权限，快速发起协作邀请。',
  },
]
</script>

<style lang="scss" scoped>
/* 页面整体：全屏 flex 纵向 */
.demo-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  overflow: hidden;
}

/* ── 顶部工具栏 ── */
.demo-header {
  flex-shrink: 0;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  font-size: 13px;
  color: #606266;
}

.divider-v {
  width: 1px;
  height: 20px;
  background: #dcdfe6;
}

.header-icon {
  width: 22px;
  height: 22px;
  color: #f59e0b;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.header-sub {
  font-size: 12px;
  color: #9ca3af;
  margin-left: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── 主体区 ── */
.demo-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 24px 24px;
  overflow: hidden;
  gap: 16px;
}

/* ── 操作提示栏 ── */
.demo-hint {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  font-size: 13px;
  color: #92400e;

  b { font-weight: 700; }

  /* switch 区域推到右侧 */
  .hint-switch {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    flex-shrink: 0;
  }

  .hint-switch-label {
    font-size: 13px;
    color: #92400e;
    white-space: nowrap;
  }
}

.hint-icon {
  width: 16px;
  height: 16px;
  color: #d97706;
  flex-shrink: 0;
}

/* ── DraggableTabs 容器：撑满剩余高度 ── */
.tabs-wrapper {
  flex: 1;
  min-height: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}
</style>
