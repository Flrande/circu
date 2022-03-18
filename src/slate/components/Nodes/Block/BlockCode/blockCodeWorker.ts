import { Editor, Transforms, Element as SlateElement, Range } from "slate"
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
//TODO: 添加代码块后光标在代码块内最后一个字符
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

  const selectedStartPath = Range.start(editor.selection).path
  Transforms.removeNodes(editor)
  console.log(selectedStartPath)
  Transforms.insertNodes(editor, newNode, {
    at: [selectedStartPath[0]],
  })
  Transforms.select(editor, selectedStartPath)
}
