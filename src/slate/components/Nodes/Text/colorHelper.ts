import { Editor } from "slate"
import type { KeysUnion } from "../../../types/utils"
import type { IBackgroundColorMap, IFontColorMap } from "./Color"

export const isColorMarkActive = <T extends "font" | "background">(
  editor: Editor,
  type: T,
  key: T extends "font" ? KeysUnion<IFontColorMap> : KeysUnion<IBackgroundColorMap>
) => {
  const marks = Editor.marks(editor)
  if (!marks?.color) return false

  if (type === "font") {
    if (!marks.color.fontColorKey) return false

    return marks.color.fontColorKey === key
  } else {
    if (!marks.color.backgroundColorKey) return false

    return marks.color.backgroundColorKey === key
  }
}

export const toggleColorMark = <T extends "font" | "background">(
  editor: Editor,
  type: T,
  key: T extends "font" ? KeysUnion<IFontColorMap> : KeysUnion<IBackgroundColorMap>
) => {
  const isActive = isColorMarkActive(editor, type, key)

  if (isActive) {
    let color = Editor.marks(editor)?.color
    if (!color) {
      // 正常来说 isActive 为真时 color 存在
      console.error("Editor.marks(editor).color in toggleColorMark() is unexpected.")
      return
    }
    color = Object.assign({}, color)

    Editor.removeMark(editor, "color")
    if (type === "font") {
      delete color.fontColorKey
    } else {
      delete color.backgroundColorKey
    }

    Editor.addMark(editor, "color", color)
  } else {
    let color = Editor.marks(editor)?.color ?? {}
    color = Object.assign({}, color)

    if (type === "font") {
      color.fontColorKey = key as KeysUnion<IFontColorMap>
    } else {
      color.backgroundColorKey = key as KeysUnion<IBackgroundColorMap>
    }

    Editor.addMark(editor, "color", color)
  }
}

export const cleanColorMark = (editor: Editor) => {
  Editor.removeMark(editor, "color")
}
