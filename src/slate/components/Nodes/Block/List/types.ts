import type { CustomText } from "../../../../types/interface"

export type IList = {
  type: "list"
  listType: "ordered" | "unordered"
  // 仅在 listType 为 ordered 时 index 才有用
  index: number
  children: CustomText[]
}
