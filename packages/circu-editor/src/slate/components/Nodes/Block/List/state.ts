import { atom } from "jotai"
import type { NodeEntry } from "slate"
import type { IOrderedList } from "./types"

export const orderedListBarStateAtom = atom<{
  orderedListEntry: NodeEntry<IOrderedList>
  position: {
    left: number
    top: number
  }
} | null>(null)

export const orderedListModifyBarStateAtom = atom<{
  orderedListEntry: NodeEntry<IOrderedList>
  position: {
    left: number
    top: number
  }
} | null>(null)
