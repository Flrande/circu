import type { __IBlockElementChildren, __IBlockElementContent } from "../BlockWrapper/types"

export type IParagraph = {
  type: "paragraph"
  children: [__IBlockElementContent, __IBlockElementChildren] | [__IBlockElementContent]
}
