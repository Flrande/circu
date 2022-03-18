import type { BaseEditor } from "slate"
import type { ReactEditor } from "slate-react"
import type { BlockCodeType, BlockCode_CodeAreaType } from "../components/Nodes/Block/BlockCode/types"
import type { ParagraphType } from "../components/Nodes/Block/Paragraph/types"
import type { InlineCodeType } from "../components/Nodes/Inline/InlineCode/types"
import type { CustomTextType } from "../components/Nodes/Text/types"

export type BlockElementType = ParagraphType | BlockCodeType | BlockCode_CodeAreaType
export type InlineElementType = InlineCodeType

export type CustomElement = BlockElementType | InlineElementType
export type CustomText = CustomTextType

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
