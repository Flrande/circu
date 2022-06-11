import type { __IBlockElementChildren, __IBlockElementContent } from "../../../../types/interface"

export type IParagraph = {
  type: "paragraph"
  children: [__IBlockElementContent, __IBlockElementChildren] | [__IBlockElementContent]
}
