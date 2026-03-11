<template>
  <!--
    TreeTableDemo.vue - vxe-table 树形表格演示页
    ================================================
    布局：
      顶部固定 Header（56px）+ 下方 Body
      Body 内并排展示两张树形表格：
        左：部件树（3层）   右：工艺 BOP 树（5层）
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
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 20.25 6v12.75m-18.375.625a1.125 1.125 0 0 0 1.125 1.125h15.75a1.125 1.125 0 0 0 1.125-1.125v-.375A1.125 1.125 0 0 0 20.25 18h-15a1.125 1.125 0 0 0-1.125 1.125v.375z" />
        </svg>
        <span class="header-title">vxe-table 树形表格</span>
        <span class="header-sub">多根节点 · 懒加载 · 部件 + 工艺 BOP</span>
      </div>
      <div class="header-right">
        <el-tag type="success" size="small">vxe-table 4.15.10</el-tag>
      </div>
    </div>

    <!-- ════════════════════════════════════════
         主体内容区：两表并排
         ════════════════════════════════════════ -->
    <div class="demo-body">
      <div class="tables-row">

        <!-- ── 左：部件树（3层：folder → module → item） ── -->
        <div class="table-card">
          <TreeTable title="部件" :show-checkbox="true" :root-data="partsRootData" :load-children="loadPartsChildren" />
        </div>

        <!-- ── 右：工艺 BOP 树（5层：总工艺→专业工艺→工序→工步→活动） ── -->
        <div class="table-card table-card--bop">
          <TreeTable title="工艺 BOP" :show-checkbox="true" :row-height="35" :root-data="bopRootData"
            :load-children="loadBopChildren" />
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import TreeTable from '@/components/TreeTable.vue'
import type { TreeNode } from '@/components/TreeTable.vue'

const router = useRouter()
const goHome = () => router.push('/')

// ════════════════════════════════════════════════════════
// ① 部件树 Mock 数据（3层）
//    folder（橙）→ module/齿轮（蓝）→ item/文档（灰）
// ════════════════════════════════════════════════════════

const partsRootData = ref<TreeNode[]>([
  { id: 1, name: '流程模板库', code: 'TPL-001', version: 'V1.0', iconType: 'folder', hasChild: true },
  { id: 2, name: '设备管理流程', code: 'EQP-002', version: 'V2.1', iconType: 'folder', hasChild: true },
  { id: 3, name: '质检标准流程', code: 'QC-003', version: 'V1.5', iconType: 'folder', hasChild: true },
])

const partsChildrenMap: Record<number | string, TreeNode[]> = {
  1: [
    { id: 11, name: '入库流程', code: 'TPL-001-01', version: 'V1.0', iconType: 'module', hasChild: true },
    { id: 12, name: '出库流程', code: 'TPL-001-02', version: 'V1.0', iconType: 'module', hasChild: true },
    { id: 13, name: '盘点流程', code: 'TPL-001-03', version: 'V1.2', iconType: 'module', hasChild: false },
  ],
  2: [
    { id: 21, name: '设备采购', code: 'EQP-002-01', version: 'V2.0', iconType: 'module', hasChild: true },
    { id: 22, name: '设备维保', code: 'EQP-002-02', version: 'V2.1', iconType: 'module', hasChild: true },
    { id: 23, name: '设备报废', code: 'EQP-002-03', version: 'V1.0', iconType: 'module', hasChild: false },
    { id: 24, name: '设备借调', code: 'EQP-002-04', version: 'V1.3', iconType: 'module', hasChild: false },
  ],
  3: [
    { id: 31, name: '来料检验', code: 'QC-003-01', version: 'V1.5', iconType: 'module', hasChild: true },
    { id: 32, name: '过程检验', code: 'QC-003-02', version: 'V1.4', iconType: 'module', hasChild: false },
    { id: 33, name: '成品检验', code: 'QC-003-03', version: 'V1.5', iconType: 'module', hasChild: false },
  ],
  11: [
    { id: 111, name: '供应商送货单', code: 'TPL-001-01-A', version: 'V1.0', iconType: 'item', hasChild: false },
    { id: 112, name: '入库验收单', code: 'TPL-001-01-B', version: 'V1.0', iconType: 'item', hasChild: false },
  ],
  12: [
    { id: 121, name: '出库申请单', code: 'TPL-001-02-A', version: 'V1.0', iconType: 'item', hasChild: false },
    { id: 122, name: '出库确认单', code: 'TPL-001-02-B', version: 'V1.1', iconType: 'item', hasChild: false },
  ],
  21: [
    { id: 211, name: '采购申请', code: 'EQP-002-01-A', version: 'V2.0', iconType: 'item', hasChild: false },
    { id: 212, name: '供应商评审', code: 'EQP-002-01-B', version: 'V1.0', iconType: 'item', hasChild: false },
    { id: 213, name: '采购合同', code: 'EQP-002-01-C', version: 'V2.0', iconType: 'item', hasChild: false },
  ],
  22: [
    { id: 221, name: '定期保养计划', code: 'EQP-002-02-A', version: 'V2.1', iconType: 'item', hasChild: false },
    { id: 222, name: '故障维修记录', code: 'EQP-002-02-B', version: 'V1.5', iconType: 'item', hasChild: false },
  ],
  31: [
    { id: 311, name: 'AQL 抽样方案', code: 'QC-003-01-A', version: 'V1.5', iconType: 'item', hasChild: false },
    { id: 312, name: '来料不合格处理', code: 'QC-003-01-B', version: 'V1.3', iconType: 'item', hasChild: false },
  ],
}

/** 部件树懒加载：按 row.id 从 partsChildrenMap 查询子节点，模拟 500ms 延迟 */
const loadPartsChildren = (row: TreeNode): Promise<TreeNode[]> =>
  new Promise(resolve => setTimeout(() => resolve(partsChildrenMap[row.id] ?? []), 500))

// ════════════════════════════════════════════════════════
// ② 工艺 BOP 树 Mock 数据（5层）
//
//   层级对应关系：
//     第1层 总工艺      iconType: 'folder'    橙色文件夹
//     第2层 各专业工艺  iconType: 'module'    蓝色齿轮
//     第3层 工序        iconType: 'operation' 青绿扳手
//     第4层 工步        iconType: 'step'      紫色列表
//     第5层 活动        iconType: 'item'      灰色文档（叶节点）
//
//   ID 规则：字符串前缀 'b' 避免与部件树 ID 冲突
// ════════════════════════════════════════════════════════

/** 第1层：总工艺根节点（3个） */
const bopRootData = ref<TreeNode[]>([
  { id: 'b1', name: '机身总装工艺', code: 'BOP-001', version: 'V1.0', iconType: 'folder', hasChild: true },
  { id: 'b2', name: '发动机装配工艺', code: 'BOP-002', version: 'V2.0', iconType: 'folder', hasChild: true },
  { id: 'b3', name: '电气系统工艺', code: 'BOP-003', version: 'V1.5', iconType: 'folder', hasChild: true },
])

/**
 * BOP 子节点映射表（第2～5层）
 *
 * 结构示意（以 b1 机身总装工艺 为例）：
 *   b1 总工艺
 *   ├── b11 结构装配工艺（专业工艺）
 *   │   ├── b111 框架定位工序
 *   │   │   ├── b1111 划线定位工步
 *   │   │   │   ├── b11111 检查划线工具（活动，叶）
 *   │   │   │   └── b11112 确认基准位置（活动，叶）
 *   │   │   └── b1112 夹紧固定工步
 *   │   │       ├── b11121 选择夹具型号（活动，叶）
 *   │   │       └── b11122 施加夹紧力（活动，叶）
 *   │   └── b112 铆接连接工序
 *   │       └── b1121 钻孔制孔工步
 *   │           ├── b11211 钻头型号确认（活动，叶）
 *   │           └── b11212 执行钻孔操作（活动，叶）
 *   └── b12 密封防腐工艺（专业工艺）
 *       └── b121 表面处理工序
 *           └── b1211 喷砂处理工步
 *               ├── b12111 喷砂压力设置（活动，叶）
 *               └── b12112 均匀喷砂施工（活动，叶）
 */
const bopChildrenMap: Record<string, TreeNode[]> = {

  // ── 第2层：各专业工艺 ──
  b1: [
    { id: 'b11', name: '结构装配工艺', code: 'BOP-001-01', version: 'V1.0', iconType: 'module', hasChild: true },
    { id: 'b12', name: '密封防腐工艺', code: 'BOP-001-02', version: 'V1.1', iconType: 'module', hasChild: true },
  ],
  b2: [
    { id: 'b21', name: '机械装配工艺', code: 'BOP-002-01', version: 'V2.0', iconType: 'module', hasChild: true },
    { id: 'b22', name: '调试校准工艺', code: 'BOP-002-02', version: 'V1.5', iconType: 'module', hasChild: true },
  ],
  b3: [
    { id: 'b31', name: '线路铺设工艺', code: 'BOP-003-01', version: 'V1.5', iconType: 'module', hasChild: true },
    { id: 'b32', name: '接线端连接工艺', code: 'BOP-003-02', version: 'V1.2', iconType: 'module', hasChild: true },
  ],

  // ── 第3层：工序 ──
  b11: [
    { id: 'b111', name: '框架定位工序', code: 'BOP-001-01-01', version: 'V1.0', iconType: 'operation', hasChild: true },
    { id: 'b112', name: '铆接连接工序', code: 'BOP-001-01-02', version: 'V1.0', iconType: 'operation', hasChild: true },
  ],
  b12: [
    { id: 'b121', name: '表面处理工序', code: 'BOP-001-02-01', version: 'V1.1', iconType: 'operation', hasChild: true },
    { id: 'b122', name: '密封涂覆工序', code: 'BOP-001-02-02', version: 'V1.0', iconType: 'operation', hasChild: false },
  ],
  b21: [
    { id: 'b211', name: '零件清洗工序', code: 'BOP-002-01-01', version: 'V2.0', iconType: 'operation', hasChild: true },
    { id: 'b212', name: '轴承装配工序', code: 'BOP-002-01-02', version: 'V2.0', iconType: 'operation', hasChild: false },
  ],
  b22: [
    { id: 'b221', name: '参数调试工序', code: 'BOP-002-02-01', version: 'V1.5', iconType: 'operation', hasChild: true },
  ],
  b31: [
    { id: 'b311', name: '导线敷设工序', code: 'BOP-003-01-01', version: 'V1.5', iconType: 'operation', hasChild: true },
  ],
  b32: [
    { id: 'b321', name: '端子压接工序', code: 'BOP-003-02-01', version: 'V1.2', iconType: 'operation', hasChild: true },
  ],

  // ── 第4层：工步 ──
  b111: [
    { id: 'b1111', name: '划线定位工步', code: 'BOP-001-01-01-S1', version: 'V1.0', iconType: 'step', hasChild: true },
    { id: 'b1112', name: '夹紧固定工步', code: 'BOP-001-01-01-S2', version: 'V1.0', iconType: 'step', hasChild: true },
  ],
  b112: [
    { id: 'b1121', name: '钻孔制孔工步', code: 'BOP-001-01-02-S1', version: 'V1.0', iconType: 'step', hasChild: true },
    { id: 'b1122', name: '铆钉安装工步', code: 'BOP-001-01-02-S2', version: 'V1.0', iconType: 'step', hasChild: false },
  ],
  b121: [
    { id: 'b1211', name: '喷砂处理工步', code: 'BOP-001-02-01-S1', version: 'V1.1', iconType: 'step', hasChild: true },
  ],
  b211: [
    { id: 'b2111', name: '超声波清洗工步', code: 'BOP-002-01-01-S1', version: 'V2.0', iconType: 'step', hasChild: true },
    { id: 'b2112', name: '烘干处理工步', code: 'BOP-002-01-01-S2', version: 'V2.0', iconType: 'step', hasChild: false },
  ],
  b221: [
    { id: 'b2211', name: '转速校准工步', code: 'BOP-002-02-01-S1', version: 'V1.5', iconType: 'step', hasChild: true },
  ],
  b311: [
    { id: 'b3111', name: '线槽固定工步', code: 'BOP-003-01-01-S1', version: 'V1.5', iconType: 'step', hasChild: true },
  ],
  b321: [
    { id: 'b3211', name: '剥线处理工步', code: 'BOP-003-02-01-S1', version: 'V1.2', iconType: 'step', hasChild: true },
    { id: 'b3212', name: '压接操作工步', code: 'BOP-003-02-01-S2', version: 'V1.2', iconType: 'step', hasChild: false },
  ],

  // ── 第5层：活动（叶节点，hasChild: false）──
  b1111: [
    { id: 'b11111', name: '检查划线工具', code: 'BOP-001-01-01-S1-A1', version: 'V1.0', iconType: 'item', hasChild: false },
    { id: 'b11112', name: '确认基准位置', code: 'BOP-001-01-01-S1-A2', version: 'V1.0', iconType: 'item', hasChild: false },
  ],
  b1112: [
    { id: 'b11121', name: '选择夹具型号', code: 'BOP-001-01-01-S2-A1', version: 'V1.0', iconType: 'item', hasChild: false },
    { id: 'b11122', name: '施加夹紧力', code: 'BOP-001-01-01-S2-A2', version: 'V1.0', iconType: 'item', hasChild: false },
  ],
  b1121: [
    { id: 'b11211', name: '钻头型号确认', code: 'BOP-001-01-02-S1-A1', version: 'V1.0', iconType: 'item', hasChild: false },
    { id: 'b11212', name: '执行钻孔操作', code: 'BOP-001-01-02-S1-A2', version: 'V1.0', iconType: 'item', hasChild: false },
  ],
  b1211: [
    { id: 'b12111', name: '喷砂压力设置', code: 'BOP-001-02-01-S1-A1', version: 'V1.1', iconType: 'item', hasChild: false },
    { id: 'b12112', name: '均匀喷砂施工', code: 'BOP-001-02-01-S1-A2', version: 'V1.1', iconType: 'item', hasChild: false },
  ],
  b2111: [
    { id: 'b21111', name: '配制清洗液', code: 'BOP-002-01-01-S1-A1', version: 'V2.0', iconType: 'item', hasChild: false },
    { id: 'b21112', name: '超声波机启动', code: 'BOP-002-01-01-S1-A2', version: 'V2.0', iconType: 'item', hasChild: false },
  ],
  b2211: [
    { id: 'b22111', name: '设定目标转速', code: 'BOP-002-02-01-S1-A1', version: 'V1.5', iconType: 'item', hasChild: false },
    { id: 'b22112', name: '记录校准数据', code: 'BOP-002-02-01-S1-A2', version: 'V1.5', iconType: 'item', hasChild: false },
  ],
  b3111: [
    { id: 'b31111', name: '线槽选型', code: 'BOP-003-01-01-S1-A1', version: 'V1.5', iconType: 'item', hasChild: false },
    { id: 'b31112', name: '线槽螺栓紧固', code: 'BOP-003-01-01-S1-A2', version: 'V1.5', iconType: 'item', hasChild: false },
  ],
  b3211: [
    { id: 'b32111', name: '剥线长度测量', code: 'BOP-003-02-01-S1-A1', version: 'V1.2', iconType: 'item', hasChild: false },
    { id: 'b32112', name: '绝缘层剥除', code: 'BOP-003-02-01-S1-A2', version: 'V1.2', iconType: 'item', hasChild: false },
  ],
}

/** BOP 树懒加载：按 row.id 从 bopChildrenMap 查询子节点，模拟 500ms 延迟 */
const loadBopChildren = (row: TreeNode): Promise<TreeNode[]> =>
  new Promise(resolve => setTimeout(() => resolve(bopChildrenMap[row.id as string] ?? []), 500))
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
   主体区：水平滚动容器 + 两表并排
   ════════════════════════════════════════ */
.demo-body {
  flex: 1;
  display: flex;
  justify-content: center;
  /* 整体居中 */
  align-items: flex-start;
  padding: 24px 20px;
  overflow: auto;
  /* 内容超出时允许滚动 */
}

/* 两表横向排列的行容器 */
.tables-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* ════════════════════════════════════════
   表格卡片
   - 固定宽度 440px，高度填满可用区域
   - 圆角 + 阴影，卡片悬浮感
   ════════════════════════════════════════ */
.table-card {
  flex-shrink: 0;
  width: 440px;
  height: calc(100vh - 56px - 48px);
  /* 减去 header + 上下 padding */
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  /* BOP 树有 5 层缩进，需要更宽 */
  &--bop {
    width: 520px;
  }
}
</style>
