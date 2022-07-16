import type { __IBlockElementChildren, __IBlockElementContent } from "../BlockWrapper/types"

export type IParagraph = {
  type: "paragraph"
  isFolded?: true
  isHidden?: true
  children: [__IBlockElementContent, __IBlockElementChildren] | [__IBlockElementContent]
}
