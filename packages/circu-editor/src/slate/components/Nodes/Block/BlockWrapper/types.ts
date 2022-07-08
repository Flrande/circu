import type { BlockElementExceptTextLine } from "../../../../types/interface"
import type { ITextLine } from "../TextLine/types"

// 容纳块级节点本身的内容
export type __IBlockElementContent<T = ITextLine> = {
  type: "__block-element-content"
  children: T[]
}

// 子节点块, 容纳其他块级节点, 用于实现排版缩进
export type __IBlockElementChildren = {
  type: "__block-element-children"
  children: BlockElementExceptTextLine[]
}
