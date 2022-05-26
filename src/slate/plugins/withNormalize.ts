import type { Editor } from "slate"
import { normalizeBlockCode } from "../components/Nodes/Block/BlockCode/normalizeBlockCode"
import { normalizeOrderedList } from "../components/Nodes/Block/List/normalizeList"

const withNormalizeForBlockCode = (editor: Editor) => {
  const { normalizeNode } = editor

  editor.normalizeNode = (entry) => {
    if (normalizeOrderedList(editor, entry)) {
      return
    }

    if (normalizeBlockCode(editor, entry)) {
      return
    }

    normalizeNode(entry)
  }

  return editor
}

export const withNormalize = (editor: Editor) => {
  return withNormalizeForBlockCode(editor)
}
