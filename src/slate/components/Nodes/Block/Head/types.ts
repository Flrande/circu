import type { __IBlockElementChildren, __IBlockElementContent } from "../../../../types/interface"

export type IHeadGrade = "1" | "2" | "3" | "4" | "5" | "6"

export type IHead = {
  type: "head"
  headGrade: IHeadGrade
  children: [__IBlockElementContent, __IBlockElementChildren] | [__IBlockElementContent]
}
