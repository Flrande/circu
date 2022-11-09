import type { BaseEditor } from "slate"
import type { ReactEditor } from "slate-react"
import type { IBlockCode } from "../components/Nodes/Block/BlockCode/types"
import type { __IBlockElementChildren, __IBlockElementContent } from "../components/Nodes/Block/BlockWrapper/types"
import type { IDivider } from "../components/Nodes/Block/Divider/types"
import type { IHead } from "../components/Nodes/Block/Head/types"
import type { IOrderedList, IUnorderedList } from "../components/Nodes/Block/List/types"
import type { IParagraph } from "../components/Nodes/Block/Paragraph/types"
import type { IQuote } from "../components/Nodes/Block/Quote/types"
import type { ITextLine } from "../components/Nodes/Block/TextLine/types"
import type { ITitle } from "../components/Nodes/Block/Title/types"
import type { IInlineCode } from "../components/Nodes/Inline/InlineCode/types"
import type { ILink } from "../components/Nodes/Inline/Link/types"
import type { ICustomText } from "../components/Nodes/Text/types"

// 有4类块级节点
// 1. 支持包含自身内容和其他块级节点, 如列表, 段落
// 2. 仅支持包含自身内容, 没有子节点块, 如代码块, 引用
// 3. 最小单位行, text-line
// 4. 标题, title
// 添加新的块级节点时更改下面三类类型即可
// 对于 __IBlockElementContent 和 __IBlockElementChildren, 表述上不将其归为块级节点

// 1类块级节点
type BaseBlockElementWithChildren = {
  type: string
  isFolded?: true
  isHidden?: true
  // __IBlockElementContent 中的子项只能为 text-line
  //TODO: 添加约束, 保证元组形式
  children: [__IBlockElementContent, __IBlockElementChildren] | [__IBlockElementContent]
}
type BlockElementWithChildrenDetector<T extends BaseBlockElementWithChildren> = T
export type BlockElementWithChildren = BlockElementWithChildrenDetector<
  IParagraph | IOrderedList | IUnorderedList | IHead
>

// 2类块级节点
type BaseBlockElementWithoutChildren = {
  type: string
  isHidden?: true
  // __IBlockElementContent 中的子项可以自定义
  children: [__IBlockElementContent<{}>]
}
type BlockElementWithoutChildrenDetector<T extends BaseBlockElementWithoutChildren> = T
export type BlockElementWithoutChildren = BlockElementWithoutChildrenDetector<IBlockCode | IQuote>

// 该类节点有一个名为"节点间隔"的部分(quote 除外), 用 data-circu-node="block-space" 标记,
// 主要用于顺滑检测鼠标水平方向对应的块级节点
// 1, 2类块级节点
export type BlockElementExceptTextLine = BlockElementWithChildren | BlockElementWithoutChildren

export type BlockElement =
  | BlockElementWithChildren // 1类
  | BlockElementWithoutChildren // 2类
  | ITextLine // 3类
  | ITitle // 4类
  | __IBlockElementContent
  | __IBlockElementChildren
export type InlineElement = IInlineCode | ILink
export type VoidElement = IDivider

export type CustomElement = BlockElement | InlineElement | VoidElement
export type CustomText = ICustomText

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
