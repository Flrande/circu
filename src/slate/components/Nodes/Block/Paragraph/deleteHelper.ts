import { Editor, NodeEntry, Transforms } from "slate"
import { SlateElement, SlateRange } from "../../../../types/slate"

/**
 * 处理段落中单字符删除相关的逻辑:
 * 1. 如果当前段落带有缩进, 在首个 Point 上触发 deleteBackward 时相当于将当前段落的缩进级别设为 0
 * 2. 若光标前为代码块, 选中该代码块, 不删除
 *
 * @param editor 当前编辑器实例
 * @param currentEntry 光标所在的一级节点 Entry
 * @returns 一个布尔值, 为真说明不需要执行默认行为
 *
 */
export const paragraphDeleteBackward = (editor: Editor, currentEntry: NodeEntry) => {
  const { selection } = editor
  if (!selection) {
    return false
  }

  // 当前 BlockNode
  const [currentBlockNode, currentBlockNodePath] = currentEntry

  if (SlateElement.isElement(currentBlockNode) && currentBlockNode.type === "paragraph") {
    // 如果当前段落带有缩进, 在首个 Point 上触发 deleteBackward 时相当于将当前段落的缩进级别设为 0
    if (currentBlockNode.indentLevel !== 0) {
      if (SlateRange.isCollapsed(selection) && Editor.isStart(editor, selection.anchor, currentBlockNodePath)) {
        Transforms.setNodes(
          editor,
          {
            indentLevel: 0,
          },
          {
            at: currentBlockNodePath,
          }
        )
        return true
      }
    } else {
      const previousNodeEntry = Editor.previous(editor, {
        match: (n) => !Editor.isEditor(n),
        mode: "highest",
      })

      // 若光标前为 blockCode, 选中该 blockCode, 不删除
      if (
        previousNodeEntry &&
        SlateElement.isElement(previousNodeEntry[0]) &&
        previousNodeEntry[0].type === "blockCode"
      ) {
        Transforms.select(editor, previousNodeEntry[1])
        return true
      }
    }
  }

  return false
}
