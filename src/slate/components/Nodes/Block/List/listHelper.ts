import { Editor } from "slate"
import { SlateElement } from "../../../../types/slate"
import type { IList } from "./types"

export const isListActive = (editor: Editor, listType: IList["listType"]) => {
  const { selection } = editor
  if (!selection) return false

  const match = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "list" && n.listType === listType,
    })
  )

  return match.length > 0 ? true : false
}

export const toggleOrderedList = (editor: Editor) => {
  if (!editor.selection) {
    console.error("toggleOrderedList() need editor.selection.")
    return
  }
}
