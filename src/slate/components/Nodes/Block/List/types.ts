import type { CustomText } from "../../../../types/interface"

export type IList = {
  type: "list"
  listType: "ordered" | "unordered"
  index: number | null
  children: CustomText[]
}
