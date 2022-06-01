import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IBlockCode_CodeArea } from "./types"

const BlockCode_CodeArea: React.FC<CustomRenderElementProps<IBlockCode_CodeArea>> = ({ attributes, children }) => {
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
