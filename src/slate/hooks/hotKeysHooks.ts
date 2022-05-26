import type React from "react"
import { useCallback } from "react"
import { Editor, Transforms } from "slate"
import { useSlateStatic } from "slate-react"
import { toggleHead } from "../components/Nodes/Block/Head/headHelper"
import { toggleUnorderedList } from "../components/Nodes/Block/List/listHelper"
import { orderedListLineBreakHandler } from "../components/Nodes/Block/List/listLineBreakHandler"
import { switchListLevel } from "../components/Nodes/Block/List/switchListLevel"
import { switchParagraphLevel } from "../components/Nodes/Block/Paragraph/switchParagraphLevel"
import { toggleQuote } from "../components/Nodes/Block/Quote/quoteHelper"
import { splitQuote } from "../components/Nodes/Block/Quote/splitQuote"
import { toggleMark } from "../components/Nodes/Text/textHelper"
import { PARAGRAPH_TYPE_ELEMENTS } from "../types/constant"
import type { ParagraphTypeElement } from "../types/interface"
import { SlateElement } from "../types/slate"
import { arrayIncludes } from "../utils/general"

export const useOnKeyDown = () => {
  const editor = useSlateStatic()

  return useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
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
      // console.log(window.getSelection(), editor.selection)
      // toggleQuote(editor)
      // Transforms.splitNodes(editor, {
      //   match: (n) => SlateElement.isElement(n) && n.type === "quote"
      // })
      splitQuote(editor, editor.selection!)
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
  }, [])
}
