import { ReactEditor, useSlateStatic } from "slate-react"
import { useMouseXBlockDetect } from "../../../../state/mouse"
import type { CustomRenderElementProps } from "../../../../types/utils"
import DragMarkLine from "../../../Draggable/DragMarkLine"
import { useDropBlock } from "../../../Draggable/useDropBlock"
import type { IHead } from "./types"

const Head: React.FC<CustomRenderElementProps<IHead>> = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  const headPath = ReactEditor.findPath(editor, element)

  const { onMouseEnterForDrag, onMouseLeaveForDrag } = useMouseXBlockDetect(element)

  const { newAttributes, onDragOver, dragActiveLine } = useDropBlock(element, attributes)

  let className: "head-1" | "head-2" | "head-3" | "head-4" | "head-5" | "head-6"
  switch (element.headGrade) {
    case "1":
      className = "head-1"
      break
    case "2":
      className = "head-2"
      break
    case "3":
      className = "head-3"
      break
    case "4":
      className = "head-4"
      break
    case "5":
      className = "head-5"
      break
    case "6":
      className = "head-6"
      break
    default:
      className = "head-1"
  }

  return (
    <div
      data-circu-node="block"
      {...newAttributes}
      onDragOver={onDragOver}
      onMouseEnter={onMouseEnterForDrag}
      onMouseLeave={onMouseLeaveForDrag}
      className={`${className} relative`}
      style={{
        display: element.isHidden ? "none" : undefined,
      }}
    >
      <div
        data-circu-node={headPath.at(-1) !== 0 ? "block-space" : ""}
        contentEditable={false}
        className={"absolute left-0 w-full select-none"}
        style={{
          // 标题样式需要 :nth-child, 故其占位块不能像其他块级节点一样直接使用与运算符条件渲染
          display: headPath.at(-1) !== 0 ? undefined : "none",
        }}
      ></div>
      {children}
      <DragMarkLine activeDirection={dragActiveLine}></DragMarkLine>
    </div>
  )
}

export default Head
