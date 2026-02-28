<template>
  <div class="process-node">{{ nodeData.label || '工序' }}</div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import type { Node } from '@antv/x6'

const getNode = () => inject<Node>('getNode')
const nodeData = ref<{ label?: string }>({})

onMounted(() => {
  const node = getNode?.()
  if (node) {
    // 获取初始数据
    const data = node.getData()
    nodeData.value = data || {}

    // 监听数据变化
    node.on('change:data', ({ current }) => {
      nodeData.value = current
    })
  }
})
</script>

<style scoped lang="scss">
.process-node {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.1);
}
</style>
