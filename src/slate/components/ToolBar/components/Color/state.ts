import { atom } from "jotai"
import type { KeysUnion } from "../../../../types/utils"
import type { IBackgroundColorMap, IFontColorMap } from "../../../Nodes/Text/Color"

// 当前选中的颜色
export const selectedColorAtom = atom<{
  fontColorKey?: KeysUnion<IFontColorMap>
  backgroundColorKey: KeysUnion<IBackgroundColorMap>
}>({
  backgroundColorKey: "gray_2",
})
