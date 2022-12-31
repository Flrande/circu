import { useCallback } from "react"
import { Editor, Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import { decreaseIndent, increaseIndent } from "../components/Nodes/Block/BlockWrapper/indentHelper"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../types/constant"
import { SlateElement } from "../types/slate"
import { arrayIncludes } from "../utils/general"
import { getSelectedBlocks } from "../components/Nodes/Block/utils/getSelectedBlocks"
import { toggleTaskList } from "../components/Nodes/Block/TaskList/taskListHelper"

export const useOnKeyDown = () => {
  const editor = useSlateStatic()

  return useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    // 在代码块中要通过 Ctrl + ArrowLeft 来减少缩进, 通过 Ctrl + ArrowRight 来增加缩进
    if (event.ctrlKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault()
      if (editor.selection) {
        const selectedBlocks = getSelectedBlocks(editor, {
          range: editor.selection,
        })
        if (selectedBlocks.length !== 0 && selectedBlocks[0][0].type === "block-code") {
          if (event.key === "ArrowLeft") {
            decreaseIndent(editor)
          } else if (event.key === "ArrowRight") {
            increaseIndent(editor)
          }

          Transforms.select(editor, editor.selection)
          ReactEditor.focus(editor)
          return
        }
      }
    }

    if (event.key === "Tab") {
      event.preventDefault()
      if (editor.selection) {
        const selectedBlocks = getSelectedBlocks(editor, {
          range: editor.selection,
        })
        if (selectedBlocks.length !== 0 && selectedBlocks[0][0].type === "block-code") {
          // 在代码块中按下 Tab 时, 不会调整块级节点的缩进, 而是插入4个空格
          Transforms.insertText(editor, "    ")
          return
        }

        if (event.shiftKey) {
          decreaseIndent(editor)
        } else {
          increaseIndent(editor)
        }
        return
      }
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
      // const selectedBlocksEntry = Array.from(
      //   Editor.nodes(editor, {
      //     at: selection.anchor,
      //     match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
      //     mode: "lowest",
      //   })
      // ) as NodeEntry<BlockElementWithChildren>[]
      // Transforms.insertNodes(
      //   editor,
      //   {
      //     type: "divider",
      //     children: [{ text: "" }],
      //   },
      //   {
      //     at: selectedBlocksEntry[0][1],
      //   }
      // )
      toggleTaskList(editor)

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
