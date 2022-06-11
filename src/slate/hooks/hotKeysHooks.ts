import type React from "react"
import { useCallback } from "react"
import { useSlateStatic } from "slate-react"
import { toggleBlockCode } from "../components/Nodes/Block/BlockCode/blockCodeHelper"
import { toggleHead } from "../components/Nodes/Block/Head/headHelper"
import { toggleUnorderedList } from "../components/Nodes/Block/List/listHelper"

export const useOnKeyDown = () => {
  const editor = useSlateStatic()

  return useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    // 选中的段落型元素
    // const selectedParagraphTypeNodes = Array.from(
    //   Editor.nodes(editor, {
    //     match: (n) => SlateElement.isElement(n) && arrayIncludes(PARAGRAPH_TYPE_ELEMENTS, n.type),
    //   })
    // ).map(([node]) => node) as ParagraphTypeElement[]

    if (event.key === "Enter") {
      // if (selectedParagraphTypeNodes.every((node) => node.type === "orderedList")) {
      //   event.preventDefault()
      //   orderedListLineBreakHandler(editor)
      //   return
      // }
    }

    if (event.key === "Tab") {
      event.preventDefault()
      // if (event.shiftKey) {
      //   switchListLevel(editor, "decrease")
      //   switchParagraphLevel(editor, "decrease")
      //   return
      // }
      // switchListLevel(editor, "increase")
      // switchParagraphLevel(editor, "increase")
      return
    }

    // --------------------------------------------------
    // for debug and develop
    if (event.altKey && event.key === "q") {
      // console.log(window.getSelection(), editor.selection)
      toggleBlockCode(editor)
      // toggleHead(editor, "1")
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
