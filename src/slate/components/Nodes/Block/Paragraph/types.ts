import type { CustomText } from "../../../../types/interface"

export type IParagraphIndentLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16

export type IParagraph = {
  type: "paragraph"
  // 缩进层级, 由 Tab 键控制
  indentLevel: IParagraphIndentLevel
  children: CustomText[]
}
