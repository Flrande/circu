import { atom } from "jotai"
import type { KeysUnion } from "../../../../types/utils"
import type { IBackgroundColorMap, IFontColorMap } from "../../../Nodes/Text/Color"

//TODO: 通过 jotai 相关 api 将逻辑写一块?
// colorBar 当前选中的颜色
export const selectedColorAtom = atom<{
  fontColorKey?: Exclude<KeysUnion<IFontColorMap>, "initialWhite">
  backgroundColorKey?: KeysUnion<IBackgroundColorMap>
}>({
  backgroundColorKey: "gray_2",
})

// 记录最近一次选中的颜色, 与 selectedColor 独立
export const buttonColorAtom = atom<{
  fontColorKey: KeysUnion<IFontColorMap>
  backgroundColorKey: KeysUnion<IBackgroundColorMap>
}>({
  fontColorKey: "initialWhite",
  backgroundColorKey: "gray_2",
})

export const isColorBarActiveAtom = atom(false)
