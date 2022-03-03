import type { Editor } from "slate"
import { inlineTypes } from "../types/interface"
import { includes } from "../utils/general"

export const withInlines = (editor: Editor) => {
  const { isInline } = editor

  editor.isInline = (element) => includes(inlineTypes, element.type) || isInline(element)

  return editor
}
