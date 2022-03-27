import type { CustomTextType } from "../components/Nodes/Text/types"
import type { InlineElement, VoidElement } from "./interface"
import type { KeysValueUnion } from "./utils"

export const INLINE_ELEMENTS: Array<Exclude<KeysValueUnion<InlineElement>, CustomTextType[]>> = ["inlineCode"]

export const VOID_ELEMENTS: Array<Exclude<KeysValueUnion<VoidElement>, CustomTextType[]>> = ["blockCode_voidArea"]
