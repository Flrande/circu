import type {
  BlockElementWithChildren,
  BlockElementExceptTextLine,
  BlockElementWithoutChildren,
  CustomElement,
  InlineElement,
} from "./interface"
import type { KeysUnion } from "./utils"

// 行内节点
export const INLINE_ELEMENTS: Array<InlineElement["type"]> = ["inline-code", "link"]

// 1类块级节点, 支持包含自身内容和其他块级节点
export const BLOCK_ELEMENTS_WITH_CHILDREN: Array<BlockElementWithChildren["type"]> = [
  "paragraph",
  "ordered-list",
  "unordered-list",
  "head",
]

// 2类块级节点, 仅支持包含自身内容, 没有子节点块
export const BLOCK_ELEMENTS_WITHOUT_CHILDREN: Array<BlockElementWithoutChildren["type"]> = ["block-code", "quote"]

// 除了最小单位行以外的块级节点
export const BLOCK_ELEMENTS_EXCEPT_TEXT_LINE: Array<BlockElementExceptTextLine["type"]> = [
  "paragraph",
  "ordered-list",
  "unordered-list",
  "head",
  "block-code",
  "quote",
]

// 自定义元素中除了 children 以外的所有 prop, 用于转换节点类型时 unset
export const CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN: Array<Exclude<KeysUnion<CustomElement>, "children">> = [
  "type",
  "url",
  "indexState",
  "headGrade",
  "langKey",
]
