import { Editor, NodeEntry, Transforms } from "slate"
import { SlateElement } from "../../../../types/slate"
import type { IOrderedList } from "./types"

/**
 * 用于更新有序列表的索引, 并保证每一级的首个有序列表一定为列表头,
 * 该规格化函数应在规格化进行到 editor 时执行, 而不是进行到有序列表时执行
 *
 * @param editor 当前编辑器实例
 *
 */
export const normalizeOrderedList = (editor: Editor) => {
  const listEntryArr = Array.from(
    Editor.nodes(editor, {
      at: [],
      match: (n) => SlateElement.isElement(n) && n.type === "orderedList",
    })
  ) as NodeEntry<IOrderedList>[]

  // 遍历每一级的有序列表, 保证每一级的首个有序列表一定为列表头
  for (let i = 1; i <= 16; i++) {
    const currentListEntryArr = listEntryArr.filter(([node]) => node.indentLevel === i)

    if (currentListEntryArr.length > 0) {
      const [firstList, firstListPath] = currentListEntryArr[0]

      if (firstList.indexState.type !== "head") {
        Transforms.setNodes(
          editor,
          {
            indexState: {
              type: "head",
              index: 1,
            },
          },
          {
            at: firstListPath,
          }
        )

        // 直接结束当前规格化
        return
      }
    }
  }

  let currentIndex = 1
  for (const [list, path] of listEntryArr) {
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
