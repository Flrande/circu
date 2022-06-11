import type { __IBlockElementContent } from "../../../../types/interface"
import type { CustomRenderElementProps } from "../../../../types/utils"

const BlockContent: React.FC<CustomRenderElementProps<__IBlockElementContent>> = ({ attributes, children }) => {
  return <div {...attributes}>{children}</div>
}

export default BlockContent
