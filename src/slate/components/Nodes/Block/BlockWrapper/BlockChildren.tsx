import type { __IBlockElementChildren } from "../../../../types/interface"
import type { CustomRenderElementProps } from "../../../../types/utils"

const BlockChildren: React.FC<CustomRenderElementProps<__IBlockElementChildren>> = ({ attributes, children }) => {
  return <div {...attributes}>{children}</div>
}

export default BlockChildren
