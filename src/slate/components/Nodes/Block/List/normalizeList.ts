import { Editor, NodeEntry, Transforms } from "slate"
import { SlateElement } from "../../../../types/slate"
import { MAX_INDENT_LEVEL } from "../BlockWrapper/constant"
import { calculateIndentLevel } from "../BlockWrapper/indentHelper"
import type { IOrderedList } from "./types"

/**
 * 用于更新有序列表的索引, 并保证每一级的首个有序列表一定为列表头
 *
 * @param editor 编辑器实例
 * @param entry 当前 entry
 *
 */
export const normalizeOrderedList = (editor: Editor, entry: NodeEntry) => {
  Editor.withoutNormalizing(editor, () => {
    const [currentNode] = entry

    // 在规格化进行到 editor 时执行, 而不是进行到有序列表时执行
    if (Editor.isEditor(currentNode)) {
      // debugger
      const listEntryArr = Array.from(
        Editor.nodes(editor, {
          at: [],
          match: (n) => SlateElement.isElement(n) && n.type === "ordered-list",
        })
      ) as NodeEntry<IOrderedList>[]

      // 遍历每一级的有序列表
      for (let i = 0; i <= MAX_INDENT_LEVEL; i++) {
        const currentListEntryArr = listEntryArr.filter(([, p]) => calculateIndentLevel(editor, p) === i)

        if (currentListEntryArr.length > 0) {
          // 保证每一级的首个有序列表一定为列表头
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
          }

          let currentIndex = 1
          for (const [list, path] of currentListEntryArr) {
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
      }
    }
  })
}
