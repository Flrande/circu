import { ReactEditor, useSlate } from "slate-react"
import { SlateNode } from "../../../../types/slate"
import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IBlockCode_CodeLine } from "./types"

const BlockCode_CodeLine: React.FC<CustomRenderElementProps<IBlockCode_CodeLine>> = ({
  attributes,
  children,
  element,
}) => {
  const editor = useSlate()
  const currentNodePath = ReactEditor.findPath(editor, element)
  const parentNode = SlateNode.parent(editor, currentNodePath)

  // 序号块长度, 3位之后每多一位加16
  const serialNumberWidth =
    54 + (parentNode.children.length < 1000 ? 0 : (parentNode.children.length.toString().length - 3) * 16)

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
          width: `${serialNumberWidth}px`,
          color: "#a6a6a6",
          userSelect: "none",
          textAlign: "right",
          paddingRight: "16px",
        }}
        contentEditable={false}
      >
        {currentNodePath[currentNodePath.length - 1] + 1}
      </span>
      {children}
    </div>
  )
}

export default BlockCode_CodeLine
