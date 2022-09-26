/*
 * @Author: Rv_Jiang
 * @Date: 2022-05-28 09:43:23
 * @LastEditors: Rv_Jiang
 * @LastEditTime: 2022-07-15 08:28:54
 * @Description:
 * @Email: Rv_Jiang@outlook.com
 */
import vue from '@vitejs/plugin-vue'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

import {
  configAutoImportPlugin,
  configVueComponentsPlugin /* configVueIconsPlugin */,
} from './unplugin'
export function createVitePlugins(viteEnv: ViteEnv) {
  const plugins = [vue(), vueSetupExtend()]
  // vite-plugin-mock
  // VITE_USE_MOCK && plugins.push(configMockPlugin(isBuild));
  // 是否为打包后的文件提供传统浏览器兼容性支持
  // unplugin-auto-import
  plugins.push(configAutoImportPlugin())
  // unplugin-vue-components
  plugins.push(configVueComponentsPlugin())
  return plugins
}
