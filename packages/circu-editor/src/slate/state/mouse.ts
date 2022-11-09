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
  const onMouseEnterForDrag = () => {
    const path = ReactEditor.findPath(editor, element)
    mouseXStateStore.xBlockPath = path
  }
  const onMouseLeaveForDrag = () => {
    const path = ReactEditor.findPath(editor, element)
    if (path.length >= 3) {
      mouseXStateStore.xBlockPath = path.slice(0, path.length - 2)
    }
  }

  return {
    onMouseEnterForDrag,
    onMouseLeaveForDrag,
  }
}
