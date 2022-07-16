import type { CustomRenderElementProps } from "../../../../types/utils"
import type { __IBlockElementContent } from "./types"

const BlockContent: React.FC<CustomRenderElementProps<__IBlockElementContent>> = ({ attributes, children }) => {
  return (
    <div data-circu-node="block-content" {...attributes}>
      {children}
    </div>
  )
}

export default BlockContent
