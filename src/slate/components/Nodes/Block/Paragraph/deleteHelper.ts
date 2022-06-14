import { Editor, NodeEntry, Transforms } from "slate"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { calculateIndentLevel, decreaseIndent } from "../BlockWrapper/indentHelper"

/**
 * 处理段落中单字符删除相关的逻辑:
 * 1. 如果当前段落带有缩进, 在首个 Point 上触发 deleteBackward 时相当于减少当前段落的缩进
 * 2. 若光标前为代码块, 选中该代码块, 不删除
 *
 * @param editor 编辑器实例
 * @param currentEntry 光标所在的一级节点 Entry
 * @returns 一个布尔值, 为真说明不需要执行默认行为
 *
 */
export const paragraphDeleteBackward = (editor: Editor, currentEntry: NodeEntry): boolean => {
  const { selection } = editor
  if (!selection) {
    return false
  }

  // 当前 BlockNode
  const [currentBlockNode, currentBlockNodePath] = currentEntry

  if (
    SlateElement.isElement(currentBlockNode) &&
    currentBlockNode.type === "paragraph" &&
    SlateRange.isCollapsed(selection) &&
    Editor.isStart(editor, selection.anchor, currentBlockNodePath)
  ) {
    const previousNodeEntry = Editor.previous(editor, {
      match: (n, p) =>
        SlateElement.isElement(n) &&
        arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type) &&
        p.length === currentBlockNodePath.length,
    }) as NodeEntry<BlockElementExceptTextLine> | undefined

    // 若光标前为 blockCode, 选中该 blockCode, 不删除
    if (previousNodeEntry && previousNodeEntry[0].type === "block-code") {
      Transforms.select(editor, previousNodeEntry[1])
      return true
    }

    // 若当前段落带有缩进, 在首个 Point 上触发 deleteBackward 时相当于将当前段落的缩进级别设为 0
    if (calculateIndentLevel(editor, currentBlockNodePath) !== 0) {
      decreaseIndent(editor)
      if (editor.selection) {
        Transforms.select(editor, Editor.start(editor, editor.selection))
      }

      return true
    }
  }

  return false
}
