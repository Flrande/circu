import type { ParagraphType } from "../Paragraph/types"

export type BlockCodeInternalElement = ParagraphType

export type BlockCodeType = {
  type: "blockCode"
  lang: "PlainText" | "Javascript"
  children: BlockCodeInternalElement[]
}
