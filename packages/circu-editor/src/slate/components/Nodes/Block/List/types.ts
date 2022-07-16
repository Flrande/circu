import type { __IBlockElementChildren, __IBlockElementContent } from "../BlockWrapper/types"

export type IOrderedList = {
  type: "ordered-list"
  isFolded?: true
  isHidden?: true
  indexState: {
    type: "head" | "selfIncrement"
    index: number
  }
  children: [__IBlockElementContent, __IBlockElementChildren] | [__IBlockElementContent]
}

export type IUnorderedList = {
  type: "unordered-list"
  isFolded?: true
  isHidden?: true
  children: [__IBlockElementContent, __IBlockElementChildren] | [__IBlockElementContent]
}
