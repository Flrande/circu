import type { CustomText } from "../../../../types/interface"

export type IHeadIndentLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16

export type IHeadGrade = "1" | "2" | "3" | "4" | "5" | "6"

export type IHead = {
  type: "head"
  indentLevel: IHeadIndentLevel
  // 不同于缩进层级, 标题级别的变化过程不是连续的
  headGrade: IHeadGrade
  children: CustomText[]
}
