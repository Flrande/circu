import type React from "react"
import { useCallback } from "react"
import { Editor, NodeEntry, Path } from "slate"
import { Editable, useSlateStatic } from "slate-react"
import { toggleBlockCode } from "../components/Nodes/Block/BlockCode/blockCodeHelper"
import {
  calculateIndentLevel,
  decreaseIndent,
  increaseIndent,
} from "../components/Nodes/Block/BlockWrapper/indentHelper"
import { toggleHead } from "../components/Nodes/Block/Head/headHelper"
import { toggleOrderedList, toggleUnorderedList } from "../components/Nodes/Block/List/listHelper"
import { toggleQuote } from "../components/Nodes/Block/Quote/quoteHelper"
import { getSelectedBlocks } from "../components/Nodes/Block/utils/getSelectedBlocks"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../types/constant"
import type { BlockElementExceptTextLine } from "../types/interface"
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
      if (event.shiftKey) {
        decreaseIndent(editor)
      } else {
        increaseIndent(editor)
      }
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
      const { selection } = editor
      if (!selection) {
        return
      }

      // console.log(window.getSelection(), editor.selection)
      // toggleBlockCode(editor)
      toggleUnorderedList(editor)

      return
    }
    if (event.altKey && event.key === "w") {
      const { selection } = editor
      if (!selection) {
        return
      }

      // toggleOrderedList(editor)
      toggleQuote(editor)

      return
    }
    // --------------------------------------------------
  }, [])
}
