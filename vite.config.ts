/*
 * @Author: Rv_Jiang
 * @Date: 2022-07-15 07:46:50
 * @LastEditors: Rv_Jiang
 * @LastEditTime: 2022-09-25 19:36:54
 * @Description:
 * @Email: Rv_Jiang@outlook.com
 */

import { UserConfig, loadEnv, ConfigEnv } from 'vite'
import path from 'path'
import { wrapperEnv } from './config/utils'

import { createVitePlugins, createViteServer, createViteBuild } from './config'
// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build'
  const env = loadEnv(mode, process.cwd())
  const viteEnv = wrapperEnv(env)
  const { VITE_PUBLIC_PATH } = viteEnv
  return {
    base: VITE_PUBLIC_PATH,
    plugins: createVitePlugins(viteEnv),
    server: createViteServer(viteEnv),
    build: createViteBuild(isBuild),
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
  }
}
