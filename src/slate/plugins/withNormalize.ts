import type { Editor } from "slate"

const withNormalizeForBlockCode = (editor: Editor) => {
  const { normalizeNode } = editor

  editor.normalizeNode = (entry) => {
    // if (normalizeOrderedList(editor, entry)) {
    //   return
    // }

    normalizeNode(entry)
  }

  return editor
}

export const withNormalize = (editor: Editor) => {
  return withNormalizeForBlockCode(editor)
}
