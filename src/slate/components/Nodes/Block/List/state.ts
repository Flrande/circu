import { atom } from "jotai"
import type { IOrderedList } from "./types"

export const isOrderedListBarActiveAtom = atom(false)
export const orderedListBarStateAtom = atom<{
  orderedList: IOrderedList
  position: {
    left: number
    top: number
  }
} | null>(null)
