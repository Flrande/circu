import { useEffect } from "react"
import { Editor, NodeEntry, Transforms } from "slate"
import { useSlateStatic } from "slate-react"
import type { IHead } from "../components/Nodes/Block/Head/types"
import type { IParagraph } from "../components/Nodes/Block/Paragraph/types"
import { SlateElement } from "../types/slate"

export const useEndLine = () => {
  const editor = useSlateStatic()
  const lastChild = editor.children[editor.children.length - 1] as SlateElement

  useEffect(() => {
    if (editor.children.length > 1 && lastChild.type !== "paragraph") {
      // 如果最后一个标题为折叠状态, 不添加新行
      const previousHeads = Array.from(
        Editor.nodes(editor, {
          at: [],
          match: (n, p) => SlateElement.isElement(n) && n.type === "head" && p.length === 1,
        })
      ) as NodeEntry<IHead>[]
      if (previousHeads.length > 0 && previousHeads.at(-1)![0].isFolded) {
        return
      }

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
        ],
      }
      Transforms.insertNodes(editor, blankLineNode, {
        at: [editor.children.length],
      })
    }
  })
}
