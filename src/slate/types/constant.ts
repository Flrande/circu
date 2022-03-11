import type { CustomTextType } from "../components/Nodes/Text/types"
import type { InlineElement } from "./interface"
import type { KeysValueUnion } from "./utils"

export const INLINE_TYPES: Array<Exclude<KeysValueUnion<InlineElement>, CustomTextType[]>> = ["inlineCode"]
