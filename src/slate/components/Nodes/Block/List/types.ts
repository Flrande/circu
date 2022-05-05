import type { CustomText } from "../../../../types/interface"

export type IListIndentLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16

export type IOrderedList = {
  type: "orderedList"
  indentLevel: IListIndentLevel
  indexState: {
    type: "head" | "selfIncrement"
    index: number
  }
  children: CustomText[]
}

export type IUnorderedList = {
  type: "unorderedList"
  indentLevel: IListIndentLevel
  children: CustomText[]
}
