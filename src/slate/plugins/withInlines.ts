import type { Editor } from "slate"
import { INLINE_ELEMENTS } from "../types/constant"
import { includes } from "../utils/general"

export const withInlines = (editor: Editor) => {
  const { isInline } = editor

  editor.isInline = (element) => includes(INLINE_ELEMENTS, element.type) || isInline(element)

  return editor
}
