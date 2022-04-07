import { atom } from "jotai"
import type { KeysUnion } from "../../../../types/utils"
import type { backgroundColorMap, fontColorMap } from "../../../Nodes/Text/Color"

export const textColorAtom = atom<{
  fontColorKey?: KeysUnion<fontColorMap>
  backgroundColorKey?: KeysUnion<backgroundColorMap>
}>({})
