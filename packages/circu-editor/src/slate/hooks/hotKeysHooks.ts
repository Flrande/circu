import type React from "react"
import { useCallback } from "react"
import { Editor, NodeEntry, Transforms } from "slate"
import { useSlateStatic } from "slate-react"
import { decreaseIndent, increaseIndent } from "../components/Nodes/Block/BlockWrapper/indentHelper"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../types/constant"
import { SlateElement } from "../types/slate"
import { arrayIncludes } from "../utils/general"
import { getSelectedBlocks } from "../components/Nodes/Block/utils/getSelectedBlocks"
import type { BlockElementWithChildren } from "../types/interface"

export const useOnKeyDown = () => {
  const editor = useSlateStatic()

  return useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") {
      event.preventDefault()
      if (event.shiftKey) {
        decreaseIndent(editor)
      } else {
        increaseIndent(editor)
      }
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
      // toggleUnorderedList(editor)
      // Editor.withoutNormalizing(editor, () => {
      //   decreaseIndent(editor)
      // })
      const selectedBlocksEntry = Array.from(
        Editor.nodes(editor, {
          at: selection.anchor,
          match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
          mode: "lowest",
        })
      ) as NodeEntry<BlockElementWithChildren>[]
      Transforms.insertNodes(
        editor,
        {
          type: "divider",
          children: [{ text: "" }],
        },
        {
          at: selectedBlocksEntry[0][1],
        }
      )

      return
    }
    if (event.altKey && event.key === "w") {
      const { selection } = editor
      if (!selection) {
        return
      }

      // toggleOrderedList(editor)
      // toggleQuote(editor)
      // Transforms.liftNodes(editor, {
      //   match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
      // })
      // debugger
      // const selectedBlocksEntry = Array.from(
      //   Editor.nodes(editor, {
      //     at: selection.anchor,
      //     match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
      //     mode: "lowest",
      //   })
      // ) as NodeEntry<BlockElementWithChildren>[]
      // unToggleFold(editor, selectedBlocksEntry[0][1])
      console.log(
        Array.from(
          Editor.nodes(editor, {
            match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
          })
        ).map(([node, path]) => path)
      )
      console.log(getSelectedBlocks(editor).map(([node, path]) => path))

      return
    }
    // --------------------------------------------------
  }, [])
}
