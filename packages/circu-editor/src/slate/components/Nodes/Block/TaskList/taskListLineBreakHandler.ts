import { Editor, NodeEntry, Path, Transforms } from "slate"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement, SlateNode, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { decreaseIndent, increaseIndent } from "../BlockWrapper/indentHelper"

/**
 * 处理任务列表中换行行为的函数
 *
 * @param editor 编辑器实例
 * @param currentEntry 要处理的块级节点
 * @returns 返回一个布尔值, 决定是否覆盖默认行为, 若为真, 则覆盖
 *
 */
export const taskListLineBreakHandler = (
  editor: Editor,
  currentEntry: NodeEntry<BlockElementExceptTextLine>
): boolean => {
  const { selection } = editor
  if (!selection) {
    return false
  }

  const [currentBlock, currentBlockPath] = currentEntry

  // 判断是否为光标状态且选中元素为任务列表
  if (SlateRange.isCollapsed(selection) && currentBlock.type === "task-list") {
    // 若列表内容块为空, 触发换行时减少缩进
    if (SlateNode.string(currentBlock.children[0]).length === 0) {
      decreaseIndent(editor)
      if (editor.selection) {
        Transforms.select(editor, Editor.start(editor, editor.selection))
      }
      return true
    }

    // 若当前任务列表有子节点
    if (currentBlock.children.length === 2) {
      // 若为折叠状态, 换行产生的新列表为兄弟节点
      if (currentBlock.isFolded) {
        Transforms.splitNodes(editor, {
          at: selection.anchor,
          match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
          always: true,
        })

        // 切割后当前列表的子节点块会成为新列表的子节点块, 因此要移回去
        Transforms.moveNodes(editor, {
          at: Path.next(currentBlockPath).concat([1]),
          to: currentBlockPath.concat([1]),
        })

        return true
        // 若不是折叠状态, 换行后新产生的列表应放入子节点块中
      } else {
        Transforms.splitNodes(editor, {
          at: selection.anchor,
          match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
          always: true,
        })

        // 将换行拆出的部分移到子节点块中
        increaseIndent(editor, Editor.range(editor, Path.next(currentBlockPath)))
        decreaseIndent(editor, Editor.range(editor, currentBlockPath.concat([1, 0, 1])))
        Transforms.select(editor, Editor.start(editor, currentBlockPath.concat([1])))

        return true
      }
    }

    Transforms.splitNodes(editor, {
      at: selection.anchor,
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
      always: true,
    })

    return true
  }

  return false
}
