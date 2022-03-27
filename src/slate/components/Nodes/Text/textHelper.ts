import { Editor } from "slate"
import type { KeysUnion } from "../../../types/utils"
import type { CustomTextType } from "./types"

export const isMarkActive = (editor: Editor, format: Exclude<KeysUnion<CustomTextType>, "text">) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const toggleMark = (editor: Editor, format: Exclude<KeysUnion<CustomTextType>, "text">) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}
