import { useSelected } from "slate-react"
import type { CustomRenderElementProps } from "../../../../types/utils"
import { BlockCodeConntainer } from "./BlockCode.css"
import type { BlockCodeType } from "./types"

const BlockCode: React.FC<CustomRenderElementProps<BlockCodeType>> = ({ attributes, children, element }) => {
  const isSelected = useSelected()

  return (
    <div
      {...attributes}
      style={{
        border: isSelected ? "1px solid #5a87f7" : undefined,
      }}
      className={BlockCodeConntainer}
    >
      {children}
    </div>
  )
}

export default BlockCode
