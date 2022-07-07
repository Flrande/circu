import { ReactEditor, useSlateStatic } from "slate-react"
import type { CustomRenderElementProps } from "../../../../types/utils"
import { calculateIndentLevel } from "../BlockWrapper/indentHelper"
import { unorderedListSymbol } from "./List.css"
import type { IUnorderedList } from "./types"

const UnorderedList: React.FC<CustomRenderElementProps<IUnorderedList>> = ({ attributes, children, element }) => {
  const editor = useSlateStatic()

  const indentLevel = calculateIndentLevel(editor, ReactEditor.findPath(editor, element))
  const indexSymbol = indentLevel % 3 === 1 ? "\u2022" : indentLevel % 3 === 2 ? "\u25E6" : "\u25AA"

  return (
    <div
      {...attributes}
      style={{
        margin: "8px 0",
      }}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        <span contentEditable={false} className={unorderedListSymbol}>
          {indexSymbol}
        </span>
        <span
          style={{
            minWidth: "0",
          }}
        >
          {children}
        </span>
      </div>
    </div>
  )
}

export default UnorderedList
