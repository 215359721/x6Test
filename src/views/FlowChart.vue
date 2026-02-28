<template>
  <div class="flowchart-container">
    <el-container>
      <el-header class="header">
        <h1>AntV X6 流程图 Demo1</h1>
      </el-header>
      <el-main class="main">
        <div class="toolbar">
          <el-button type="primary" @click="layoutDiagram">自动布局</el-button>
          <el-button @click="centerContent">居中显示</el-button>
          <el-button @click="zoomIn">放大</el-button>
          <el-button @click="zoomOut">缩小</el-button>
          <el-button @click="exportData">导出数据</el-button>
        </div>
        <div id="x6-container" ref="containerRef" class="x6-container"></div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { Graph } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
import type { Node } from '@antv/x6'
import { ElMessage } from 'element-plus'

const containerRef = ref<HTMLDivElement>()
let graph: Graph | null = null

// 节点数据定义
const nodes = [
  { id: 'start', label: '开始' },
  { id: 'process-1', label: '工序-1' },
  { id: 'process-2', label: '工序-2' },
  { id: 'process-3', label: '工序-3' },
  { id: 'process-4', label: '工序-4' },
  { id: 'end', label: '结束' }
]

// 边数据定义（首尾连接）
const edges = [
  { source: 'start', target: 'process-1' },
  { source: 'process-1', target: 'process-2' },
  { source: 'process-2', target: 'process-3' },
  { source: 'process-3', target: 'process-4' },
  { source: 'process-4', target: 'end' }
]

// 初始化画布
const initGraph = () => {
  if (!containerRef.value) return

  const container = containerRef.value
  const rect = container.getBoundingClientRect()

  graph = new Graph({
    container: container,
    width: rect.width || 800,
    height: rect.height || 600,
    background: {
      color: '#f5f7fa'
    },
    autoResize: true,
    embedding: {
      enabled: true
    },
    grid: {
      size: 10,
      visible: true,
      type: 'dot',
      args: {
        color: '#d0d0d0',
        thickness: 1
      }
    },
    panning: {
      enabled: true,
      modifiers: 'shift'
    },
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta']
    },
    connecting: {
      snap: true,
      allowBlank: false,
      allowMulti: true,
      allowLoop: false,
      allowNode: true,
      allowEdge: false,
      router: {
        name: 'manhattan'
      },
      connector: {
        name: 'rounded',
        args: {
          radius: 8
        }
      }
    },
    highlighting: {
      magnetAvailable: {
        name: 'stroke',
        args: {
          padding: 4,
          attrs: {
            strokeWidth: 2,
            stroke: '#47a1fa'
          }
        }
      },
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#fff',
            stroke: '#31d0c6'
          }
        }
      }
    }
  })
}

// 创建节点
const createNodes = () => {
  if (!graph) return

  // 计算起始位置，使节点在画布中心附近
  const startX = 50
  const startY = 150
  const nodeSpacing = 150

  const nodeConfigs: Node.Metadata[] = nodes.map((node, index) => ({
    id: node.id,
    shape: 'rect',
    x: startX + index * nodeSpacing,
    y: startY,
    width: 120,
    height: 50,
    label: node.label,
    attrs: {
      body: {
        fill: index === 0 ? '#67c23a' : index === nodes.length - 1 ? '#f56c6c' : '#409eff',
        stroke: '#fff',
        strokeWidth: 2,
        rx: 8,
        ry: 8,
        filter: {
          name: 'dropShadow',
          args: {
            dx: 2,
            dy: 2,
            blur: 3
          }
        }
      },
      label: {
        fill: '#fff',
        fontSize: 14,
        fontWeight: 500
      }
    },
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#31d0c6',
              r: 4,
              strokeWidth: 2,
              fill: '#fff'
            }
          }
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#31d0c6',
              r: 4,
              strokeWidth: 2,
              fill: '#fff'
            }
          }
        }
      },
      items: [
        { group: 'top' },
        { group: 'bottom' }
      ]
    }
  }))

  graph.addNodes(nodeConfigs)

  // 创建边（连接）
  edges.forEach((edge) => {
    graph?.addEdge({
      source: edge.source,
      target: edge.target,
      attrs: {
        line: {
          stroke: '#a2b1c3',
          strokeWidth: 2,
          targetMarker: {
            name: 'block',
            width: 12,
            height: 8
          }
        }
      },
      zIndex: 0
    })
  })
}

// 自动布局
const layoutDiagram = () => {
  if (!graph) return

  const dagreLayout = new DagreLayout({
    type: 'dagre',
    rankdir: 'LR',
    align: 'UL',
    nodesep: 50,
    ranksep: 80,
    controlPoints: true
  })

  const model = dagreLayout.layout(graph.toJSON())
  graph.fromJSON(model)
  graph.centerContent()
}

// 居中显示
const centerContent = () => {
  graph?.centerContent()
}

// 放大
const zoomIn = () => {
  if (graph) {
    graph.zoom(0.1)
  }
}

// 缩小
const zoomOut = () => {
  if (graph) {
    graph.zoom(-0.1)
  }
}

// 导出数据
const exportData = () => {
  if (!graph) return
  const data = graph.toJSON()
  console.log('流程图数据：', JSON.stringify(data, null, 2))
  ElMessage.success('数据已导出到控制台')
}

// 窗口大小变化时重新调整画布
const handleResize = () => {
  if (!graph || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  graph.resize(rect.width, rect.height)
}

onMounted(() => {
  initGraph()
  // 确保容器有尺寸后再创建节点
  setTimeout(() => {
    createNodes()
    // 初始居中显示
    setTimeout(() => {
      graph?.centerContent()
    }, 50)
  }, 100)

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  graph?.dispose()
})
</script>

<style lang="scss" scoped>
.flowchart-container {
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;

  .header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    h1 {
      margin: 0;
      color: #333;
      font-size: 20px;
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
  }

  .toolbar {
    display: flex;
    gap: 10px;
    padding: 16px 20px;
    background-color: #fff;
    border-bottom: 1px solid #e4e7ed;
  }

  .x6-container {
    flex: 1;
    width: 100%;
    height: 100%;
    min-height: 500px;
    overflow: hidden;
    position: relative;
  }
}
</style>
