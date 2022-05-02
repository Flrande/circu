import { useEffect } from "react"
import { Transforms } from "slate"
import { useSlate } from "slate-react"
import type { IParagraph } from "../components/Nodes/Block/Paragraph/types"
import type { SlateElement } from "../types/slate"

export const useEndLine = () => {
  const editor = useSlate()
  const lastChild = editor.children[editor.children.length - 1] as SlateElement

  useEffect(() => {
    if (lastChild.type !== "paragraph") {
      const blankLineNode: IParagraph = {
        type: "paragraph",
        indentLevel: 1,
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
