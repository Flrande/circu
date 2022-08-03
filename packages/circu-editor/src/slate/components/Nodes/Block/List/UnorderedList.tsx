import { ReactEditor, useSlateStatic } from "slate-react"
import type { CustomRenderElementProps } from "../../../../types/utils"
import DragMarkLine from "../../../Draggable/DragMarkLine"
import { useDropBlock } from "../../../Draggable/useDropBlock"
import { calculateIndentLevel } from "../BlockWrapper/indentHelper"
import type { IUnorderedList } from "./types"

const UnorderedList: React.FC<CustomRenderElementProps<IUnorderedList>> = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  const listPath = ReactEditor.findPath(editor, element)

  const { newAttributes, onDragOver, dragActiveLine } = useDropBlock(element, attributes)

  const indentLevel = calculateIndentLevel(editor, listPath)
  const indexSymbol = indentLevel % 3 === 1 ? "\u2022" : indentLevel % 3 === 2 ? "\u25E6" : "\u25AA"

  return (
    <div
      data-circu-node="block"
      {...newAttributes}
      onDragOver={onDragOver}
      className={"my-2 relative"}
      style={{
        display: element.isHidden ? "none" : undefined,
      }}
    >
      {listPath.at(-1) !== 0 && (
        <div
          data-circu-node="block-space"
          contentEditable={false}
          className={"absolute left-0 -top-2 w-full h-2 select-none"}
        ></div>
      )}
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
      <DragMarkLine activeDirection={dragActiveLine}></DragMarkLine>
    </div>
  )
}

export default UnorderedList
