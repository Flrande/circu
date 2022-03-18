import type { Editor } from "slate"

export const withVoid = (editor: Editor) => {
  const { isVoid } = editor

  editor.isVoid = (element) => (element.type === "paragraph" && element.isVoid) || isVoid(element)

  return editor
}
