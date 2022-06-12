import type React from "react"
import { useCallback } from "react"
import { Editor, Path } from "slate"
import { Editable, useSlateStatic } from "slate-react"
import { toggleBlockCode } from "../components/Nodes/Block/BlockCode/blockCodeHelper"
import { toggleIndent, unToggleIndent } from "../components/Nodes/Block/BlockWrapper/indentHelper"
import { toggleHead } from "../components/Nodes/Block/Head/headHelper"
import { toggleUnorderedList } from "../components/Nodes/Block/List/listHelper"
import { BLOCK_ELEMENTS_WITHOUT_TEXT_LINE } from "../types/constant"
import { SlateElement } from "../types/slate"
import { arrayIncludes } from "../utils/general"

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
      // toggleBlockCode(editor)
      // toggleHead(editor, "1")
      toggleIndent(editor)
      return
    }
    if (event.altKey && event.key === "w") {
      if (!editor.selection) {
        return
      }
      unToggleIndent(editor)
      return
    }
    // --------------------------------------------------
  }, [])
}
