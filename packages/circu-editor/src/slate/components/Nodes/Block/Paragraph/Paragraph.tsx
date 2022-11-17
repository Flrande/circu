import { Editor, Path } from "slate"
import { ReactEditor, useSelected, useSlateStatic } from "slate-react"
import { useMouseXBlockDetect } from "../../../../state/mouse"
import type { CustomRenderElementProps } from "../../../../types/utils"
import DragMarkLine from "../../../Draggable/DragMarkLine"
import { useDropBlock } from "../../../Draggable/useDropBlock"
import type { IParagraph } from "./types"

const Paragraph: React.FC<CustomRenderElementProps<IParagraph>> = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  const isSelected = useSelected()

  const paragraphPath = ReactEditor.findPath(editor, element)

  const { onMouseEnterForDrag, onMouseLeaveForDrag } = useMouseXBlockDetect(element)

  const { newAttributes, onDragOver, dragActiveLine } = useDropBlock(element, attributes)

  return (
    <div
      data-circu-node="block"
      {...newAttributes}
      onDragOver={onDragOver}
      onMouseEnter={onMouseEnterForDrag}
      onMouseLeave={onMouseLeaveForDrag}
      className={"relative"}
      style={{
        display: element.isHidden ? "none" : undefined,
      }}
    >
      {paragraphPath.at(-1) !== 0 && (
        <div
          data-circu-node="block-space"
          contentEditable={false}
          className={"absolute left-0 -top-2 w-full h-2 select-none"}
        ></div>
      )}
      <div
        className={
          !isSelected &&
          editor.children.length === 2 &&
          Path.equals(paragraphPath, [1]) &&
          Editor.string(editor, paragraphPath) === ""
            ? "empty-paragraph"
            : ""
        }
      >
        {children}
      </div>
      <DragMarkLine activeDirection={dragActiveLine}></DragMarkLine>
    </div>
  )
}

export default Paragraph
