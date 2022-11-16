import { CheckSmall } from "@icon-park/react"
import { ReactEditor, useSlateStatic } from "slate-react"
import { useMouseXBlockDetect } from "../../../../state/mouse"
import type { CustomRenderElementProps } from "../../../../types/utils"
import DragMarkLine from "../../../Draggable/DragMarkLine"
import { useDropBlock } from "../../../Draggable/useDropBlock"
import type { ITaskList } from "./types"

//TODO: 换行行为和删除行为
const TaskList: React.FC<CustomRenderElementProps<ITaskList>> = ({ attributes, children, element }) => {
  const editor = useSlateStatic()

  const listPath = ReactEditor.findPath(editor, element)

  const { newAttributes, onDragOver, dragActiveLine } = useDropBlock(element, attributes)

  const { onMouseEnterForDrag, onMouseLeaveForDrag } = useMouseXBlockDetect(element)

  return (
    <div
      data-circu-node="block"
      {...newAttributes}
      onDragOver={onDragOver}
      onMouseEnter={onMouseEnterForDrag}
      onMouseLeave={onMouseLeaveForDrag}
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
      <div className={"grid grid-cols-[20px_1fr]"}>
        <div>
          <div
            className={
              "w-[16px] h-[16px] mt-1 border rounded border-[#757575] hover:border-[#5a87f7] grid justify-center align-middle cursor-pointer"
            }
          >
            {element.isCompleted && (
              <CheckSmall theme="filled" size="16" fill="#4a90e2" strokeLinejoin="bevel" strokeLinecap="square" />
            )}
          </div>
        </div>
        {children}
      </div>
      <DragMarkLine activeDirection={dragActiveLine}></DragMarkLine>
    </div>
  )
}

export default TaskList
