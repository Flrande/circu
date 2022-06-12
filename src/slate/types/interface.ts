import type { BaseEditor } from "slate"
import type { ReactEditor } from "slate-react"
import type { IBlockCode } from "../components/Nodes/Block/BlockCode/types"
import type { __IBlockElementChildren, __IBlockElementContent } from "../components/Nodes/Block/BlockWrapper/types"
import type { IHead } from "../components/Nodes/Block/Head/types"
import type { IOrderedList, IUnorderedList } from "../components/Nodes/Block/List/types"
import type { IParagraph } from "../components/Nodes/Block/Paragraph/types"
import type { IQuote } from "../components/Nodes/Block/Quote/types"
import type { ITextLine } from "../components/Nodes/Block/TextLine/types"
import type { IInlineCode } from "../components/Nodes/Inline/InlineCode/types"
import type { ILink } from "../components/Nodes/Inline/Link/types"
import type { ICustomText } from "../components/Nodes/Text/types"

// 有四类块级节点
// 1. 支持包含自身内容和其他块级节点, 如列表, 段落
// 2. 仅支持包含自身内容, 如代码块
// 3. 仅支持包含其他块级节点
// 4. text-line

// 1, 2类基础接口, 即实现了该接口的才是1, 2类
type BaseBlockElementWithContent = {
  type: string
  children: [__IBlockElementContent, __IBlockElementChildren] | [__IBlockElementContent]
}
// 3类基础接口, 即实现了该接口的才是3类
type BaseBlockElementJustWithChildren = {
  type: string
  children: [__IBlockElementChildren]
}

// 添加新的块级节点时更改这三个类型即可
// 1, 2类块级节点
export type BlockElementWithContent = IParagraph | IBlockCode | IOrderedList | IUnorderedList | IHead
// 3类块级节点
export type BlockElementJustWithChildren = IQuote
// 1, 2, 3类块级节点
export type BlockElementWithoutTextLine = BlockElementWithContent | BlockElementJustWithChildren

// 一个用于检测块级节点接口是否合乎要求的工具类型
type BlockElementDetector<T extends BaseBlockElementWithContent | BaseBlockElementJustWithChildren | ITextLine> = T

export type BlockElement =
  | BlockElementDetector<BlockElementWithoutTextLine | ITextLine>
  | __IBlockElementContent
  | __IBlockElementChildren
export type InlineElement = IInlineCode | ILink

export type CustomElement = BlockElement | InlineElement
export type CustomText = ICustomText

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
