import { ReactEditor, useSlate } from "slate-react"
import type { CustomRenderElementProps } from "../../../../types/utils"
import type { BlockCode_VoidAreaType } from "./types"

const BlockCode_VoidArea: React.FC<CustomRenderElementProps<BlockCode_VoidAreaType>> = ({
  attributes,
  children,
  element,
}) => {
  const editor = useSlate()
  const currentNodePath = ReactEditor.findPath(editor, element)

  let style: React.CSSProperties = {}
  // 判断 voidArea 是左边还是右边
  if (currentNodePath[currentNodePath.length - 1] === 0) {
    style = {
      transform: "translate(-15px, -10px)",
    }
  } else {
    style = {
      transform: "translate(6px, -10px)",
    }
  }

  return (
    <div {...attributes} style={style}>
      {children}
    </div>
  )
}

export default BlockCode_VoidArea
