import type { ParagraphType } from "../Paragraph/types"

type CodeArea = {
  type: "blockCode_codeArea"
  children: ParagraphType[]
}

export type BlockCodeType = {
  type: "blockCode"
  lang: "PlainText" | "Javascript"
  //TODO: 扩展 Constraints
  // 只能有一个 CodeArea
  children: (CodeArea | ParagraphType)[]
}

export type BlockCode_CodeAreaType = CodeArea
