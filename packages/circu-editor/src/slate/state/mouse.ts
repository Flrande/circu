import type { Path } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import { proxy } from "valtio"
import type { SlateElement } from "../types/slate"

// 鼠标水平方向对应的块级节点的 Path
export const mouseXStateStore = proxy<{ xBlockPath: Path | null }>({ xBlockPath: null })

export const useMouseXBlockDetect: (element: SlateElement) => {
  onMouseEnterForDrag: React.MouseEventHandler
  onMouseLeaveForDrag: React.MouseEventHandler
} = (element) => {
  const editor = useSlateStatic()

  // 要在回调里取才能拿到最新的 path, 否则有可能会过期
  const onMouseEnterForDrag: React.MouseEventHandler = () => {
    const path = ReactEditor.findPath(editor, element)
    mouseXStateStore.xBlockPath = path
  }
  const onMouseLeaveForDrag: React.MouseEventHandler = (event) => {
    // 如果移出后的节点是 block 节点才调整 xBlockPath, 因为移出去后有可能是 BlockChildren,
    // 这时候调整 xBlockPath 用户无法在当前行选中拖动按钮
    if (event.relatedTarget && (event.relatedTarget as HTMLElement).dataset.circuNode === "block") {
      const path = ReactEditor.findPath(editor, element)
      if (path.length >= 3) {
        mouseXStateStore.xBlockPath = path.slice(0, path.length - 2)
      }
    }
  }

  return {
    onMouseEnterForDrag,
    onMouseLeaveForDrag,
  }
}
