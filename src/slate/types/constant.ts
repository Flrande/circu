import type { CustomText, InlineElement, VoidElement } from "./interface"
import type { KeysValueUnion } from "./utils"

export const INLINE_ELEMENTS: Array<Exclude<KeysValueUnion<InlineElement>, CustomText[]>> = ["inlineCode"]

export const VOID_ELEMENTS: Array<Exclude<KeysValueUnion<VoidElement>, CustomText[]>> = ["blockCode_voidArea"]
