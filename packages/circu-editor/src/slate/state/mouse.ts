import { atomWithProxy } from "jotai/valtio"
import type { Path } from "slate"
import { proxy } from "valtio"

// 鼠标水平方向对应的块级节点的 Path
export const mouseXStateStore = proxy<{ xBlockPath: Path | null }>({ xBlockPath: null })
export const mouseXStateAtom = atomWithProxy(mouseXStateStore)
