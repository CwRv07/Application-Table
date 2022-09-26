/*
 * @Author: Rv_Jiang
 * @Date: 2022-07-15 08:14:37
 * @LastEditors: Rv_Jiang
 * @LastEditTime: 2022-07-15 08:15:19
 * @Description: vite-plugin-style-import
 * @Email: Rv_Jiang@outlook.com
 */

import {
  createStyleImportPlugin,
  ElementPlusResolve,
} from 'vite-plugin-style-import'
export function configStyleImportPlugin() {
  return createStyleImportPlugin({
    resolves: [ElementPlusResolve()],
  })
}
