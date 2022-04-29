import type React from "react"
import { Editor } from "slate"
import { useSlate } from "slate-react"
import { toggleOrderedList } from "../components/Nodes/Block/List/listHelper"
import { orderedListLineBreakHandler } from "../components/Nodes/Block/List/listLineBreakHandler"
import { PARAGRAPH_TYPE_ELEMENTS } from "../types/constant"
import type { ParagraphTypeElement } from "../types/interface"
import { SlateElement } from "../types/slate"
import { arrayIncludes } from "../utils/general"

export const useOnKeyDown = () => {
  const editor = useSlate()

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === "Enter") {
      const selectedParagraphNodes = Array.from(
        Editor.nodes(editor, {
          match: (n) => SlateElement.isElement(n) && arrayIncludes(PARAGRAPH_TYPE_ELEMENTS, n.type),
        })
      ).map(([node]) => node) as ParagraphTypeElement[]

      if (selectedParagraphNodes.every((node) => node.type === "orderedList")) {
        event.preventDefault()
        orderedListLineBreakHandler(editor)
        return
      }
    }

    // --------------------------------------------------
    // for debug and develop
    if (event.altKey && event.key === "q") {
      // console.log(editor.selection?.anchor)
      toggleOrderedList(editor)
    }
    if (event.altKey && event.key === "w") {
      // if (editor.selection) {
      //   toggleLink(editor, "http://www.baidu.com")
      // }
      // console.log(editor.selection?.anchor)
    }
    // --------------------------------------------------
  }

  return onKeyDown
}
