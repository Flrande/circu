import { Editor, NodeEntry } from "slate"
import { blockCodeDeleteBackward } from "../components/Nodes/Block/BlockCode/deleteHelper"
import { listDeleteBackward } from "../components/Nodes/Block/List/deleteHelper"
import { paragraphDeleteBackward } from "../components/Nodes/Block/Paragraph/deleteHelper"
import { unActiveToolBar } from "../components/ToolBar/state"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../types/constant"
import type { BlockElementExceptTextLine } from "../types/interface"
import { SlateElement } from "../types/slate"
import { arrayIncludes } from "../utils/general"

const withDeleteBackward = (editor: Editor) => {
  const { deleteBackward } = editor

  editor.deleteBackward = (unit: "character" | "word" | "line" | "block") => {
    Editor.withoutNormalizing(editor, () => {
      // 若为真, 则不需要执行默认行为
      let flag = false

      const selectedContentBlocksEntry = Array.from(
        Editor.nodes(editor, {
          match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
          mode: "lowest",
        })
      ) as NodeEntry<BlockElementExceptTextLine>[]

      if (selectedContentBlocksEntry.length === 1) {
        // 注意, 此处某个函数返回值为真会导致后面的函数不执行
        flag =
          paragraphDeleteBackward(editor, selectedContentBlocksEntry[0]) ||
          blockCodeDeleteBackward(editor, selectedContentBlocksEntry[0]) ||
          listDeleteBackward(editor, selectedContentBlocksEntry[0])
      }

      // 默认行为
      if (!flag) {
        deleteBackward(unit)
      }
    })
  }

  return editor
}

const withDeleteFragment = (editor: Editor) => {
  const { deleteFragment } = editor

  editor.deleteFragment = (direction?: "forward" | "backward") => {
    Editor.withoutNormalizing(editor, () => {
      deleteFragment(direction)
      unActiveToolBar()
    })
  }

  return editor
}

export const withDelete = (editor: Editor) => {
  return withDeleteFragment(withDeleteBackward(editor))
}
