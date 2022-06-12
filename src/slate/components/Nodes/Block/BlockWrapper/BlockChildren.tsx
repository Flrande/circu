import type { CustomRenderElementProps } from "../../../../types/utils"
import type { __IBlockElementChildren } from "./types"

const BlockChildren: React.FC<CustomRenderElementProps<__IBlockElementChildren>> = ({ attributes, children }) => {
  return (
    <div
      {...attributes}
      style={{
        paddingLeft: "25px",
      }}
    >
      {children}
    </div>
  )
}

export default BlockChildren
