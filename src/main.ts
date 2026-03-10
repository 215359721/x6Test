import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import VxeTable from 'vxe-table'
import 'vxe-table/lib/style.css'
import router from './router'
import App from './App.vue'
import './styles/main.scss'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(VxeUI)
app.use(VxeTable)

app.use(router)

app.mount('#app')
