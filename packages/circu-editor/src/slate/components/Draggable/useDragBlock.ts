import { useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { ConnectDragSource, useDrag } from "react-dnd"
import { Editor } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import { mouseXBlockPathAtom } from "../../state/mouse"
import { DND_ITEM_TYPES } from "./constant"
import { dropPositionAtom, isDraggingAtom } from "./state"

export const useDragBlock = (): {
  dragRef: ConnectDragSource
  onDragStart: React.DragEventHandler
} => {
  const editor = useSlateStatic()

  const xBlockPath = useAtomValue(mouseXBlockPathAtom)
  const setIsDragging = useSetAtom(isDraggingAtom)
  const setDropPosition = useSetAtom(dropPositionAtom)

  const [, dragRef, preview] = useDrag(() => ({
    type: DND_ITEM_TYPES.DRAGGABLE,
    end: () => {
      setIsDragging(false)
      setDropPosition(null)
    },
  }))

  useEffect(() => {
    if (xBlockPath) {
      const [xBlock] = Editor.node(editor, xBlockPath)
      const xBlockDom = ReactEditor.toDOMNode(editor, xBlock)

      preview(xBlockDom)
    }
  }, [xBlockPath, preview, editor])

  const onDragStart: React.DragEventHandler = (event) => {
    setIsDragging(true)
  }

  return {
    dragRef,
    onDragStart,
  }
}
