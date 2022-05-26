import { Editor, NodeEntry, Transforms } from "slate"
import { SlateElement, SlateRange } from "../../../../types/slate"
import type { IParagraph } from "../Paragraph/types"

/**
 * 处理列表中单字符删除相关的逻辑:
 * 1. 如果光标为列表的首个 Point, 触发 deleteBackward 相当于将当前列表变为同缩进级别的 paragraph
 *
 * @param editor 当前编辑器实例
 * @param currentEntry 光标所在的一级节点 Entry
 * @returns 一个布尔值, 为真说明不需要执行默认行为
 *
 */
export const listDeleteBackward = (editor: Editor, currentEntry: NodeEntry) => {
  const { selection } = editor
  if (!selection) {
    return false
  }

  // 当前 BlockNode
  const [currentBlockNode, currentBlockNodePath] = currentEntry

  if (
    SlateElement.isElement(currentBlockNode) &&
    (currentBlockNode.type === "orderedList" || currentBlockNode.type === "unorderedList")
  ) {
    // 判断是否到达列表的首个 Point
    if (SlateRange.isCollapsed(selection) && Editor.isStart(editor, selection.anchor, currentBlockNodePath)) {
      // 触发 deleteBackward 相当于将当前列表变为同缩进级别的 paragraph
      Transforms.removeNodes(editor, {
        at: currentBlockNodePath,
      })

      const newNode: IParagraph = {
        type: "paragraph",
        indentLevel: currentBlockNode.indentLevel,
        children: currentBlockNode.children,
      }

      Transforms.insertNodes(editor, newNode, {
        at: currentBlockNodePath,
      })
      Transforms.select(editor, Editor.start(editor, currentBlockNodePath))
      return true
    }
  }

  return false
}
