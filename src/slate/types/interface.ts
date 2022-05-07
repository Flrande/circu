import type { BaseEditor } from "slate"
import type { ReactEditor } from "slate-react"
import type {
  IBlockCode,
  IBlockCode_CodeArea,
  IBlockCode_CodeLine,
  IBlockCode_VoidArea,
} from "../components/Nodes/Block/BlockCode/types"
import type { IHead } from "../components/Nodes/Block/Head/types"
import type { IOrderedList, IUnorderedList } from "../components/Nodes/Block/List/types"
import type { IParagraph } from "../components/Nodes/Block/Paragraph/types"
import type { IInlineCode } from "../components/Nodes/Inline/InlineCode/types"
import type { ILink } from "../components/Nodes/Inline/Link/types"
import type { ICustomText } from "../components/Nodes/Text/types"

export type BlockElement =
  | IParagraph
  | IBlockCode
  | IBlockCode_CodeArea
  | IBlockCode_VoidArea
  | IBlockCode_CodeLine
  | IOrderedList
  | IUnorderedList
  | IHead
export type InlineElement = IInlineCode | ILink
export type VoidElement = IBlockCode_VoidArea
// 段落型元素, 结构上和 Paragraph 相近, 观感上占 "一行"
export type ParagraphTypeElement = IParagraph | IOrderedList | IUnorderedList | IBlockCode_CodeLine | IHead
// 缩进型元素, 段落型元素的子集, 可产生缩进, 各元素支持的缩进级别有区别
export type IndentTypeElement = IParagraph | IOrderedList | IUnorderedList | IHead

export type CustomElement = BlockElement | InlineElement
export type CustomText = ICustomText

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
