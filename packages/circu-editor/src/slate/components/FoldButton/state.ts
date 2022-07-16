import { atom } from "jotai"
import type { Path } from "slate"

export const foldStateAtom = atom<{
  path: Path
  left: number
  top: number
} | null>(null)
