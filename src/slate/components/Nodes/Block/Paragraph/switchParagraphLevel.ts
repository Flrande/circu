import { Editor, NodeEntry, Transforms } from "slate"
import { SlateElement } from "../../../../types/slate"
import type { IParagraph, IParagraphLevel } from "./types"

/**
 * 切换段落缩进级别的函数, 不负责覆盖默认行为
 *
 * @param editor 当前编辑器实例
 * @param type 切换方向, 减少还是增加
 *
 */
export const switchParagraphLevel = (editor: Editor, type: "increase" | "decrease") => {
  // 选中的段落元素
  const selectedParagraphEntryArr = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "paragraph",
    })
  ) as NodeEntry<IParagraph>[]

  if (type === "increase") {
    // 令每个段落的级别加一
    for (const [node, path] of selectedParagraphEntryArr) {
      const newLevel = Math.floor(node.indentLevel + 1) as IParagraphLevel

      if (newLevel >= 0 && newLevel <= 16 && node.indentLevel !== newLevel) {
        Transforms.setNodes(
          editor,
          {
            indentLevel: newLevel,
          },
          {
            at: path,
          }
        )
      }
    }
  } else {
    // 令每个段落的级别减一
    for (const [node, path] of selectedParagraphEntryArr) {
      const newLevel = Math.floor(node.indentLevel - 1) as IParagraphLevel

      if (newLevel >= 0 && newLevel <= 16 && node.indentLevel !== newLevel) {
        Transforms.setNodes(
          editor,
          {
            indentLevel: newLevel,
          },
          {
            at: path,
          }
        )
      }
    }
  }
}
