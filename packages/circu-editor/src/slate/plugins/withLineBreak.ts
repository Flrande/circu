import { Editor, NodeEntry, Point, Transforms } from "slate"
import { headLineBreakHandler } from "../components/Nodes/Block/Head/headLineBreakHandler"
import { listLineBreakHandler } from "../components/Nodes/Block/List/listLineBreakHandler"
import { paragraphLineBreakHandler } from "../components/Nodes/Block/Paragraph/paragraphLineBreakHandler"
import { titleLineBreakHandler } from "../components/Nodes/Block/Title/titleLineBreakHandler"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../types/constant"
import type { BlockElementExceptTextLine } from "../types/interface"
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

        Transforms.select(editor, currentPoint)

        if (titleLineBreakHandler(editor)) {
          return
        }

        const [selectedBlock] = Array.from(
          Editor.nodes(editor, {
            at: currentPoint,
            match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
            mode: "lowest",
          })
        ) as NodeEntry<BlockElementExceptTextLine>[]

        if (listLineBreakHandler(editor, selectedBlock)) {
          return
        }

        if (headLineBreakHandler(editor, selectedBlock)) {
          return
        }

        if (paragraphLineBreakHandler(editor, selectedBlock)) {
          return
        }

        insertBreak()
      }
    })
  }

  return editor
}
