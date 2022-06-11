import type { ICustomText } from "../../Text/types"

export type ITextLine = {
  type: "text-line"
  children: ICustomText[]
}
