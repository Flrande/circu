import type React from "react"
import { Editor, Transforms } from "slate"
import { useSlate } from "slate-react"
import { SlateRange } from "../types/slate"

const leftRightHandler = (event: React.KeyboardEvent, editor: Editor) => {
  const { code } = event

  if (code === "ArrowLeft") {
    event.preventDefault()
    Transforms.move(editor, { unit: "offset", reverse: true })
    return
  }
  if (code === "ArrowRight") {
    event.preventDefault()
    Transforms.move(editor, { unit: "offset" })
    return
  }
}

export const useOnKeyDown = () => {
  const editor = useSlate()
  const { selection } = editor

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    if (selection && SlateRange.isCollapsed(selection)) {
      leftRightHandler(event, editor)
    }

    // for debug and develop
    if (event.altKey && event.key === "q") {
      // console.log(editor.selection, window.getSelection())
      console.log(editor.children)
    }
    if (event.altKey && event.key === "w") {
      if (editor.selection) {
        const blockNodeEntry = Editor.node(editor, editor.selection, {
          depth: 1,
        })
        console.log(blockNodeEntry[1])
        Transforms.select(editor, blockNodeEntry[1])
      }
    }
  }

  return onKeyDown
}
