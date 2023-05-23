import {
  defineConfig,
  presetUno,
  presetIcons,
  presetAttributify,
} from 'unocss'
import { loadKylinConfig } from './scripts/config'
import { dynamicSafelistPlugin } from './scripts/unocss/dynamicSafelistPlugin'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetAttributify(),
  ] as any,
  safelist: [
    // FLAG: 根据 开发者传入的 preset 进行 safelist 的配置
    // kylinConfig,
    ...dynamicSafelistPlugin(loadKylinConfig()),
  ],
})
