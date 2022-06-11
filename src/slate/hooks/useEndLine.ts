import { useEffect } from "react"
import { Transforms } from "slate"
import { useSlateStatic } from "slate-react"
import type { IParagraph } from "../components/Nodes/Block/Paragraph/types"
import type { SlateElement } from "../types/slate"

export const useEndLine = () => {
  const editor = useSlateStatic()
  const lastChild = editor.children[editor.children.length - 1] as SlateElement

  useEffect(() => {
    if (lastChild.type !== "paragraph") {
      const blankLineNode: IParagraph = {
        type: "paragraph",
        children: [
          {
            type: "__block-element-content",
            children: [
              {
                type: "text-line",
                children: [
                  {
                    text: "",
                  },
                ],
              },
            ],
          },
          {
            type: "__block-element-children",
            children: [],
          },
        ],
      }
      Transforms.insertNodes(editor, blankLineNode, {
        at: [editor.children.length],
      })
    }
  })
}
