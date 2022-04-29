import type { CustomText } from "../../../../types/interface"

//TODO: 多级列表
export type IOrderedList = {
  type: "orderedList"
  listLevel: 1 | 2 | 3
  indexState:
    | {
        type: "head" | "selfIncrement"
        index: number
      }
    | {
        type: "noIndex"
      }
  children: CustomText[]
}

export type IUnorderedList = {
  type: "unorderedList"
  listLevel: 1 | 2 | 3
  indexState: "active" | "noIndex"
  children: CustomText[]
}
