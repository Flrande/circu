import { Editor } from "slate"
import { blockCodeDeleteBackward } from "../components/Nodes/Block/BlockCode/deleteHelper"
import { listDeleteBackward } from "../components/Nodes/Block/List/deleteHelper"
import { paragraphDeleteBackward } from "../components/Nodes/Block/Paragraph/deleteHelper"
import { unActiveToolBar } from "../components/ToolBar/state"

const withDeleteBackward = (editor: Editor) => {
  const { deleteBackward } = editor

  editor.deleteBackward = (unit: "character" | "word" | "line" | "block") => {
    const { selection } = editor
    // 若为真, 则不需要执行默认行为
    let flag = false

    if (selection) {
      // 当前 BlockNode
      const currentEntry = Editor.node(editor, selection, {
        depth: 1,
      })

      flag =
        paragraphDeleteBackward(editor, currentEntry) ||
        blockCodeDeleteBackward(editor, currentEntry) ||
        listDeleteBackward(editor, currentEntry)
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
