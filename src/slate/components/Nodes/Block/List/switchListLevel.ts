import { Editor, NodeEntry, Transforms } from "slate"
import { SlateElement } from "../../../../types/slate"
import type { IListLevel, IUnorderedList } from "./types"

/**
 * 切换无序列表级别的函数, 不负责覆盖默认行为
 *
 * @param editor 当前编辑器实例
 * @param type 切换方向, 减少还是增加
 *
 */
export const switchUnorderedListLevel = (editor: Editor, type: "increase" | "decrease") => {
  // 选中的无序列表
  const selectedListEntryArr = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "unorderedList",
    })
  ) as NodeEntry<IUnorderedList>[]

  if (type === "increase") {
    // 令每个列表的级别加一
    for (const [node, path] of selectedListEntryArr) {
      const newLevel = Math.floor(node.listLevel + 1) as IListLevel

      if (newLevel >= 1 && newLevel <= 16) {
        Transforms.setNodes(
          editor,
          {
            listLevel: newLevel,
          },
          {
            at: path,
          }
        )
      }
    }
  } else {
    // 令每个列表的级别减一
    for (const [node, path] of selectedListEntryArr) {
      const newLevel = Math.floor(node.listLevel - 1) as IListLevel

      if (newLevel >= 1 && newLevel <= 16) {
        Transforms.setNodes(
          editor,
          {
            listLevel: newLevel,
          },
          {
            at: path,
          }
        )
      }
    }
  }
}
