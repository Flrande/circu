import type { KeysUnion } from "../../../types/utils"
import type { backgroundColorMap, fontColorMap } from "./Color"

export type ICustomText = {
  text: string
  bold?: true // 加粗
  strike?: true // 删除线
  color?: {
    fontColorKey?: KeysUnion<fontColorMap> // 字体颜色
    backgroundColorKey?: KeysUnion<backgroundColorMap> // 背景颜色
  }
  tokenTypes?: {
    [x: string]: true
  }
}
