import type { BaseEditor } from "slate"
import type { ReactEditor } from "slate-react"
import type {
  BlockCodeType,
  BlockCode_CodeAreaType,
  BlockCode_VoidAreaType,
} from "../components/Nodes/Block/BlockCode/types"
import type { ParagraphType } from "../components/Nodes/Block/Paragraph/types"
import type { InlineCodeType } from "../components/Nodes/Inline/InlineCode/types"
import type { CustomTextType } from "../components/Nodes/Text/types"

// Type 后缀的都是有对应组件的
export type BlockElement = ParagraphType | BlockCodeType | BlockCode_CodeAreaType | BlockCode_VoidAreaType
export type InlineElement = InlineCodeType
export type VoidElement = BlockCode_VoidAreaType

export type CustomElement = BlockElement | InlineElement
export type CustomText = CustomTextType

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
