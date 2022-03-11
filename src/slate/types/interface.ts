import type { BaseEditor } from "slate"
import type { ReactEditor } from "slate-react"
import type { BlockCodeType } from "../components/Nodes/Block/BlockCode/types"
import type { ParagraphType } from "../components/Nodes/Block/Paragraph/types"
import type { InlineCodeType } from "../components/Nodes/Inline/InlineCode/types"
import type { CustomTextType } from "../components/Nodes/Text/types"

export type BlockElement = ParagraphType | BlockCodeType
export type InlineElement = InlineCodeType

export type CustomElement = BlockElement | InlineElement
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomTextType
  }
}
