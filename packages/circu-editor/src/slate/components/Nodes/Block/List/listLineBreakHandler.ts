import { Editor, NodeEntry, Path, Transforms } from "slate"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement, SlateNode, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { decreaseIndent, increaseIndent } from "../BlockWrapper/indentHelper"

/**
 * 处理列表中换行行为的函数
 *
 * @param editor 编辑器实例
 * @param currentEntry 要处理的块级节点
 * @returns 返回一个布尔值, 决定是否覆盖默认行为, 若为真, 则覆盖
 *
 */
export const listLineBreakHandler = (editor: Editor, currentEntry: NodeEntry<BlockElementExceptTextLine>): boolean => {
  const { selection } = editor
  if (!selection) {
    return false
  }

  const [currentBlock, currentBlockPath] = currentEntry

  // 判断是否为光标状态且选中元素为列表
  if (
    SlateRange.isCollapsed(selection) &&
    (currentBlock.type === "ordered-list" || currentBlock.type === "unordered-list")
  ) {
    // 若列表内容块为空, 触发换行时减少缩进
    if (SlateNode.string(currentBlock.children[0]).length === 0) {
      decreaseIndent(editor)
      if (editor.selection) {
        Transforms.select(editor, Editor.start(editor, editor.selection))
      }
      return true
    }

    if (currentBlock.type === "ordered-list") {
      // 若当前列表为有序列表, 且有子节点, 换行后新产生的列表应为列表头, 且原来子节点块中的列表头应该为自增
      if (currentBlock.children.length === 2) {
        // 若 currentBlock 首个子项不是有序列表, 不用对其处理
        if (currentBlock.children[1].children[0].type === "ordered-list") {
          Transforms.setNodes(
            editor,
            {
              indexState: {
                type: "selfIncrement",
                index: 1,
              },
            },
            {
              at: currentBlockPath.concat([1, 0]),
            }
          )
        }

        // 将换行拆出的部分移到子节点块中
        Transforms.splitNodes(editor, {
          at: selection.anchor,
          match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
          always: true,
        })
        Transforms.setNodes(
          editor,
          {
            indexState: {
              type: "head",
              index: 1,
            },
          },
          {
            at: Path.next(currentBlockPath),
          }
        )
        increaseIndent(editor, Editor.range(editor, Path.next(currentBlockPath)))
        decreaseIndent(editor, Editor.range(editor, currentBlockPath.concat([1, 0, 1])))
        Transforms.select(editor, Editor.start(editor, currentBlockPath.concat([1])))

        return true
      }

      // 若当前列表为有序列表头, 且无子节点, 换行后新产生的列表应为自增
      if (currentBlock.indexState.type === "head" && currentBlock.children.length === 1) {
        Transforms.splitNodes(editor, {
          at: selection.anchor,
          match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
          always: true,
        })
        Transforms.setNodes(
          editor,
          {
            indexState: {
              type: "selfIncrement",
              index: 1,
            },
          },
          {
            at: Path.next(currentBlockPath),
          }
        )

        return true
      }
    }
  }

  return false
}
