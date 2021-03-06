import { Editor, NodeEntry, Path, Transforms } from "slate"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { decreaseIndent, increaseIndent } from "../BlockWrapper/indentHelper"

/**
 * 处理段落块中换行行为的函数
 *
 * @param editor 编辑器实例
 * @param currentEntry 要处理的块级节点
 * @returns 返回一个布尔值, 决定是否覆盖默认行为, 若为真, 则覆盖
 *
 */
export const paragraphLineBreakHandler = (
  editor: Editor,
  currentEntry: NodeEntry<BlockElementExceptTextLine>
): boolean => {
  const { selection } = editor
  if (!selection) {
    return false
  }

  const [currentBlock, currentBlockPath] = currentEntry

  if (SlateRange.isCollapsed(selection) && currentBlock.type === "paragraph") {
    // 若含子节点
    if (currentBlock.children.length === 2) {
      // 若含子节点且折叠, 换行产生兄弟节点
      if (currentBlock.isFolded) {
        Transforms.splitNodes(editor, {
          at: selection.anchor,
          match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
          always: true,
        })

        // 切割后当前段落的子节点块会成为新段落的子节点块, 因此要移回去
        Transforms.moveNodes(editor, {
          at: Path.next(currentBlockPath).concat([1]),
          to: currentBlockPath.concat([1]),
        })

        // 若含子节点且非折叠, 将换行拆出的部分移到子节点块中
      } else {
        Transforms.splitNodes(editor, {
          at: selection.anchor,
          match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
          always: true,
        })
        increaseIndent(editor, Editor.range(editor, Path.next(currentBlockPath)))
        decreaseIndent(editor, Editor.range(editor, currentBlockPath.concat([1, 0, 1])))

        Transforms.select(editor, Editor.start(editor, currentBlockPath.concat([1])))
      }
    } else {
      Transforms.splitNodes(editor, {
        at: selection.anchor,
        match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
        always: true,
      })
    }

    return true
  }

  return false
}
