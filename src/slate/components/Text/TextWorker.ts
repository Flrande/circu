import { Editor } from "slate"
import type { CustomText } from "../../types/interface"
import type { KeysUnion } from "../../types/utils"

export const isMarkActive = (editor: Editor, format: Exclude<KeysUnion<CustomText>, "text">) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const toggleMark = (editor: Editor, format: Exclude<KeysUnion<CustomText>, "text">) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}
