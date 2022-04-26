import type { Editor } from "slate"
import { INLINE_ELEMENTS } from "../types/constant"
import { arrayIncludes } from "../utils/general"

export const withInlines = (editor: Editor) => {
  const { isInline } = editor

  editor.isInline = (element) => arrayIncludes(INLINE_ELEMENTS, element.type) || isInline(element)

  return editor
}
