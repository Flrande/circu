import type {
  BlockElementJustWithChildren,
  BlockElementWithContent,
  BlockElementWithoutTextLine,
  CustomElement,
  InlineElement,
} from "./interface"
import type { KeysUnion } from "./utils"

// 行内节点
export const INLINE_ELEMENTS: Array<InlineElement["type"]> = ["inline-code", "link"]

// 有自身内容的块级节点
export const BLOCK_ELEMENTS_WITH_CONTENT: Array<BlockElementWithContent["type"]> = [
  "paragraph",
  "block-code",
  "ordered-list",
  "unordered-list",
  "head",
]

// 仅含子节点块的块级节点
export const BLOCK_ELEMENTS_JUST_WITH_CHILDREN: Array<BlockElementJustWithChildren["type"]> = ["quote"]

// 除了 text-line 以外的块级节点
export const BLOCK_ELEMENTS_WITHOUT_TEXT_LINE: Array<BlockElementWithoutTextLine["type"]> = [
  "paragraph",
  "block-code",
  "ordered-list",
  "unordered-list",
  "head",
  "quote",
]

// 自定义元素中除了 children 以外的所有 prop, 用于转换节点类型时 unset
export const CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN: Array<Exclude<KeysUnion<CustomElement>, "children">> = [
  "headGrade",
  "indexState",
  "langKey",
  "type",
  "url",
]
