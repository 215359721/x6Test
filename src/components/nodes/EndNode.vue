<template>
  <div class="end-node">{{ nodeData.label || '结束' }}</div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'

const nodeData = ref<{ label?: string }>({})

onMounted(() => {
  // 通过 inject 获取 getNode 函数
  const getNode: any = inject('getNode')
  const node = getNode?.()

  if (node) {
    // 获取初始数据 - data 是直接属性
    nodeData.value = node.data || {}

    // 监听数据变化
    if (node.on) {
      node.on('change:data', ({ current }: any) => {
        nodeData.value = current
      })
    }
  }
})
</script>

<style scoped lang="scss">
.end-node {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f56c6c;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.1);
}
</style>
