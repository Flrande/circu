import type { Editor } from "slate"
import { normalizeOrderedList } from "../components/Nodes/Block/List/normalizeList"

export const withNormalize = (editor: Editor) => {
  const { normalizeNode } = editor

  editor.normalizeNode = (entry) => {
    normalizeOrderedList(editor, entry)

    normalizeNode(entry)
  }

  return editor
}
