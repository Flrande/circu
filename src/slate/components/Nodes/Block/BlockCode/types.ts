import type { KeysUnion } from "../../../../types/utils"
import type { CustomTextType } from "../../Text/types"
import type { ParagraphType } from "../Paragraph/types"

// [显示格式] - [Prism 对应 key string] (PlainText 为特例)
export type CodeAreaLangMap = {
  PlainText: "plainText"
  Javascript: "javascript"
}

export type BlockCode_CodeAreaType = {
  type: "blockCode_codeArea"
  lang: KeysUnion<CodeAreaLangMap>
  children: ParagraphType[]
}

export type BlockCode_VoidAreaType = {
  type: "blockCode_voidArea"
  children: CustomTextType[]
}

export type BlockCodeType = {
  type: "blockCode"
  // 需遵循 VoidArea - CodeArea - VoidArea
  children: (BlockCode_CodeAreaType | BlockCode_VoidAreaType)[]
}
