import { Editor, NodeEntry, Path, Point, Transforms } from "slate"
import { decreaseIndent, increaseIndent } from "../components/Nodes/Block/BlockWrapper/indentHelper"
import { headLineBreakHandler } from "../components/Nodes/Block/Head/headLineBreakHandler"
import { listLineBreakHandler } from "../components/Nodes/Block/List/listLineBreakHandler"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, BLOCK_ELEMENTS_WITH_CHILDREN } from "../types/constant"
import type { BlockElementWithChildren } from "../types/interface"
import { SlateElement, SlateRange } from "../types/slate"
import { arrayIncludes } from "../utils/general"

const deleteRange = (editor: Editor, range: SlateRange): Point | null => {
  if (SlateRange.isCollapsed(range)) {
    return range.anchor
  } else {
    const [, end] = SlateRange.edges(range)
    const pointRef = Editor.pointRef(editor, end)
    Transforms.delete(editor, { at: range })
    return pointRef.unref()
  }
}

export const withLineBreak = (editor: Editor) => {
  const { insertBreak } = editor

  editor.insertBreak = () => {
    Editor.withoutNormalizing(editor, () => {
      const { selection } = editor
      if (selection) {
        const currentPoint = deleteRange(editor, selection)
        if (!currentPoint) {
          return
        }

        const selectedBlocksEntry = Array.from(
          Editor.nodes(editor, {
            at: currentPoint,
            match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITH_CHILDREN, n.type),
            mode: "lowest",
          })
        ) as NodeEntry<BlockElementWithChildren>[]

        if (selectedBlocksEntry.length >= 1) {
          // 在这里添加特定类型节点的处理函数, 通过返回值判断是否需要执行下方的针对含子节点的节点的默认换行行为
          if (listLineBreakHandler(editor, selectedBlocksEntry[0])) {
            return
          }
          if (headLineBreakHandler(editor, selectedBlocksEntry[0])) {
            return
          }

          const [selectedBlock, selectedBlockPath] = selectedBlocksEntry[0]

          if (selectedBlock.children.length === 2) {
            // 若含子节点, 将换行拆出的部分移到子节点块中
            Transforms.splitNodes(editor, {
              at: currentPoint,
              match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
              always: true,
            })
            increaseIndent(editor, Editor.range(editor, Path.next(selectedBlockPath)))
            decreaseIndent(editor, Editor.range(editor, selectedBlockPath.concat([1, 0, 1])))
            Transforms.select(editor, Editor.start(editor, selectedBlockPath.concat([1])))
          } else {
            Transforms.splitNodes(editor, {
              at: currentPoint,
              match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
              always: true,
            })
          }
        } else {
          insertBreak()
        }
      }
    })
  }

  return editor
}
