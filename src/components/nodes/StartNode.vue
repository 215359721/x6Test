<template>
  <!-- 开始节点：绿色背景，显示流程的起始点 -->
  <div class="start-node">{{ nodeData.label || '开始' }}</div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'

// 响应式数据：存储从 X6 节点获取的数据
const nodeData = ref<{ label?: string }>({})

onMounted(() => {
  // 通过 inject 获取 getNode 函数
  // 这是 X6 提供的依赖注入，用于获取当前节点实例
  const getNode: any = inject('getNode')
  const node = getNode?.()

  if (node) {
    // 获取初始数据
    // node.data 是直接属性，包含在 FlowChart.vue 中传入的数据
    nodeData.value = node.data || {}

    // 监听数据变化
    // 当外部通过 node.setData() 更新数据时，这里会收到通知
    if (node.on) {
      node.on('change:data', ({ current }: any) => {
        nodeData.value = current
      })
    }
  }
})
</script>

<style scoped lang="scss">
.start-node {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #67c23a;      // 绿色背景，表示开始
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;             // 圆角
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.1);  // 阴影效果
}
</style>
