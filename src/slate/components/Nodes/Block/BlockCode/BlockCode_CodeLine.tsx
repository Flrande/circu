import { ReactEditor, useSlate } from "slate-react"
import type { CustomRenderElementProps } from "../../../../types/utils"
import type { BlockCode_CodeLineType } from "./types"

const BlockCode_CodeLine: React.FC<CustomRenderElementProps<BlockCode_CodeLineType>> = ({
  attributes,
  children,
  element,
}) => {
  const editor = useSlate()
  const currentNodePath = ReactEditor.findPath(editor, element)

  return (
    <div
      {...attributes}
      style={{
        margin: "8px 0",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "45px",
          color: "#a6a6a6",
          userSelect: "none",
        }}
        contentEditable={false}
      >
        <span
          style={{
            marginLeft: "24px",
          }}
        >
          {currentNodePath[currentNodePath.length - 1] + 1}
        </span>
      </span>
      {children}
    </div>
  )
}

export default BlockCode_CodeLine
