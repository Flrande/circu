import { Editor, Path, Point, Transforms, Element as SlateElement } from "slate"
import type { ParagraphType } from "../Paragraph/types"
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

//TODO: 撤销代码块
export const unToggleBlockCode = (editor: Editor) => {}

//TODO: 直接添加一个空代码块(需要新的toolbar?)
//TODO-BUG: 1 - 2 - 3 , 将 2 转化为代码块时, 会变成 1 - 3 - <2>
export const toggleBlockCode = (editor: Editor) => {
  // if (isBlockCodeActive(editor)) {
  //   unToggleBlockCode(editor)
  //   return
  // }

  if (!editor.selection) {
    console.error("toggleBlockCode() need editor.selection.")
    return
  }

  const selectedParagraphNodes = Array.from(
    Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "paragraph",
    })
  ).map((item) => item[0]) as ParagraphType[]

  // children 必须遵循 paragraph - codeArea - paragraph
  const newNode: BlockCodeType = {
    type: "blockCode",
    lang: "PlainText",
    children: [
      {
        type: "paragraph",
        children: [
          {
            text: "",
          },
        ],
        isVoid: true,
      },
      {
        type: "blockCode_codeArea",
        children: selectedParagraphNodes,
      },
      {
        type: "paragraph",
        children: [
          {
            text: "",
          },
        ],
        isVoid: true,
      },
    ],
  }

  Transforms.removeNodes(editor)
  Transforms.insertNodes(editor, newNode, {
    at: [editor.selection.anchor.path[0] + 1],
  })

  // 为代码块后添加一个空行
  //TODO: 最后一行一直为一个空行, 添加代码块后光标在代码块内
  const newPath: Path = [editor.selection.anchor.path[0] + 2]
  const newPoint: Point = {
    path: [editor.selection.anchor.path[0] + 2, 0],
    offset: 0,
  }
  Transforms.insertNodes(
    editor,
    {
      type: "paragraph",
      children: [{ text: "" }],
      isVoid: false,
    },
    { at: newPath }
  )
  Transforms.select(editor, newPoint)
}
