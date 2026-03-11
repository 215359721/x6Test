<template>
  <!--
    DraggableTabs.vue - 跨分组可拖拽 Tab 组件
    ==========================================
    功能：
      - 两个 el-tabs 分组左右排列
      - 通过 HTML5 Drag & Drop API 将 tab 从一个分组拖入另一个
      - 拖拽目标区域高亮（蓝色边框）
      - 拖拽中的 tab 标签半透明（ghost 效果）
      - 每侧最少保留 1 个 tab，防止空组
      - drop 后自动切换目标侧 active tab 为新加入项
    Props：
      initialLeftTabs   - 左分组初始 tab 数据
      initialRightTabs  - 右分组初始 tab 数据
  -->
  <div class="dt-root">

    <!-- ══════════════════════════════════════
         左分组（Drop Zone A）
         ══════════════════════════════════════ -->
    <div
      class="dt-zone"
      :class="{ 'dt-zone--dragover': isOver('left') }"
      @dragenter="onDragEnter('left')"
      @dragleave="onDragLeave('left')"
      @dragover="onZoneDragover"
      @drop.prevent="onDrop('left')"
    >
      <!-- 分组标题栏 -->
      <div class="dt-zone-header">
        <span class="dt-zone-badge">A</span>
        <span class="dt-zone-name">分组 A</span>
        <span class="dt-zone-count">{{ leftTabs.length }} 个标签</span>
        <span v-if="isOver('left')" class="dt-zone-hint">松开以移入</span>
      </div>

      <!--
        el-tabs：通过 v-for 动态渲染 tab 列表
        每个 tab 的 #label 插槽内注入可拖拽的自定义标签
      -->
      <el-tabs v-model="leftActive" class="dt-tabs">
        <el-tab-pane
          v-for="tab in leftTabs"
          :key="tab.name"
          :name="tab.name"
        >
          <!--
            #label 插槽：渲染可拖拽标签头
            draggable="true" 开启 HTML5 原生拖拽
          -->
          <template #label>
            <span
              class="dt-tab-label"
              :class="{
                'dt-tab-label--dragging':    dragging?.tab.name === tab.name,
                'dt-tab-label--locked':      !props.allowDrag,
                'dt-tab-label--drop-before': isDropTarget(tab.name, 'left', 'before'),
                'dt-tab-label--drop-after':  isDropTarget(tab.name, 'left', 'after'),
              }"
              :draggable="props.allowDrag"
              @dragstart="onDragStart($event, tab, 'left')"
              @dragend="onDragEnd"
              @dragover.prevent="onTabDragover($event, tab, 'left')"
            >
              <!-- 拖拽把手图标（6 个点 2×3 排列） -->
              <svg class="dt-handle" viewBox="0 0 10 16" fill="currentColor">
                <circle cx="2"  cy="2"  r="1.5"/>
                <circle cx="8"  cy="2"  r="1.5"/>
                <circle cx="2"  cy="8"  r="1.5"/>
                <circle cx="8"  cy="8"  r="1.5"/>
                <circle cx="2"  cy="14" r="1.5"/>
                <circle cx="8"  cy="14" r="1.5"/>
              </svg>
              {{ tab.label }}
            </span>
          </template>

          <!-- 面板内容 -->
          <div class="dt-panel">
            <div class="dt-panel-emoji">{{ tab.emoji }}</div>
            <div class="dt-panel-body">
              <div class="dt-panel-title">{{ tab.label }}</div>
              <div class="dt-panel-desc">{{ tab.desc }}</div>
              <div class="dt-panel-tag">分组 A</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- ══════════════════════════════════════
         中间分隔线 + 双向箭头图标
         ══════════════════════════════════════ -->
    <div class="dt-separator">
      <div class="dt-sep-line"></div>
      <div class="dt-sep-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 3M21 7.5H7.5" />
        </svg>
      </div>
      <div class="dt-sep-line"></div>
    </div>

    <!-- ══════════════════════════════════════
         右分组（Drop Zone B）
         ══════════════════════════════════════ -->
    <div
      class="dt-zone"
      :class="{ 'dt-zone--dragover': isOver('right') }"
      @dragenter="onDragEnter('right')"
      @dragleave="onDragLeave('right')"
      @dragover="onZoneDragover"
      @drop.prevent="onDrop('right')"
    >
      <div class="dt-zone-header">
        <span class="dt-zone-badge dt-zone-badge--b">B</span>
        <span class="dt-zone-name">分组 B</span>
        <span class="dt-zone-count">{{ rightTabs.length }} 个标签</span>
        <span v-if="isOver('right')" class="dt-zone-hint">松开以移入</span>
      </div>

      <el-tabs v-model="rightActive" class="dt-tabs">
        <el-tab-pane
          v-for="tab in rightTabs"
          :key="tab.name"
          :name="tab.name"
        >
          <template #label>
            <span
              class="dt-tab-label"
              :class="{
                'dt-tab-label--dragging':    dragging?.tab.name === tab.name,
                'dt-tab-label--locked':      !props.allowDrag,
                'dt-tab-label--drop-before': isDropTarget(tab.name, 'right', 'before'),
                'dt-tab-label--drop-after':  isDropTarget(tab.name, 'right', 'after'),
              }"
              :draggable="props.allowDrag"
              @dragstart="onDragStart($event, tab, 'right')"
              @dragend="onDragEnd"
              @dragover.prevent="onTabDragover($event, tab, 'right')"
            >
              <svg class="dt-handle" viewBox="0 0 10 16" fill="currentColor">
                <circle cx="2"  cy="2"  r="1.5"/>
                <circle cx="8"  cy="2"  r="1.5"/>
                <circle cx="2"  cy="8"  r="1.5"/>
                <circle cx="8"  cy="8"  r="1.5"/>
                <circle cx="2"  cy="14" r="1.5"/>
                <circle cx="8"  cy="14" r="1.5"/>
              </svg>
              {{ tab.label }}
            </span>
          </template>

          <div class="dt-panel">
            <div class="dt-panel-emoji">{{ tab.emoji }}</div>
            <div class="dt-panel-body">
              <div class="dt-panel-title">{{ tab.label }}</div>
              <div class="dt-panel-desc">{{ tab.desc }}</div>
              <div class="dt-panel-tag dt-panel-tag--b">分组 B</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

// ── 导出 TabItem 供父组件构造初始数据 ──
export interface TabItem {
  name: string    // 唯一 key，用作 el-tab-pane :name
  label: string   // 标签头显示文字
  emoji: string   // 面板内容图标（emoji）
  desc: string    // 面板内容描述
}

type Side = 'left' | 'right'

interface Props {
  /** 左分组初始 tab 列表 */
  initialLeftTabs: TabItem[]
  /** 右分组初始 tab 列表 */
  initialRightTabs: TabItem[]
  /**
   * 是否允许拖拽，默认 true
   * false 时隐藏拖拽把手、禁用 draggable，不响应任何拖拽事件
   */
  allowDrag?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowDrag: true,
})

// ── 内部 tab 列表（复制 props，组件自行管理）──
const leftTabs  = ref<TabItem[]>([...props.initialLeftTabs])
const rightTabs = ref<TabItem[]>([...props.initialRightTabs])

// ── 各侧当前激活的 tab name ──
const leftActive  = ref(props.initialLeftTabs[0]?.name  ?? '')
const rightActive = ref(props.initialRightTabs[0]?.name ?? '')

// ── 当前拖拽状态 ──
const dragging   = ref<{ tab: TabItem; from: Side } | null>(null)

/**
 * dropTarget - 插入位置目标
 * 记录拖拽悬停在哪个 tab 的 before/after，用于精确定位插入点
 */
const dropTarget = ref<{ side: Side; name: string; position: 'before' | 'after' } | null>(null)

// allowDrag 切换为 false 时，中止正在进行的拖拽并清空所有状态
watch(() => props.allowDrag, (enabled) => {
  if (!enabled) {
    dragging.value    = null
    dropTarget.value  = null
    enterCounts.left  = 0
    enterCounts.right = 0
  }
})

/**
 * dragenter / dragleave 计数器
 *
 * 原理：dragenter 和 dragleave 事件会从子元素冒泡到父元素。
 * 在子元素之间移动时，进入子元素触发父元素 dragenter（count++），
 * 离开子元素时触发父元素 dragleave（count--），两者抵消。
 * 只有真正离开整个 zone 时，count 才归零。
 * 这样可以避免在子元素间移动时 drop zone 高亮闪烁。
 */
const enterCounts = reactive({ left: 0, right: 0 })

// ── 工具：获取对应侧的 tab 列表和 active ref ──
const getList   = (side: Side) => side === 'left' ? leftTabs   : rightTabs
const getActive = (side: Side) => side === 'left' ? leftActive : rightActive

/** 判断指定侧是否处于 dragover 高亮状态 */
function isOver(side: Side): boolean {
  return enterCounts[side] > 0
    && dragging.value !== null
    && dragging.value.from !== side  // 不高亮自身来源侧
}

// ── 拖拽事件处理 ──

/**
 * dragstart：记录被拖拽的 tab 及其来源侧
 * setData 是 Firefox 触发 drag 所必需的
 */
function onDragStart(e: DragEvent, tab: TabItem, from: Side) {
  dragging.value = { tab, from }
  e.dataTransfer?.setData('text/plain', tab.name)
}

/** dragend：拖拽结束（无论是否 drop 成功），重置所有状态 */
function onDragEnd() {
  dragging.value    = null
  dropTarget.value  = null
  enterCounts.left  = 0
  enterCounts.right = 0
}

function onDragEnter(side: Side) {
  enterCounts[side]++
}

function onDragLeave(side: Side) {
  enterCounts[side]--
}

/**
 * isDropTarget - 判断某 tab 是否为当前插入指示位置
 * 排除被拖拽的 tab 本身（不在自身处显示指示线）
 */
function isDropTarget(name: string, side: Side, position: 'before' | 'after'): boolean {
  return dropTarget.value?.name     === name
      && dropTarget.value?.side     === side
      && dropTarget.value?.position === position
      && dragging.value?.tab.name   !== name
}

/**
 * onTabDragover - tab 标签 dragover
 * 根据鼠标在 tab 标签的左半/右半，设置 dropTarget.position 为 before/after
 * 挂在每个 label span 上，以获取精确的元素位置
 */
function onTabDragover(e: DragEvent, tab: TabItem, side: Side) {
  if (!dragging.value || !props.allowDrag) return
  const rect     = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const position = e.clientX < rect.left + rect.width / 2 ? 'before' : 'after'
  dropTarget.value = { side, name: tab.name, position }
}

/**
 * onZoneDragover - zone 容器 dragover
 * 调用 e.preventDefault() 允许 drop；
 * 当指针悬停在 zone 空白区域（非 tab 标签子元素）时清除 dropTarget，
 * 此时 drop 将追加到列表末尾（兜底行为）
 */
function onZoneDragover(e: DragEvent) {
  e.preventDefault()
  if (e.target === e.currentTarget) {
    dropTarget.value = null
  }
}

/**
 * onDrop - 处理 tab 的移动或排序
 *
 * 场景①：同分组排序（from === to）
 *   - 必须有明确的 dropTarget，否则视为无效操作
 *   - 按 dropTarget.position 确定插入位置，位置不变时跳过
 *
 * 场景②：跨分组移动（from !== to）
 *   - 来源侧只剩 1 个 tab 时拒绝移出（防止空组）
 *   - 有 dropTarget 则按位置插入；无 dropTarget 则追加末尾
 */
function onDrop(to: Side) {
  enterCounts.left  = 0
  enterCounts.right = 0

  const done = () => { dragging.value = null; dropTarget.value = null }

  if (!dragging.value) { done(); return }

  const { tab, from } = dragging.value
  const srcList = getList(from)
  const dstList = getList(to)

  // ── 场景①：同分组排序 ──
  if (from === to) {
    if (!dropTarget.value || dropTarget.value.side !== to) { done(); return }

    const srcIdx    = srcList.value.findIndex(t => t.name === tab.name)
    const targetIdx = dstList.value.findIndex(t => t.name === dropTarget.value!.name)
    if (srcIdx === -1 || targetIdx === -1) { done(); return }

    // 计算插入下标（after 则插入目标之后）
    let insertIdx = dropTarget.value.position === 'before' ? targetIdx : targetIdx + 1
    // 移除自身后下标需后移修正
    if (insertIdx > srcIdx) insertIdx--
    // 位置无变化则跳过
    if (insertIdx === srcIdx) { done(); return }

    srcList.value.splice(srcIdx, 1)
    srcList.value.splice(insertIdx, 0, tab)
    done()
    return
  }

  // ── 场景②：跨分组移动 ──
  if (srcList.value.length <= 1) {
    ElMessage.warning('每侧至少保留 1 个标签，无法继续移出')
    done(); return
  }

  const srcIdx = srcList.value.findIndex(t => t.name === tab.name)
  if (srcIdx === -1) { done(); return }
  srcList.value.splice(srcIdx, 1)

  // 按 dropTarget 插入，无 dropTarget 则追加末尾
  if (dropTarget.value && dropTarget.value.side === to) {
    const targetIdx = dstList.value.findIndex(t => t.name === dropTarget.value!.name)
    const insertIdx = dropTarget.value.position === 'before' ? targetIdx : targetIdx + 1
    dstList.value.splice(insertIdx, 0, tab)
  } else {
    dstList.value.push(tab)
  }

  // 来源侧：被移走的是 active tab 时切换到相邻 tab
  const srcActive = getActive(from)
  if (srcActive.value === tab.name) {
    srcActive.value = srcList.value[Math.min(srcIdx, srcList.value.length - 1)]?.name ?? ''
  }
  // 目标侧：自动激活新移入的 tab
  getActive(to).value = tab.name

  done()
}
</script>

<style lang="scss" scoped>
/* 根容器：水平 flex，高度撑满父元素 */
.dt-root {
  display: flex;
  align-items: stretch;
  gap: 0;
  height: 100%;
}

/* ════════════════════════════════════════
   分组卡片（Zone）
   ════════════════════════════════════════ */
.dt-zone {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  border: 2px solid transparent;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  /* 拖拽悬停高亮：蓝色边框 + 外发光 */
  &--dragover {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
  }
}

/* ── 分组标题栏 ── */
.dt-zone-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #fafafa;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.dt-zone-badge {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #3b82f6;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &--b { background: #10b981; }
}

.dt-zone-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.dt-zone-count {
  font-size: 12px;
  color: #9ca3af;
  margin-left: 2px;
}

.dt-zone-hint {
  margin-left: auto;
  font-size: 12px;
  color: #3b82f6;
  font-weight: 500;
  animation: hint-pulse 0.8s ease-in-out infinite alternate;
}

@keyframes hint-pulse {
  from { opacity: 0.6; }
  to   { opacity: 1; }
}

/* ── el-tabs 撑满剩余高度 ── */
.dt-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;

  :deep(.el-tabs__header) { flex-shrink: 0; margin: 0; }

  :deep(.el-tabs__content) {
    flex: 1;
    overflow-y: auto;
  }

  :deep(.el-tab-pane) { height: 100%; }
}

/* ── 可拖拽的 tab 标签头 ── */
.dt-tab-label {
  position: relative;  /* 供插入指示线伪元素定位 */
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: grab;
  user-select: none;
  padding: 2px 3px;  /* 左右留 3px 给指示线 */

  &:active { cursor: grabbing; }

  /* 正在被拖拽中的 tab 变半透明（ghost 效果） */
  &--dragging { opacity: 0.35; }

  /* 拖拽禁用状态：默认光标，隐藏把手图标 */
  &--locked {
    cursor: default;
    &:active { cursor: default; }
    .dt-handle { display: none; }
  }

  /* 插入位置指示线 - 左侧（before） */
  &--drop-before::before {
    content: '';
    position: absolute;
    left: -1px;
    top: 1px;
    bottom: 1px;
    width: 2px;
    background: #3b82f6;
    border-radius: 1px;
  }

  /* 插入位置指示线 - 右侧（after） */
  &--drop-after::after {
    content: '';
    position: absolute;
    right: -1px;
    top: 1px;
    bottom: 1px;
    width: 2px;
    background: #3b82f6;
    border-radius: 1px;
  }
}

/* 拖拽把手图标 */
.dt-handle {
  width: 10px;
  height: 14px;
  color: #d1d5db;
  flex-shrink: 0;
  transition: color 0.15s;

  .dt-tab-label:hover & { color: #9ca3af; }
}

/* ── 面板内容 ── */
.dt-panel {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px 20px;
}

.dt-panel-emoji {
  font-size: 36px;
  line-height: 1;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.dt-panel-body {
  flex: 1;
}

.dt-panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.dt-panel-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 12px;
}

.dt-panel-tag {
  display: inline-block;
  font-size: 11px;
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 4px;
  padding: 2px 8px;

  &--b {
    color: #10b981;
    background: #ecfdf5;
    border-color: #a7f3d0;
  }
}

/* ════════════════════════════════════════
   中间分隔符
   ════════════════════════════════════════ */
.dt-separator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 8px;
  flex-shrink: 0;
}

.dt-sep-line {
  flex: 1;
  width: 1px;
  background: #e4e7ed;
}

.dt-sep-icon {
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border-radius: 50%;
  border: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 15px;
    height: 15px;
    color: #9ca3af;
  }
}
</style>
