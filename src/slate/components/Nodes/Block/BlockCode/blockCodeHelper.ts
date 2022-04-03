import { Editor, Transforms } from "slate"
import { SlateElement, SlateRange } from "../../../../types/slate"
import type { ParagraphType } from "../Paragraph/types"
import type { BlockCodeType, BlockCode_CodeLineType } from "./types"

//TODO: 行首直接添加一个空代码块 (需要新的toolbar?)
//TODO: 粘贴
export const toggleBlockCode = (editor: Editor) => {
  if (!editor.selection) {
    console.error("toggleBlockCode() need editor.selection.")
    return
  }

  const selectedParagraphNodes = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "paragraph",
    })
  ).map((item) => item[0]) as ParagraphType[]

  const newNodeChildren: BlockCode_CodeLineType[] = selectedParagraphNodes.map<BlockCode_CodeLineType>((item) => {
    return {
      type: "blockCode_codeLine",
      children: item.children,
    }
  })
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
        children: newNodeChildren,
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
