import type { CustomRenderElementProps } from "../../../../types/utils"
import type { BlockCode_CodeAreaType } from "./types"

const BlockCode_CodeArea: React.FC<CustomRenderElementProps<BlockCode_CodeAreaType>> = ({ attributes, children }) => {
  return (
    <div
      {...attributes}
      style={{
        width: "100%",
      }}
    >
      {children}
    </div>
  )
}

export default BlockCode_CodeArea
