import { Editor, NodeEntry } from "slate"
import { blockCodeDeleteBackward } from "../components/Nodes/Block/BlockCode/deleteHelper"
import { listDeleteBackward } from "../components/Nodes/Block/List/deleteHelper"
import { unActiveToolBar } from "../components/ToolBar/state"
import { BLOCK_ELEMENTS_WITHOUT_TEXT_LINE } from "../types/constant"
import type { BlockElementWithContent, BlockElementWithoutTextLine } from "../types/interface"
import { SlateElement } from "../types/slate"
import { arrayIncludes } from "../utils/general"

const withDeleteBackward = (editor: Editor) => {
  const { deleteBackward } = editor

  editor.deleteBackward = (unit: "character" | "word" | "line" | "block") => {
    const { selection } = editor
    // 若为真, 则不需要执行默认行为
    let flag = false

    if (selection) {
      const selectedContentBlocksEntry = Array.from(
        Editor.nodes(editor, {
          match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type),
        })
      ) as NodeEntry<BlockElementWithoutTextLine>[]

      if (selectedContentBlocksEntry.length === 1) {
        flag =
          // paragraphDeleteBackward(editor, selectedContentBlocksEntry[0]) ||
          blockCodeDeleteBackward(editor, selectedContentBlocksEntry[0]) ||
          listDeleteBackward(editor, selectedContentBlocksEntry[0])
      }
    }

    // 默认行为
    if (!flag) {
      deleteBackward(unit)
    }
  }

  return editor
}

const withDeleteFragment = (editor: Editor) => {
  const { deleteFragment } = editor

  editor.deleteFragment = (direction?: "forward" | "backward") => {
    deleteFragment(direction)
    unActiveToolBar()
  }

  return editor
}

export const withDelete = (editor: Editor) => {
  return withDeleteFragment(withDeleteBackward(editor))
}
