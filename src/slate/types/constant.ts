import type {
  BlockElementJustWithChildren,
  BlockElementWithContent,
  BlockElementWithoutTextLine,
  CustomElement,
  InlineElement,
} from "./interface"
import type { KeysUnion } from "./utils"

export const INLINE_ELEMENTS: Array<InlineElement["type"]> = ["inline-code", "link"]

export const BLOCK_ELEMENTS_WITH_CONTENT: Array<BlockElementWithContent["type"]> = [
  "paragraph",
  "block-code",
  "ordered-list",
  "unordered-list",
  "head",
]

export const BLOCK_ELEMENTS_JUST_WITH_CHILDREN: Array<BlockElementJustWithChildren["type"]> = ["quote"]

export const BLOCK_ELEMENTS_WITHOUT_TEXT_LINE: Array<BlockElementWithoutTextLine["type"]> = [
  "paragraph",
  "block-code",
  "ordered-list",
  "unordered-list",
  "head",
  "quote",
]

// 用于 unset
export const CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN: Array<Exclude<KeysUnion<CustomElement>, "children">> = [
  "headGrade",
  "indexState",
  "langKey",
  "type",
  "url",
]
