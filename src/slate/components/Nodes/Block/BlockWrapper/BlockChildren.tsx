import type { CustomRenderElementProps } from "../../../../types/utils"
import type { __IBlockElementChildren } from "./types"

const BlockChildren: React.FC<CustomRenderElementProps<__IBlockElementChildren>> = ({
  attributes,
  children,
  element,
}) => {
  return (
    <div
      {...attributes}
      style={{
        paddingLeft: "25px",
        display: element.collapsed ? "none" : undefined,
      }}
    >
      {children}
    </div>
  )
}

export default BlockChildren
