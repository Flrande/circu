import type { CustomTextType } from "../components/Nodes/Text/types"
import type { InlineElementType } from "./interface"
import type { KeysValueUnion } from "./utils"

export const INLINE_TYPES: Array<Exclude<KeysValueUnion<InlineElementType>, CustomTextType[]>> = ["inlineCode"]
