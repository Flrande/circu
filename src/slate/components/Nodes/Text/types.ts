import type { KeysUnion } from "../../../types/utils"
import type { IBackgroundColorMap, IFontColorMap } from "./Color"

export type ICustomText = {
  text: string
  bold?: true // 加粗
  strike?: true // 删除线
  color?: {
    fontColorKey?: KeysUnion<IFontColorMap> // 字体颜色
    backgroundColorKey?: KeysUnion<IBackgroundColorMap> // 背景颜色
  }
  italic?: true // 斜体
  tokenTypes?: {
    [x: string]: true
  }
}
