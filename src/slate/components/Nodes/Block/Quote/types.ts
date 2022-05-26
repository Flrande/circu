import type { CustomText } from "../../../../types/interface"

export type IQuote_LineIndentLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16

//TODO: Tab 缩进支持
export type IQuote_Line = {
  type: "quote_line"
  indentLevel: IQuote_LineIndentLevel
  children: CustomText[]
}

//TODO: 行首删除时解除引用样式
export type IQuote = {
  type: "quote"
  children: IQuote_Line[]
}
