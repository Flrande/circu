import { atom } from "jotai"
import type { KeysUnion } from "../../../../types/utils"
import type { IBackgroundColorMap, IFontColorMap } from "../../../Nodes/Text/Color"

// colorBar 当前选中的颜色
export const selectedColorAtom = atom<{
  fontColorKey?: Exclude<KeysUnion<IFontColorMap>, "initialWhite">
  backgroundColorKey?: KeysUnion<IBackgroundColorMap>
}>({
  backgroundColorKey: "gray_2",
})

// 记录最近一次选中的颜色
export const buttonColorAtom = atom<{
  fontColorKey: KeysUnion<IFontColorMap>
  backgroundColorKey: KeysUnion<IBackgroundColorMap>
}>((get) => {
  const currentSelectedColor = get(selectedColorAtom)
  let result: {
    fontColorKey: KeysUnion<IFontColorMap>
    backgroundColorKey: KeysUnion<IBackgroundColorMap>
  } = {
    fontColorKey: "initialWhite",
    backgroundColorKey: "gray_2",
  }
  if (currentSelectedColor.fontColorKey) {
    result.fontColorKey = currentSelectedColor.fontColorKey
  }
  if (currentSelectedColor.backgroundColorKey) {
    result.backgroundColorKey = currentSelectedColor.backgroundColorKey
  }

  return result
})

export const isColorBarActiveAtom = atom(false)
