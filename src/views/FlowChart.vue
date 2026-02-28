<template>
  <div class="flowchart-container">
    <el-container>
      <!-- 头部标题区域 -->
      <el-header class="header">
        <h1>AntV X6 流程图 Demo</h1>
      </el-header>
      <!-- 主体内容区域 -->
      <el-main class="main">
        <!-- 工具栏：包含各种操作按钮 -->
        <div class="toolbar">
          <el-button type="primary" @click="layoutDiagram">自动布局</el-button>
          <el-button @click="centerContent">居中显示</el-button>
          <el-button @click="zoomIn">放大</el-button>
          <el-button @click="zoomOut">缩小</el-button>
          <el-button @click="exportData">导出数据</el-button>
        </div>
        <!-- X6 画布容器 -->
        <div id="x6-container" ref="containerRef" class="x6-container"></div>
      </el-main>
    </el-container>
    <!-- TeleportContainer: Vue 3 必需的容器，用于渲染自定义 Vue 节点 -->
    <TeleportContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { Graph } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
import { register, getTeleport } from '@antv/x6-vue-shape'
import type { Node } from '@antv/x6'
import { ElMessage } from 'element-plus'
import StartNode from '@/components/nodes/StartNode.vue'
import EndNode from '@/components/nodes/EndNode.vue'
import OperationNode from '@/components/nodes/OperationNode.vue'

// 获取 TeleportContainer 组件（Vue 3 自定义节点必需）
const TeleportContainer = getTeleport()

// ==================== 注册自定义节点 ====================

// 注册开始节点
register({
  shape: 'start-node',              // 节点形状的唯一标识
  component: StartNode,             // Vue 组件
  width: 120,                       // 节点默认宽度
  height: 50,                       // 节点默认高度
  ports: {
    groups: {
      right: {                      // 右侧连接点组
        position: 'right',          // 位置：右侧
        attrs: {
          circle: {                 // 连接点样式：圆形
            magnet: true,           // 可作为连接磁吸点
            stroke: '#31d0c6',      // 边框颜色
            r: 4,                   // 半径
            strokeWidth: 2,         // 边框宽度
            fill: '#fff'            // 填充颜色
          }
        }
      }
    },
    items: [                         // 实际显示的连接点
      { group: 'right' }
    ]
  }
})

// 注册结束节点
register({
  shape: 'end-node',
  component: EndNode,
  width: 120,
  height: 50,
  ports: {
    groups: {
      left: {                       // 左侧连接点组
        position: 'left',
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
      { group: 'left' }
    ]
  }
})

// 注册工序节点（中间节点）
register({
  shape: 'operation-node',
  component: OperationNode,
  width: 120,
  height: 50,
  ports: {
    groups: {
      left: {                       // 左侧连接点
        position: 'left',
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
      right: {                      // 右侧连接点
        position: 'right',
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
      { group: 'left' },
      { group: 'right' }
    ]
  }
})

// ==================== 画布初始化 ====================

const containerRef = ref<HTMLDivElement>()  // 画布容器的引用
let graph: Graph | null = null             // X6 图实例

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

/**
 * 初始化画布
 * 创建 X6 Graph 实例并配置各种选项
 */
const initGraph = () => {
  if (!containerRef.value) return

  const container = containerRef.value
  const rect = container.getBoundingClientRect()

  graph = new Graph({
    container: container,
    width: rect.width || 800,
    height: rect.height || 600,
    background: {
      color: '#f5f7fa'             // 背景色
    },
    autoResize: true,               // 自动调整大小

    // 嵌入配置
    embedding: {
      enabled: true                 // 启用嵌入功能
    },

    // 网格配置（使用 X6 原生功能）
    grid: {
      size: 10,                     // 网格大小
      visible: true,                // 是否可见
      type: 'dot',                  // 网格类型：点状
      args: {
        color: '#d0d0d0',           // 网格颜色
        thickness: 1                // 线条粗细
      }
    },

    // 平移配置
    panning: {
      enabled: true,                // 启用平移
      modifiers: 'shift'            // 按住 Shift 键平移
    },

    // 鼠标滚轮缩放配置
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta']   // 按 Ctrl/Cmd 键缩放
    },

    // 连接配置
    connecting: {
      snap: true,                   // 吸附对齐
      allowBlank: false,            // 不允许连接到空白处
      allowMulti: true,             // 允许多条边连接同一节点
      allowLoop: false,             // 不允许自环
      allowNode: true,              // 允许连接到节点
      allowEdge: false,             // 不允许连接到边
      router: {
        name: 'manhattan'           // 曼哈顿路由（正交线）
      },
      connector: {
        name: 'rounded',            // 圆角连接器
        args: {
          radius: 8                 // 圆角半径
        }
      }
    },

    // 高亮配置
    highlighting: {
      magnetAvailable: {            // 可用连接点高亮
        name: 'stroke',
        args: {
          padding: 4,
          attrs: {
            strokeWidth: 2,
            stroke: '#47a1fa'
          }
        }
      },
      magnetAdsorbed: {             // 连接点磁吸高亮
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

/**
 * 创建节点和边
 * 根据配置数据创建流程图的所有节点和连接线
 */
const createNodes = () => {
  if (!graph) return

  // 计算起始位置，使节点在画布中心附近
  const startX = 50
  const startY = 150
  const nodeSpacing = 200           // 节点之间的水平间距

  // 创建节点配置
  const nodeConfigs: Node.Metadata[] = nodes.map((node, index) => {
    // 根据节点类型确定使用的自定义形状
    let shape = 'operation-node'
    if (index === 0) {
      shape = 'start-node'          // 第一个节点是开始节点
    } else if (index === nodes.length - 1) {
      shape = 'end-node'             // 最后一个节点是结束节点
    }

    return {
      id: node.id,
      shape: shape,                  // 使用注册的自定义形状
      x: startX + index * nodeSpacing,
      y: startY,
      data: {
        label: node.label           // 传递给 Vue 组件的数据
      }
    }
  })

  // 批量添加节点到画布
  graph.addNodes(nodeConfigs)

  // 创建边（连接线）
  edges.forEach((edge) => {
    graph?.addEdge({
      source: edge.source,
      target: edge.target,
      attrs: {
        line: {
          stroke: '#a2b1c3',         // 线条颜色
          strokeWidth: 2,            // 线条宽度
          targetMarker: {            // 箭头标记
            name: 'block',           // 实心箭头
            width: 12,
            height: 8
          }
        }
      },
      zIndex: 0                      // 层级，确保边在节点下方
    })
  })
}

/**
 * 自动布局
 * 使用 Dagre 算法自动排列节点位置
 */
const layoutDiagram = () => {
  if (!graph) return

  // 获取画布尺寸
  const canvasSize = graph.getGraphArea()
  const canvasWidth = canvasSize.width || 800
  const canvasHeight = canvasSize.height || 600

  // 获取当前图的所有节点
  const nodes_list = graph.getNodes()
  const nodeCount = nodes_list.length

  // 计算节点尺寸
  const nodeSize = nodes_list[0]?.getSize() || { width: 120, height: 50 }
  const nodeWidth = nodeSize.width
  const nodeHeight = nodeSize.height

  // 动态计算间距，确保节点能适应画布宽度
  const padding = 60                 // 左右各留60px边距
  const availableWidth = canvasWidth - padding * 2
  const totalNodesWidth = nodeWidth * nodeCount
  // 间距限制在 30-50px 之间
  const nodesep = Math.max(30, Math.min(50, Math.floor((availableWidth - totalNodesWidth) / (nodeCount - 1))))

  // 准备布局数据
  const nodes_data = nodes_list.map(node => {
    const size = node.getSize()
    return {
      id: node.id,
      size: { width: size.width, height: size.height }
    }
  })

  const edges_data = graph.getEdges().map(edge => ({
    source: edge.getSourceCellId(),
    target: edge.getTargetCellId()
  }))

  // 创建 Dagre 布局实例
  const dagreLayout = new DagreLayout({
    type: 'dagre',
    rankdir: 'LR',                  // 左右布局
    nodesep: nodesep,               // 节点间距
    ranksep: 30,                    // 层级间距
    controlPoints: true             // 使用控制点
  })

  // 执行布局
  const layoutModel = dagreLayout.layout({
    nodes: nodes_data,
    edges: edges_data
  })

  // 应用布局结果到节点
  layoutModel.nodes?.forEach((nodeModel: any) => {
    const node = graph?.getCellById(nodeModel.id) as Node | undefined
    if (node && nodeModel.x !== undefined && nodeModel.y !== undefined) {
      node.setPosition(nodeModel.x, nodeModel.y)
    }
  })

  // 重置缩放并居中显示
  graph.zoomTo(1)
  graph.centerContent({ padding: 20 })
}

/**
 * 居中显示内容
 */
const centerContent = () => {
  graph?.centerContent()
}

/**
 * 放大
 */
const zoomIn = () => {
  if (graph) {
    graph.zoom(0.1)
  }
}

/**
 * 缩小
 */
const zoomOut = () => {
  if (graph) {
    graph.zoom(-0.1)
  }
}

/**
 * 导出数据到控制台
 */
const exportData = () => {
  if (!graph) return
  const data = graph.toJSON()
  console.log('流程图数据：', JSON.stringify(data, null, 2))
  ElMessage.success('数据已导出到控制台')
}

/**
 * 窗口大小变化时重新调整画布
 */
const handleResize = () => {
  if (!graph || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  graph.resize(rect.width, rect.height)
}

// ==================== 生命周期钩子 ====================

onMounted(() => {
  initGraph()                       // 初始化画布
  // 确保容器有尺寸后再创建节点
  setTimeout(() => {
    createNodes()                   // 创建节点和边
    // 初始居中显示
    setTimeout(() => {
      graph?.centerContent()
    }, 50)
  }, 100)

  window.addEventListener('resize', handleResize)  // 监听窗口大小变化
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  graph?.dispose()                  // 销毁图实例，释放资源
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
