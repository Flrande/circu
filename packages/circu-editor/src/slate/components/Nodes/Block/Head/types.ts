import type { __IBlockElementChildren, __IBlockElementContent } from "../BlockWrapper/types"

export type IHeadGrade = "1" | "2" | "3" | "4" | "5" | "6"

export type IHead = {
  type: "head"
  // 用于表示标题节点有没有将其他块级节点折叠
  isFold?: true
  collapsed?: true
  headGrade: IHeadGrade
  children: [__IBlockElementContent, __IBlockElementChildren] | [__IBlockElementContent]
}
