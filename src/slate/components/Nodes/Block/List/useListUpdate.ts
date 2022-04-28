import { useEffect } from "react"
import { Editor, NodeEntry, Transforms } from "slate"
import { useSlate } from "slate-react"
import { SlateElement } from "../../../../types/slate"
import type { IList } from "./types"

// TODO: 优化更新算法?
/**
 * 副作用, 每次编辑器更新时更新所有有序列表的 index
 */
export const useListIndexUpdate = () => {
  const editor = useSlate()

  useEffect(() => {
    const listEntryArr = Array.from(
      Editor.nodes(editor, {
        at: [],
        match: (n) => SlateElement.isElement(n) && n.type === "list" && n.listType === "ordered",
      })
    ) as NodeEntry<IList>[]

    let currentIndex = 1
    for (const [list, path] of listEntryArr) {
      const tmpList = { ...list }
      if (!tmpList.orderedListMode) {
        console.error(`List in ${path} is ordered but its orderedListMode is undefined.`)
        return
      }

      if (!tmpList.index) {
        console.error(`List in ${path} is ordered but its index is undefined.`)
        return
      }

      if (tmpList.orderedListMode === "head") {
        if (!tmpList.headIndex) {
          console.error(`List in ${path} is ordered and head mode but its headIndex is undefined.`)
          return
        }

        tmpList.index = tmpList.headIndex
        currentIndex = tmpList.headIndex
      } else {
        currentIndex++
        tmpList.index = currentIndex
      }
      Transforms.setNodes(editor, tmpList, {
        at: path,
      })
    }
  })
}
