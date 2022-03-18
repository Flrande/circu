import { useEffect } from "react"
import { Element, Transforms } from "slate"
import { useSlate } from "slate-react"
import type { ParagraphType } from "../components/Nodes/Block/Paragraph/types"

export const useEndLine = () => {
  const editor = useSlate()
  const lastChild = editor.children[editor.children.length - 1] as Element

  useEffect(() => {
    if (lastChild.type !== "paragraph") {
      const blankLineNode: ParagraphType = {
        type: "paragraph",
        children: [
          {
            text: "",
          },
        ],
        isVoid: false,
      }
      Transforms.insertNodes(editor, blankLineNode, {
        at: [editor.children.length],
      })
    }
  })
}
