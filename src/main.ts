/*
 * @Author: Rv_Jiang
 * @Date: 2022-07-15 07:46:50
 * @LastEditors: Rv_Jiang
 * @LastEditTime: 2022-09-26 10:04:54
 * @Description: main
 * @Email: Rv_Jiang@outlook.com
 */

// 解决使用unplugin-auto-import开发时VSCode出现错误提示、并且无法打包问题
import 'vue-global-api'

import { createApp } from 'vue'
import App from './App.vue'

import '@/assets/css/index.scss'

createApp(App).mount('#app')
