import type { CustomText } from "../../../../types/interface"

export type ILink = {
  type: "link"
  url: string
  children: CustomText[]
}
