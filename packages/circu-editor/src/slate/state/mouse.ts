import { atom } from "jotai"
import type { Path } from "slate"

// 鼠标水平方向对应的块级节点的 Path
export const mouseXBlockPathAtom = atom<Path | null>(null)
