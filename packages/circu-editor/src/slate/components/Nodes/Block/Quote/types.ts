import type { BlockElementExceptTextLine } from "../../../../types/interface"
import type { __IBlockElementChildren, __IBlockElementContent } from "../BlockWrapper/types"

export type IQuote = {
  type: "quote"
  children: [__IBlockElementContent<Exclude<BlockElementExceptTextLine, IQuote>>]
}
