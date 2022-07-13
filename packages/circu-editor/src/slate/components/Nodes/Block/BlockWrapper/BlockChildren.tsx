import { Editor } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import { SlateElement } from "../../../../types/slate"
import type { CustomRenderElementProps } from "../../../../types/utils"
import type { __IBlockElementChildren } from "./types"

const BlockChildren: React.FC<CustomRenderElementProps<__IBlockElementChildren>> = ({
  attributes,
  children,
  element,
}) => {
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)
  const [parentNode] = Editor.parent(editor, path)

  return (
    <div
      {...attributes}
      style={{
        paddingLeft:
          SlateElement.isElement(parentNode) &&
          (parentNode.type === "ordered-list" || parentNode.type === "unordered-list")
            ? undefined
            : "25px",
      }}
    >
      {children}
    </div>
  )
}

export default BlockChildren
