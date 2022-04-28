import type { CustomText } from "../../../../types/interface"

//TODO: 多级列表
//TODO: 加个 Constraint?
export type IList = {
  type: "list"
  listType: "ordered" | "unordered" | "noindex"
  // 当且仅当 listType 为 ordered 时 orderedListMode, index 存在
  orderedListMode?: "head" | "selfIncrement"
  index?: number
  // 当且仅当 listType 为 ordered 且 orderedListMode 为 head 时 headIndex 存在
  headIndex?: number
  children: CustomText[]
}
