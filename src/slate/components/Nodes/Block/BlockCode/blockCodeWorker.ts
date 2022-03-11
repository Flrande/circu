import { Editor, Path, Point, Transforms } from "slate"
import type { BlockCodeType } from "./types"

// export const isBlockCodeActive = (editor: Editor) => {
//   const { selection } = editor
//   if (!selection) return false

//   const match = Array.from(
//     Editor.nodes(editor, {
//       match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "blockCode",
//     })
//   )

//   return match.length > 0 ? true : false
// }

export const unToggleBlockCode = (editor: Editor) => {}

//TODO: 行首直接添加一个代码块
//TODO: 代码块为首个 block element 且代码块内文本为空时, 键盘触发 Backspace 后删除整个代码块
//TODO: 光标在代码块首部, 触发 Backspace 时不删除整个代码块
export const toggleBlockCode = (editor: Editor) => {
  // if (isBlockCodeActive(editor)) {
  //   unToggleBlockCode(editor)
  //   return
  // }

  if (!editor.selection) {
    console.error("toggleBlockCode() need editor.selection.")
    return
  }

  const newNode: BlockCodeType = {
    type: "blockCode",
    lang: "PlainText",
    children: [],
  }

  Transforms.wrapNodes(editor, newNode)
  const newPath: Path = [editor.selection.anchor.path[0] + 1]
  const newPoint: Point = {
    path: [editor.selection.anchor.path[0] + 1, 0],
    offset: 0,
  }
  Transforms.insertNodes(
    editor,
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
    { at: newPath }
  )
  Transforms.select(editor, newPoint)
}
