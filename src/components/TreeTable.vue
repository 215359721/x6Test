<template>
  <!--
    TreeTable.vue - 可复用树形表格组件
    =====================================
    功能：
      - 基于 vxe-table 渲染多根节点的树形表格，支持懒加载
      - 单列展示：[图标] + [名称 · 编号 · 版本]
      - 可选 checkbox 多选（showCheckbox prop 控制）
      - 单击行高亮（isCurrent）并 emit 选中节点
      - checkbox 勾选变化时 emit 全部已勾选节点数组
    Props：
      title         - 列头文字，默认"部件"
      showCheckbox  - 是否显示 checkbox 列，默认 false
      rootData      - 初始根节点数组
      loadChildren  - 懒加载回调函数
    Emits：
      checkbox-change  - checkbox 勾选变化，payload: 当前所有已勾选节点[]
      row-click        - 单击行选中，payload: 选中节点 | null
  -->
  <div class="tree-table-wrapper">

    <!--
      vxe-table 主表格
      ─────────────────────────────────────
      :checkbox-config  - checkbox 行为配置（checkStrictly 父子不联动）
      @current-change   - 单击行时触发，用于 emit row-click
      @checkbox-change  - 单个 checkbox 变化时触发
      @checkbox-all     - 全选/取消全选时触发
      两个 checkbox 事件共用同一个 handler：onCheckboxChange
    -->
    <vxe-table
      ref="tableRef"
      :data="tableData"
      :tree-config="treeConfig"
      :row-config="rowConfig"
      :checkbox-config="checkboxConfig"
      :loading="loading"
      border="inner"
      show-overflow
      height="100%"
      @current-change="onCurrentChange"
      @checkbox-change="onCheckboxChange"
      @checkbox-all="onCheckboxChange"
    >
      <!--
        checkbox 列（可选）
        ─────────────────────────────────────
        v-if="showCheckbox" - 由 prop 控制显隐，false 时不渲染此列
        type="checkbox"     - vxe 内置列类型，自动渲染勾选框及全选表头
        width="40"          - 固定宽度，恰好容纳 checkbox
      -->
      <vxe-column v-if="showCheckbox" type="checkbox" width="40" />

      <!--
        树形节点列
        ─────────────────────────────────────
        tree-node  - 声明为树形列，vxe 自动插入缩进 + 展开/折叠图标
        min-width  - 最小 300px 防止节点内容截断
      -->
      <vxe-column tree-node min-width="300">

        <!-- 列头：显示 title prop -->
        <template #header>
          <span class="col-header">{{ title }}</span>
        </template>

        <!-- 行内容：图标 + 拼接 label -->
        <template #default="{ row }">
          <span class="node-cell">

            <!-- 节点图标：根据 iconType 切换 SVG -->
            <span class="node-icon" :class="`icon-${row.iconType || 'default'}`">
              <!-- folder：文件夹（橙色）根节点 -->
              <svg v-if="row.iconType === 'folder'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"/>
              </svg>
              <!-- module：齿轮（蓝色）第2层 -->
              <svg v-else-if="row.iconType === 'module'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.3.07-.62.07-.95s-.03-.66-.07-1l2.13-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
              </svg>
              <!-- operation：扳手（青绿色）第3层 工序 -->
              <svg v-else-if="row.iconType === 'operation'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
              </svg>
              <!-- step：列表（紫色）第4层 工步 -->
              <svg v-else-if="row.iconType === 'step'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
              </svg>
              <!-- item：文档（灰色）叶节点 -->
              <svg v-else-if="row.iconType === 'item'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm0 1.5L19.5 8H14V3.5z"/>
              </svg>
              <!-- default：圆点兜底 -->
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5"/>
              </svg>
            </span>

            <!-- 节点标签：名称 · 编号 · 版本 -->
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
import { ref, watch, computed } from 'vue'
import type { VxeTableInstance, VxeTablePropTypes } from 'vxe-table'

// ── 节点数据结构（导出供父组件复用）──
export interface TreeNode {
  id: string | number
  name: string
  code: string
  version: string
  iconType?: 'folder' | 'module' | 'operation' | 'step' | 'item' | string
  hasChild?: boolean
  [key: string]: unknown
}

// ── Props ──
interface Props {
  /** 列头文字，默认"部件" */
  title?: string
  /**
   * 是否显示 checkbox 多选列，默认 false
   * true  → 渲染 checkbox 列，用户可勾选节点，触发 checkbox-change emit
   * false → 不渲染 checkbox 列
   */
  showCheckbox?: boolean
  /** 初始根节点数组 */
  rootData: TreeNode[]
  /**
   * 行高（像素），对应 vxe-table rowConfig.height
   * 不传则使用 vxe 默认行高（约 48px）
   * 常用参考值：32 紧凑 / 40 默认 / 52 宽松
   */
  rowHeight?: number
  /** 懒加载子节点回调，展开节点时调用 */
  loadChildren: (row: TreeNode) => Promise<TreeNode[]>
}

const props = withDefaults(defineProps<Props>(), {
  title: '部件',
  showCheckbox: false,
})

// ── Emits ──
const emit = defineEmits<{
  /**
   * checkbox 勾选状态变化
   * payload：当前所有已勾选的节点数组（含跨层级）
   * 通过 getCheckboxRecords() 获取，保证数据准确性
   */
  'checkbox-change': [rows: TreeNode[]]
  /**
   * 单击行选中（当前行变化）
   * payload：被选中的节点，null 表示无选中（理论上不会发生，保留兼容性）
   */
  'row-click': [row: TreeNode | null]
}>()

// ── 内部状态 ──
const tableRef = ref<VxeTableInstance>()
const loading = ref(false)
const tableData = ref<TreeNode[]>([...props.rootData])

watch(
  () => props.rootData,
  (val) => { tableData.value = [...val] }
)

// ── vxe-table 配置 ──

/**
 * rowConfig - 行配置（computed，随 rowHeight prop 响应更新）
 *   keyField   - 唯一标识字段，懒加载时防止重复请求子节点
 *   isCurrent  - true：启用"当前行"机制，单击行自动高亮并触发 current-change 事件
 *   isHover    - true：鼠标悬停时高亮当前行
 *   height     - 行高（像素），由 rowHeight prop 注入；未传时不设置，使用 vxe 默认值
 */
const rowConfig = computed<VxeTablePropTypes.RowConfig>(() => ({
  keyField: 'id',
  isCurrent: true,
  isHover: true,
  ...(props.rowHeight !== undefined ? { height: props.rowHeight } : {}),
}))

/**
 * checkboxConfig - checkbox 行为配置
 *   checkStrictly - true：父子节点勾选状态完全独立，互不影响
 *                   对懒加载树必要：子节点未加载时无法推算父节点半选状态
 */
const checkboxConfig: VxeTablePropTypes.CheckboxConfig = {
  checkStrictly: true,
}

/**
 * treeConfig - 树形配置
 *   lazy       - 开启懒加载，子节点在展开时才请求
 *   hasChild   - 指定"是否有子节点"的数据字段名
 *   line       - 启用 vxe 内置树形连线（竖线 + 横线）
 *   iconOpen   - 展开态图标 class → 减号方框 ⊟
 *   iconClose  - 折叠态图标 class → 加号方框 ⊞
 *   loadMethod - 懒加载回调，代理给父组件的 loadChildren prop
 */
const treeConfig: VxeTablePropTypes.TreeConfig = {
  lazy: true,
  hasChild: 'hasChild',
  line: true,
  loadMethod: async ({ row }: { row: TreeNode }) => {
    return await props.loadChildren(row)
  },
}

// ── 事件处理 ──

/**
 * 当前行变化（单击行触发）
 * rowConfig.isCurrent: true 生效后，vxe 在每次点击行时触发此事件
 * newValue 为新选中的行数据，emit 给父组件
 */
const onCurrentChange = ({ newValue }: { newValue: TreeNode | null }) => {
  console.group(`[TreeTable "${props.title}"] row-click`)
  console.log('选中节点:', newValue)
  console.groupEnd()
  emit('row-click', newValue)
}

/**
 * checkbox 勾选变化（单个勾选 + 全选/取消全选共用）
 * 使用 getCheckboxRecords() 而非事件参数的 records，
 * 原因：事件参数仅包含当前操作行，getCheckboxRecords() 返回全部已勾选行
 */
const onCheckboxChange = () => {
  const checked = (tableRef.value?.getCheckboxRecords() ?? []) as TreeNode[]
  console.group(`[TreeTable "${props.title}"] checkbox-change`)
  console.log('勾选数量:', checked.length)
  console.table(checked.map(r => ({ id: r.id, name: r.name, code: r.code, version: r.version })))
  console.groupEnd()
  emit('checkbox-change', checked)
}
</script>

<style lang="scss" scoped>
.tree-table-wrapper {
  width: 100%;
  height: 100%;

  :deep(.vxe-table) { font-size: 13px; }

  /* 表头背景 */
  :deep(.vxe-header--column) { background-color: #f5f7fa; }

  /*
   * 当前选中行高亮
   * vxe-table 在 isCurrent: true 时，为选中行的 <tr> 添加 row--current 类
   * 覆盖默认蓝色为更柔和的浅蓝背景
   */
  :deep(.vxe-body--row.row--current) {
    background-color: #ecf5ff;
  }
}

.col-header { font-weight: 600; color: #303133; }

.node-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.node-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg { width: 100%; height: 100%; }

  &.icon-folder    { color: #f59e0b; }
  &.icon-module    { color: #3b82f6; }
  &.icon-operation { color: #0d9488; }
  &.icon-step      { color: #7c3aed; }
  &.icon-item      { color: #6b7280; }
  &.icon-default   { color: #9ca3af; width: 10px; height: 10px; }
}

.node-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
}

.label-name {
  color: #1f2937;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.label-sep  { color: #d1d5db; flex-shrink: 0; }

.label-code { color: #6b7280; font-size: 12px; white-space: nowrap; flex-shrink: 0; }

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
