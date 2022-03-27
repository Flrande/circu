import { Editor, Transforms } from "slate"
import { SlateElement, SlateRange } from "../../../../types/slate"
import type { ParagraphType } from "../Paragraph/types"
import type { BlockCodeType } from "./types"

// export const isBlockCodeActive = (editor: Editor) => {
//   const { selection } = editor
//   if (!selection) return false

//   const match = Array.from(
//     Editor.nodes(editor, {
//       match: (n) => SlateElement.isElement(n) && n.type === "blockCode",
//     })
//   )

//   return match.length > 0 ? true : false
// }

//TODO: 解除代码块
export const unToggleBlockCode = (editor: Editor) => {}

//TODO: 直接添加一个空代码块(需要新的toolbar?)
//TODO: 粘贴和复制
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
      match: (n) => SlateElement.isElement(n) && n.type === "paragraph",
    })
  ).map((item) => item[0]) as ParagraphType[]

  // children 必须遵循 paragraph - codeArea - paragraph
  const newNode: BlockCodeType = {
    type: "blockCode",
    children: [
      {
        type: "blockCode_voidArea",
        children: [
          {
            text: "",
          },
        ],
      },
      {
        type: "blockCode_codeArea",
        lang: "PlainText",
        children: selectedParagraphNodes,
      },
      {
        type: "blockCode_voidArea",
        children: [
          {
            text: "",
          },
        ],
      },
    ],
  }

  const selectedStartPath = SlateRange.start(editor.selection).path
  Transforms.removeNodes(editor)
  Transforms.insertNodes(editor, newNode, {
    at: [selectedStartPath[0]],
  })
  Transforms.select(editor, Editor.end(editor, [selectedStartPath[0], 1]))
}
