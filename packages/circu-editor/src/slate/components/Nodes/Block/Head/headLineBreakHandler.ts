import { Editor, NodeEntry, Path, Point, Transforms } from "slate"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import type { IParagraph } from "../Paragraph/types"
import type { IHead } from "./types"

/**
 * 处理标题中换行行为的函数
 *
 * @param editor 编辑器实例
 * @param currentEntry 要处理的块级节点
 * @returns 返回一个布尔值, 决定是否覆盖默认行为, 若为真, 则覆盖
 *
 */
export const headLineBreakHandler = (editor: Editor, currentEntry: NodeEntry<BlockElementExceptTextLine>): boolean => {
  const { selection } = editor
  if (!selection) {
    return false
  }

  const [currentBlock, currentBlockPath] = currentEntry
  if (SlateRange.isCollapsed(selection) && currentBlock.type === "head") {
    if (currentBlock.isFolded) {
      // 若标题处于折叠状态, 换行时产生同类节点, 且新节点位置在折叠区域后

      // 找到当前标题后同级且标题级别高于等于当前标题的标题节点
      const afterHeads = Array.from(
        Editor.nodes(editor, {
          at: currentBlockPath.slice(0, -1),
          match: (n, p) =>
            SlateElement.isElement(n) &&
            n.type === "head" &&
            parseInt(n.headGrade) <= parseInt(currentBlock.headGrade) &&
            p.length === currentBlockPath.length &&
            Path.isAfter(p, currentBlockPath),
        })
        // 排序, 以在之后拿到最近的一个标题节点
      ).sort(([nodeA, pathA], [nodeB, pathB]) => (Path.isBefore(pathA, pathB) ? -1 : 1)) as NodeEntry<IHead>[]

      Transforms.splitNodes(editor, {
        match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
        always: true,
      })
      Transforms.moveNodes(editor, {
        at: Path.next(currentBlockPath),
        to: afterHeads[0][1],
      })
      Transforms.unsetNodes(editor, ["isFolded"], {
        at: afterHeads[0][1],
      })

      return true
    } else {
      // 若标题不处于折叠状态, 标题结尾换行时产生段落块
      if (Point.equals(selection.anchor, Editor.end(editor, currentBlockPath))) {
        const newNode: IParagraph = {
          type: "paragraph",
          children: [
            {
              type: "__block-element-content",
              children: [
                {
                  type: "text-line",
                  children: [
                    {
                      text: "",
                    },
                  ],
                },
              ],
            },
          ],
        }
        Transforms.insertNodes(editor, newNode, {
          at: Path.next(currentBlockPath),
          select: true,
        })

        return true
      }

      Transforms.splitNodes(editor, {
        at: selection.anchor,
        match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
        always: true,
      })

      return true
    }
  }

  return false
}
