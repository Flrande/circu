import { Editor, Transforms } from "slate"
import { SlateElement, SlateRange } from "../../../../types/slate"

/**
 * 处理标题中换行行为的函数
 *
 * @param editor 编辑器实例
 * @returns 返回一个布尔值, 决定是否覆盖默认行为, 若为真, 则覆盖
 *
 */
export const titleLineBreakHandler = (editor: Editor): boolean => {
  const { selection } = editor
  if (!selection) {
    return false
  }

  if (SlateRange.isCollapsed(selection)) {
    const [node] = Editor.node(editor, [selection.anchor.path[0]])

    if (SlateElement.isElement(node) && node.type === "title") {
      Transforms.splitNodes(editor, {
        at: selection.anchor,
        match: (n) => SlateElement.isElement(n) && n.type === "title",
        always: true,
      })
      Transforms.setNodes(
        editor,
        {
          type: "paragraph",
        },
        {
          at: [selection.anchor.path[0] + 1],
        }
      )

      return true
    }
  }
  return false
}
