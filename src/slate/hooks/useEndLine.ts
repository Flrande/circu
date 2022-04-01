import { useEffect } from "react"
import { Transforms } from "slate"
import { useSlate } from "slate-react"
import type { ParagraphType } from "../components/Nodes/Block/Paragraph/types"
import type { SlateElement } from "../types/slate"

export const useEndLine = () => {
  const editor = useSlate()
  const lastChild = editor.children[editor.children.length - 1] as SlateElement

  useEffect(() => {
    if (lastChild.type !== "paragraph") {
      const blankLineNode: ParagraphType = {
        type: "paragraph",
        children: [
          {
            text: "",
          },
        ],
      }
      Transforms.insertNodes(editor, blankLineNode, {
        at: [editor.children.length],
      })
    }
  })
}
