import { Editor, NodeEntry, Transforms } from "slate"
import { SlateElement } from "../../../../types/slate"
import type { IOrderedList } from "./types"

/**
 * 用于更新有序列表的索引, 该规格化函数应在规格化进行到 editor 时执行,
 * 而不是进行到有序列表时执行
 *
 * @param editor 当前编辑器实例
 *
 */
export const normalizeOrderedList = (editor: Editor) => {
  // 无索引的有序列表不参与更新
  const listEntryArr = Array.from(
    Editor.nodes(editor, {
      at: [],
      match: (n) => SlateElement.isElement(n) && n.type === "orderedList" && n.indexState.type !== "noIndex",
    })
  ) as NodeEntry<IOrderedList>[]

  let currentIndex = 1
  for (const [list, path] of listEntryArr) {
    if (list.indexState.type === "noIndex") {
      continue
    }

    if (list.indexState.type === "head") {
      currentIndex = list.indexState.index
    } else {
      currentIndex++

      if (currentIndex !== list.indexState.index) {
        Transforms.setNodes(
          editor,
          {
            indexState: {
              type: list.indexState.type,
              index: currentIndex,
            },
          },
          {
            at: path,
          }
        )
      }
    }
  }
}
