import { atom } from "jotai"
import type { KeysUnion } from "../../../../types/utils"
import type { IBackgroundColorMap, IFontColorMap } from "../../../Nodes/Text/Color"

export const textColorAtom = atom<{
  fontColorKey?: KeysUnion<IFontColorMap>
  backgroundColorKey?: KeysUnion<IBackgroundColorMap>
}>({})
