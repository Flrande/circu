import type React from "react"
import { Editor } from "slate"
import { useSlate } from "slate-react"
import { toggleOrderedList, toggleUnorderedList } from "../components/Nodes/Block/List/listHelper"
import { orderedListLineBreakHandler } from "../components/Nodes/Block/List/listLineBreakHandler"
import { switchListLevel } from "../components/Nodes/Block/List/switchListLevel"
import { switchParagraphLevel } from "../components/Nodes/Block/Paragraph/switchParagraphLevel"
import { PARAGRAPH_TYPE_ELEMENTS } from "../types/constant"
import type { ParagraphTypeElement } from "../types/interface"
import { SlateElement } from "../types/slate"
import { arrayIncludes } from "../utils/general"

export const useOnKeyDown = () => {
  const editor = useSlate()

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    // 选中的段落型元素
    const selectedParagraphTypeNodes = Array.from(
      Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && arrayIncludes(PARAGRAPH_TYPE_ELEMENTS, n.type),
      })
    ).map(([node]) => node) as ParagraphTypeElement[]

    if (event.key === "Enter") {
      if (selectedParagraphTypeNodes.every((node) => node.type === "orderedList")) {
        event.preventDefault()
        orderedListLineBreakHandler(editor)
        return
      }
    }

    if (event.key === "Tab") {
      event.preventDefault()
      if (event.shiftKey) {
        switchListLevel(editor, "decrease")
        switchParagraphLevel(editor, "decrease")
        return
      }
      switchListLevel(editor, "increase")
      switchParagraphLevel(editor, "increase")
      return
    }

    // --------------------------------------------------
    // for debug and develop
    if (event.altKey && event.key === "q") {
      // console.log(editor.selection?.anchor)
      toggleOrderedList(editor)
      return
    }
    if (event.altKey && event.key === "w") {
      // if (editor.selection) {
      //   toggleLink(editor, "http://www.baidu.com")
      // }
      // console.log(editor.selection?.anchor)
      toggleUnorderedList(editor)
      return
    }
    // --------------------------------------------------
  }

  return onKeyDown
}
