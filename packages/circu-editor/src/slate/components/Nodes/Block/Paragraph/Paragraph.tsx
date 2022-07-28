import type { CustomRenderElementProps } from "../../../../types/utils"
import DragMarkLine from "../../../Draggable/DragMarkLine"
import { useDropBlock } from "../../../Draggable/useDropBlock"
import type { IParagraph } from "./types"

const Paragraph: React.FC<CustomRenderElementProps<IParagraph>> = ({ attributes, children, element }) => {
  const { newAttributes, onDragOver, dragActiveLine } = useDropBlock(element, attributes)

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
      <div data-circu-node="block-space" contentEditable={false} className={"absolute left-0 -top-2 w-full h-2"}></div>
      <div>{children}</div>
      <DragMarkLine activeDirection={dragActiveLine}></DragMarkLine>
    </div>
  )
}

export default Paragraph
