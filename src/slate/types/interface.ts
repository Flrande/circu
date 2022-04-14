import type { BaseEditor } from "slate"
import type { ReactEditor } from "slate-react"
import type {
  IBlockCode,
  IBlockCode_CodeArea,
  IBlockCode_CodeLine,
  IBlockCode_VoidArea,
} from "../components/Nodes/Block/BlockCode/types"
import type { IParagraph } from "../components/Nodes/Block/Paragraph/types"
import type { IInlineCode } from "../components/Nodes/Inline/InlineCode/types"
import type { ILink } from "../components/Nodes/Inline/Link/types"
import type { ICustomText } from "../components/Nodes/Text/types"

export type BlockElement = IParagraph | IBlockCode | IBlockCode_CodeArea | IBlockCode_VoidArea | IBlockCode_CodeLine
export type InlineElement = IInlineCode | ILink
export type VoidElement = IBlockCode_VoidArea

export type CustomElement = BlockElement | InlineElement
export type CustomText = ICustomText

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
