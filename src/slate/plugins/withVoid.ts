import type { Editor } from "slate"
import { VOID_ELEMENTS } from "../types/constant"
import { includes } from "../utils/general"

export const withVoid = (editor: Editor) => {
  const { isVoid } = editor

  editor.isVoid = (element) => includes(VOID_ELEMENTS, element.type) || isVoid(element)

  return editor
}
