<template>
  <!--
    TreeTableDemo.vue - vxe-table 树形表格演示页
    ================================================
    职责：
      - 作为 TreeTable 组件的使用示例页面
      - 提供 Mock 根节点数据（rootData）
      - 提供懒加载子节点的回调函数（loadChildren）
      - 包含顶部导航栏和返回首页功能
    布局：
      顶部固定 Header（56px）+ 下方滚动 Body
      Body 内的表格卡片居中显示，限制最大宽度
  -->
  <div class="demo-container">

    <!-- ════════════════════════════════════════
         顶部工具栏
         - 左侧：返回按钮、竖线分割、页面标题、副标题
         - 右侧：当前使用的 vxe-table 版本标签
         ════════════════════════════════════════ -->
    <div class="demo-header">
      <div class="header-left">
        <!-- 返回首页按钮：点击后路由跳转到 "/" -->
        <el-button
          text
          :icon="ArrowLeft"
          class="back-btn"
          @click="goHome"
        >
          返回首页
        </el-button>

        <!-- 竖向分隔线 -->
        <div class="divider-v"></div>

        <!-- 页面主题图标（表格形状的 SVG） -->
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 20.25 6v12.75m-18.375.625a1.125 1.125 0 0 0 1.125 1.125h15.75a1.125 1.125 0 0 0 1.125-1.125v-.375A1.125 1.125 0 0 0 20.25 18h-15a1.125 1.125 0 0 0-1.125 1.125v.375z" />
        </svg>

        <!-- 页面标题 -->
        <span class="header-title">vxe-table 树形表格</span>

        <!-- 副标题：功能说明 -->
        <span class="header-sub">多根节点 · 懒加载 · 单列树</span>
      </div>

      <div class="header-right">
        <!-- 版本标签，绿色表示已正确加载 -->
        <el-tag type="success" size="small">vxe-table 4.15.10</el-tag>
      </div>
    </div>

    <!-- ════════════════════════════════════════
         主体内容区
         - 使用 flex 居中，限制最大宽度为 720px
         - 背景色 #f0f2f5 与卡片白色形成层次感
         ════════════════════════════════════════ -->
    <div class="demo-body">
      <!--
        表格卡片容器
        - max-width: 720px 防止在宽屏下撑满全宽
        - margin: 0 auto 实现水平居中
        - 圆角 + 阴影营造卡片悬浮感
      -->
      <div class="table-card">
        <!--
          TreeTable 组件使用
          Props 说明：
            :root-data    - 初始渲染的根节点数组（3 个顶级节点）
            :load-children - 点击展开时调用的懒加载函数，
                             接收当前行 row，返回 Promise<TreeNode[]>
        -->
        <TreeTable
          :root-data="rootData"
          :load-children="loadChildren"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
/**
 * TreeTableDemo.vue - Script
 * ==========================
 * 该脚本负责：
 *   1. 定义并初始化根节点 Mock 数据
 *   2. 提供多层级子节点 Mock 数据映射表
 *   3. 实现懒加载回调（模拟异步接口延迟）
 *   4. 提供路由跳转方法
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import TreeTable from '@/components/TreeTable.vue'
import type { TreeNode } from '@/components/TreeTable.vue'

// ── 路由实例，用于页面跳转 ──
const router = useRouter()

/**
 * 返回首页
 * 点击顶部"返回首页"按钮时触发
 */
const goHome = () => router.push('/')

// ════════════════════════════════════════════
// Mock 根节点数据（第 0 层 / 顶级节点）
// ════════════════════════════════════════════
/**
 * rootData：传入 TreeTable 组件的初始数据
 * - 共 3 个根节点，均为 folder 类型（橙色文件夹图标）
 * - hasChild: true 表示该节点有子节点，vxe-table 将渲染展开箭头
 * - 字段说明：
 *     id       - 节点唯一标识，用于懒加载时匹配 childrenMap
 *     name     - 节点名称（显示在 label 第一段）
 *     code     - 节点编号（显示在 label 第二段，灰色）
 *     version  - 节点版本（显示在 label 第三段，蓝色徽标）
 *     iconType - 图标类型：folder / module / item
 *     hasChild - 是否有子节点（懒加载必须字段）
 */
const rootData = ref<TreeNode[]>([
  {
    id: 1,
    name: '流程模板库',
    code: 'TPL-001',
    version: 'V1.0',
    iconType: 'folder',
    hasChild: true,
  },
  {
    id: 2,
    name: '设备管理流程',
    code: 'EQP-002',
    version: 'V2.1',
    iconType: 'folder',
    hasChild: true,
  },
  {
    id: 3,
    name: '质检标准流程',
    code: 'QC-003',
    version: 'V1.5',
    iconType: 'folder',
    hasChild: true,
  },
])

// ════════════════════════════════════════════
// Mock 子节点数据映射表（第 1、2 层节点）
// ════════════════════════════════════════════
/**
 * childrenMap：以父节点 id 为 key，子节点数组为 value
 * 层级结构：
 *
 *   根节点（folder）
 *   └── 第1层子节点（module，中间层，部分有子节点）
 *       └── 第2层子节点（item，叶节点，hasChild: false）
 *
 * 在实际项目中，此处应替换为真实的 API 请求，例如：
 *   const res = await axios.get(`/api/nodes/${row.id}/children`)
 *   return res.data
 */
const childrenMap: Record<number | string, TreeNode[]> = {

  // ── 根节点 1：流程模板库 的子节点 ──
  1: [
    // hasChild: true → 点击可继续展开，触发第二次懒加载
    { id: 11, name: '入库流程', code: 'TPL-001-01', version: 'V1.0', iconType: 'module', hasChild: true },
    { id: 12, name: '出库流程', code: 'TPL-001-02', version: 'V1.0', iconType: 'module', hasChild: true },
    // hasChild: false → 叶节点，无展开箭头
    { id: 13, name: '盘点流程', code: 'TPL-001-03', version: 'V1.2', iconType: 'module', hasChild: false },
  ],

  // ── 根节点 2：设备管理流程 的子节点 ──
  2: [
    { id: 21, name: '设备采购', code: 'EQP-002-01', version: 'V2.0', iconType: 'module', hasChild: true },
    { id: 22, name: '设备维保', code: 'EQP-002-02', version: 'V2.1', iconType: 'module', hasChild: true },
    { id: 23, name: '设备报废', code: 'EQP-002-03', version: 'V1.0', iconType: 'module', hasChild: false },
    { id: 24, name: '设备借调', code: 'EQP-002-04', version: 'V1.3', iconType: 'module', hasChild: false },
  ],

  // ── 根节点 3：质检标准流程 的子节点 ──
  3: [
    { id: 31, name: '来料检验', code: 'QC-003-01', version: 'V1.5', iconType: 'module', hasChild: true },
    { id: 32, name: '过程检验', code: 'QC-003-02', version: 'V1.4', iconType: 'module', hasChild: false },
    { id: 33, name: '成品检验', code: 'QC-003-03', version: 'V1.5', iconType: 'module', hasChild: false },
  ],

  // ── 第二层叶节点（item 类型）──
  // 入库流程（id=11）的子节点
  11: [
    { id: 111, name: '供应商送货单', code: 'TPL-001-01-A', version: 'V1.0', iconType: 'item', hasChild: false },
    { id: 112, name: '入库验收单',   code: 'TPL-001-01-B', version: 'V1.0', iconType: 'item', hasChild: false },
  ],
  // 出库流程（id=12）的子节点
  12: [
    { id: 121, name: '出库申请单', code: 'TPL-001-02-A', version: 'V1.0', iconType: 'item', hasChild: false },
    { id: 122, name: '出库确认单', code: 'TPL-001-02-B', version: 'V1.1', iconType: 'item', hasChild: false },
  ],
  // 设备采购（id=21）的子节点
  21: [
    { id: 211, name: '采购申请',   code: 'EQP-002-01-A', version: 'V2.0', iconType: 'item', hasChild: false },
    { id: 212, name: '供应商评审', code: 'EQP-002-01-B', version: 'V1.0', iconType: 'item', hasChild: false },
    { id: 213, name: '采购合同',   code: 'EQP-002-01-C', version: 'V2.0', iconType: 'item', hasChild: false },
  ],
  // 设备维保（id=22）的子节点
  22: [
    { id: 221, name: '定期保养计划', code: 'EQP-002-02-A', version: 'V2.1', iconType: 'item', hasChild: false },
    { id: 222, name: '故障维修记录', code: 'EQP-002-02-B', version: 'V1.5', iconType: 'item', hasChild: false },
  ],
  // 来料检验（id=31）的子节点
  31: [
    { id: 311, name: 'AQL 抽样方案',  code: 'QC-003-01-A', version: 'V1.5', iconType: 'item', hasChild: false },
    { id: 312, name: '来料不合格处理', code: 'QC-003-01-B', version: 'V1.3', iconType: 'item', hasChild: false },
  ],
}

/**
 * loadChildren - 懒加载子节点回调
 * ===================================
 * 由 TreeTable 组件在用户点击展开箭头时调用。
 *
 * 参数：
 *   row - 被展开的当前行节点（TreeNode 类型）
 *
 * 返回：
 *   Promise<TreeNode[]> - 解析后的子节点数组
 *
 * 当前实现：
 *   使用 setTimeout 模拟 500ms 网络延迟，
 *   从 childrenMap 中按 row.id 查找子节点。
 *   若该节点在映射表中不存在则返回空数组 []。
 *
 * 实际项目替换示例：
 *   const res = await axios.get(`/api/tree/children?parentId=${row.id}`)
 *   return res.data.list
 */
const loadChildren = (row: TreeNode): Promise<TreeNode[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 按父节点 id 查找子节点，未命中则返回空数组
      const children = childrenMap[row.id] ?? []
      resolve(children)
    }, 500)
  })
}
</script>

<style lang="scss" scoped>
/* ════════════════════════════════════════
   页面整体布局
   - 全屏高度，flex 纵向排列
   - 顶部 header 固定高度，body 自适应填充剩余空间
   ════════════════════════════════════════ */
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
  flex-shrink: 0;           /* 不随 body 伸缩，高度固定 */
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

/* 竖向分隔线 */
.divider-v {
  width: 1px;
  height: 20px;
  background: #dcdfe6;
}

.header-icon {
  width: 22px;
  height: 22px;
  color: #3b82f6;
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

/* ════════════════════════════════════════
   主体内容区
   - flex 居中布局，让 table-card 水平居中
   - overflow-y: auto 允许内容超出时滚动
   ════════════════════════════════════════ */
.demo-body {
  flex: 1;                  /* 填满 header 以下的所有剩余高度 */
  display: flex;
  justify-content: center;  /* 子元素水平居中 */
  padding: 24px 20px;
  overflow-y: auto;
}

/* ════════════════════════════════════════
   表格卡片
   - max-width: 720px：在宽屏下限制最大宽度，避免撑满全屏
   - width: 100%：在窄屏（< 720px）下自适应
   - margin: 0 auto：配合 flex justify-content 实现居中
   - 圆角 + 阴影营造悬浮卡片感
   ════════════════════════════════════════ */
.table-card {
  width: 100%;
  max-width: 440px;
  /* height 不设固定值，由内容高度撑开；
     若需固定高度并在卡片内部滚动，可改为：
     height: calc(100vh - 56px - 48px);  */
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
</style>
