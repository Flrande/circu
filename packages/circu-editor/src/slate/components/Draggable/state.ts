import { atom } from "jotai"
import type { Path } from "slate"

// 判断拖拽按钮是否处于拖拽状态
export const isDraggingAtom = atom(false)

// 用于决定拖放放置的位置
export const dropPositionAtom = atom<{
  path: Path
  direction: "top" | "bottom"
} | null>(null)
