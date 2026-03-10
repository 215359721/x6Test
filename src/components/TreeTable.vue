<template>
  <!--
    TreeTable.vue - 可复用树形表格组件
    =====================================
    功能：
      - 基于 vxe-table 渲染一棵多根节点的树形表格
      - 支持懒加载：首次展开节点时才异步加载子节点数据
      - 单列展示，列内容为：[图标] + [名称 · 编号 · 版本]
    Props：
      title         - 列头文字，默认"部件"
      rootData      - 初始根节点数组，组件挂载时直接渲染
      loadChildren  - 懒加载回调，展开节点时由父组件提供异步数据
    设计说明：
      将数据逻辑（Mock/API）留在父组件，此组件只负责渲染与交互，
      保持组件的纯粹性和可复用性。
  -->
  <div class="tree-table-wrapper">

    <!--
      vxe-table 主表格
      ─────────────────────────────────────
      :data         - 绑定的行数据数组（根节点列表）
      :tree-config  - 树形配置（懒加载、hasChild 字段名、loadMethod）
      :row-config   - 行配置（keyField 指定唯一标识字段）
      :loading      - 全局 loading 状态（目前保留扩展用）
      border="inner"- 仅显示内部行间分隔线，外边框不渲染
      show-overflow - 单元格内容超出时显示 tooltip
      height="100%" - 高度撑满父容器（.tree-table-wrapper）
    -->
    <vxe-table
      ref="tableRef"
      :data="tableData"
      :tree-config="treeConfig"
      :row-config="rowConfig"
      :loading="loading"
      border="inner"
      show-overflow
      height="100%"
    >
      <!--
        唯一列：节点信息列
        ─────────────────────────────────────
        tree-node  - 声明此列为树形展开列，vxe-table 会在此列
                     前面自动插入缩进和展开/折叠箭头图标
        min-width  - 最小宽度 300px，防止节点内容被截断
      -->
      <vxe-column tree-node min-width="300">

        <!-- 列头插槽：显示外部传入的 title prop -->
        <template #header>
          <span class="col-header">{{ title }}</span>
        </template>

        <!-- 行内容插槽：自定义每行的节点渲染内容 -->
        <template #default="{ row }">
          <!--
            节点单元格：图标 + 标签文字
            使用 inline-flex 保持图标与文字在同一行对齐
          -->
          <span class="node-cell">

            <!-- ──────────────────────────────
                 节点图标区域
                 根据 row.iconType 切换不同 SVG 图标：
                   folder    - 文件夹（橙色）  根节点 / 第1层
                   module    - 齿轮（蓝色）    第2层
                   operation - 扳手（青绿色）  第3层 工序
                   step      - 列表（紫色）    第4层 工步
                   item      - 文档（灰色）    叶节点
                   其他      - 圆点（浅灰）    兜底
                 class 绑定 icon-${iconType} 控制颜色
                 ────────────────────────────── -->
            <span class="node-icon" :class="`icon-${row.iconType || 'default'}`">

              <!-- folder：文件夹形状，填充式 -->
              <svg v-if="row.iconType === 'folder'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"/>
              </svg>

              <!-- module：齿轮形状，表示模块/分组 -->
              <svg v-else-if="row.iconType === 'module'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.3.07-.62.07-.95s-.03-.66-.07-1l2.13-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
              </svg>

              <!-- operation：扳手形状，表示工序（第3层） -->
              <svg v-else-if="row.iconType === 'operation'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
              </svg>

              <!-- step：有序列表形状，表示工步（第4层） -->
              <svg v-else-if="row.iconType === 'step'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
              </svg>

              <!-- item：文档/文件形状，右上角折角，叶节点 -->
              <svg v-else-if="row.iconType === 'item'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm0 1.5L19.5 8H14V3.5z"/>
              </svg>

              <!-- default：小圆点，兜底图标 -->
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5"/>
              </svg>
            </span>

            <!-- ──────────────────────────────
                 节点标签区域
                 由三段文字拼接：名称 · 编号 · 版本
                   label-name    主名称，加粗深色，可截断
                   label-sep     分隔符"·"，浅灰色
                   label-code    编号，灰色小字
                   label-version 版本，蓝色徽标样式
                 ────────────────────────────── -->
            <span class="node-label">
              <span class="label-name">{{ row.name }}</span>
              <span class="label-sep">·</span>
              <span class="label-code">{{ row.code }}</span>
              <span class="label-sep">·</span>
              <span class="label-version">{{ row.version }}</span>
            </span>

          </span>
        </template>
      </vxe-column>
    </vxe-table>

  </div>
</template>

<script setup lang="ts">
/**
 * TreeTable.vue - Script
 * =======================
 * 组件内部职责：
 *   - 接收 rootData 并初始化 tableData（内部副本，避免直接修改 prop）
 *   - 监听 rootData 变化，同步更新 tableData（支持父组件动态更新根节点）
 *   - 配置 vxe-table 的 rowConfig 和 treeConfig
 *   - 将懒加载调用代理给父组件传入的 loadChildren 回调
 */
import { ref, watch } from 'vue'
import type { VxeTableInstance, VxeTablePropTypes } from 'vxe-table'

// ════════════════════════════════════════════
// 类型定义
// ════════════════════════════════════════════

/**
 * TreeNode - 树节点数据结构
 * 导出供父组件（TreeTableDemo.vue 等）复用类型定义
 *
 * 字段说明：
 *   id       - 节点唯一标识，rowConfig.keyField 引用此字段
 *   name     - 节点主名称，显示在 label 第一段
 *   code     - 节点编号，显示在 label 第二段（灰色）
 *   version  - 节点版本号，显示在 label 第三段（蓝色徽标）
 *   iconType - 控制图标外观：
 *                'folder'    文件夹（橙色）根节点
 *                'module'    齿轮（蓝色）第2层
 *                'operation' 扳手（青绿色）工序/第3层
 *                'step'      列表（紫色）工步/第4层
 *                'item'      文档（灰色）叶节点
 *   hasChild - 是否有子节点；vxe-table 据此决定是否渲染展开箭头
 *              true  → 渲染箭头，首次展开时触发 loadMethod
 *              false → 不渲染箭头（叶节点）
 *   [key]    - 允许携带额外业务字段（索引签名）
 */
export interface TreeNode {
  id: string | number
  name: string
  code: string
  version: string
  iconType?: 'folder' | 'module' | 'operation' | 'step' | 'item' | string
  hasChild?: boolean
  [key: string]: unknown
}

/**
 * Props 定义
 *   title         - 表格列头文字，默认"部件"，不同业务场景可自定义
 *   rootData      - 初始根节点数组，由父组件提供，组件内部不修改原数组
 *   loadChildren  - 懒加载子节点的异步回调函数
 *                   入参：被展开的节点行数据（TreeNode）
 *                   返回：Promise，resolve 值为子节点数组
 */
interface Props {
  title?: string
  rootData: TreeNode[]
  loadChildren: (row: TreeNode) => Promise<TreeNode[]>
}

const props = withDefaults(defineProps<Props>(), {
  title: '部件',
})

// ════════════════════════════════════════════
// 内部响应式状态
// ════════════════════════════════════════════

/** vxe-table 实例引用，可通过 tableRef.value 调用 API（如 reloadData、clearAll 等） */
const tableRef = ref<VxeTableInstance>()

/**
 * loading - 全局表格 loading 状态
 * 当前根节点数据由父组件同步传入，暂不需要异步加载根节点，
 * 保留此字段便于后续扩展（如父组件触发根节点刷新时显示加载态）
 */
const loading = ref(false)

/**
 * tableData - 表格内部数据副本
 * 从 props.rootData 展开一份拷贝，避免直接修改 prop 导致 Vue 警告。
 * vxe-table 会在此数组上附加内部状态（如 _VXE_ID、懒加载缓存等）。
 */
const tableData = ref<TreeNode[]>([...props.rootData])

/**
 * 监听 rootData 变化
 * 当父组件更新根节点列表（如刷新、重新查询）时，
 * 同步更新 tableData，使表格重新渲染。
 */
watch(
  () => props.rootData,
  (val) => {
    tableData.value = [...val]
  }
)

// ════════════════════════════════════════════
// vxe-table 配置项
// ════════════════════════════════════════════

/**
 * rowConfig - 行配置
 *   keyField: 'id' - 告知 vxe-table 使用 id 字段作为每行的唯一标识。
 *                    这对树形懒加载至关重要：vxe-table 用 keyField 追踪
 *                    哪些节点已加载过子节点，防止重复请求。
 */
const rowConfig: VxeTablePropTypes.RowConfig = {
  keyField: 'id',
}

/**
 * treeConfig - 树形配置
 *   lazy       - true：开启懒加载模式。
 *                节点子数据不在初始 data 中，而是在展开时按需加载。
 *   hasChild   - 'hasChild'：指定数据行中哪个字段标记"是否有子节点"。
 *                vxe-table 读取 row.hasChild 来决定是否显示展开箭头。
 *                true → 显示箭头（可展开）；false 或缺失 → 叶节点。
 *   line       - true：开启 vxe-table 内置的树形连线，
 *                自动在节点左侧绘制父子关系的竖线与横线，无需手写 CSS。
 *   loadMethod - 懒加载方法，vxe-table 在用户首次点击展开箭头时调用。
 *                接收 { row } 参数（当前被展开的节点），
 *                需返回 Promise<TreeNode[]>，resolve 后 vxe-table
 *                自动将结果注入为该节点的子行并触发重新渲染。
 */
const treeConfig: VxeTablePropTypes.TreeConfig = {
  lazy: true,
  hasChild: 'hasChild',
  line: true,
  loadMethod: async ({ row }: { row: TreeNode }) => {
    // 代理调用父组件传入的懒加载回调
    return await props.loadChildren(row)
  },
}
</script>

<style lang="scss" scoped>
/* ════════════════════════════════════════
   组件根容器
   - 撑满父容器的宽高（由父级 .table-card 决定实际尺寸）
   - vxe-table 的 height="100%" 依赖此容器具有确定高度
   ════════════════════════════════════════ */
.tree-table-wrapper {
  width: 100%;
  height: 100%;

  /* 覆盖 vxe-table 默认字体大小，与 Element Plus 统一 */
  :deep(.vxe-table) {
    font-size: 13px;
  }

  /* 表头列背景色：浅灰，与行内容区分层次 */
  :deep(.vxe-header--column) {
    background-color: #f5f7fa;
  }
}

/* 表头文字：加粗，深色 */
.col-header {
  font-weight: 600;
  color: #303133;
}

/* ── 节点单元格容器 ── */
.node-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;                 /* 图标与文字之间的间距 */
}

/* ════════════════════════════════════════
   节点图标
   - 固定 18×18px 的图标容器
   - 通过 BEM modifier 切换颜色：
       icon-folder    → 橙色（#f59e0b）  根节点
       icon-module    → 蓝色（#3b82f6）  第2层
       icon-operation → 青绿（#0d9488）  工序/第3层
       icon-step      → 紫色（#7c3aed）  工步/第4层
       icon-item      → 灰色（#6b7280）  叶节点
       icon-default   → 浅灰圆点（缩小为 10px）
   ════════════════════════════════════════ */
.node-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }

  &.icon-folder    { color: #f59e0b; }   /* 文件夹：琥珀橙 */
  &.icon-module    { color: #3b82f6; }   /* 模块：品牌蓝 */
  &.icon-operation { color: #0d9488; }   /* 工序：青绿色 */
  &.icon-step      { color: #7c3aed; }   /* 工步：紫色 */
  &.icon-item      { color: #6b7280; }   /* 文档：中性灰 */
  &.icon-default {                       /* 圆点兜底：缩小尺寸 */
    color: #9ca3af;
    width: 10px;
    height: 10px;
  }
}

/* ── 节点标签容器 ── */
.node-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;         /* 防止超长名称撑破布局 */
}

/* 主名称：深色加粗，超长时截断并显示省略号 */
.label-name {
  color: #1f2937;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 分隔符"·"：浅灰，不参与截断 */
.label-sep {
  color: #d1d5db;
  flex-shrink: 0;
}

/* 编号：次要灰色，略小字号 */
.label-code {
  color: #6b7280;
  font-size: 12px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* 版本徽标：蓝色文字 + 浅蓝背景边框，视觉上突出版本信息 */
.label-version {
  color: #3b82f6;
  font-size: 11px;
  white-space: nowrap;
  flex-shrink: 0;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 4px;
  padding: 0 5px;
  line-height: 18px;
}
</style>
