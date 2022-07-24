import { ReactEditor, useSlateStatic } from "slate-react"
import type { CustomRenderElementProps } from "../../../../types/utils"
import { calculateIndentLevel } from "../BlockWrapper/indentHelper"
import type { IUnorderedList } from "./types"

const UnorderedList: React.FC<CustomRenderElementProps<IUnorderedList>> = ({ attributes, children, element }) => {
  const editor = useSlateStatic()

  const indentLevel = calculateIndentLevel(editor, ReactEditor.findPath(editor, element))
  const indexSymbol = indentLevel % 3 === 1 ? "\u2022" : indentLevel % 3 === 2 ? "\u25E6" : "\u25AA"

  return (
    <div
      data-circu-node="block"
      {...attributes}
      className={"my-2"}
      style={{
        display: element.isHidden ? "none" : undefined,
      }}
    >
      <div>
        <span contentEditable={false} className={"select-none text-blue-500 min-w-[22px] absolute"}>
          {indexSymbol}
        </span>
        <div
          style={{
            paddingLeft: "22px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default UnorderedList
