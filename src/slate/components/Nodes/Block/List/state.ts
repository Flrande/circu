import { atom } from "jotai"
import type { IOrderedList } from "./types"

export const orderedListBarStateAtom = atom<{
  orderedList: IOrderedList
  position: {
    left: number
    top: number
  }
} | null>(null)
