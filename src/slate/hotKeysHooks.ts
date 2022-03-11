import type React from "react"
import { Editor, Range, Transforms } from "slate"
import { useSlate } from "slate-react"
import { toggleBlockCode } from "./components/Nodes/Block/BlockCode/blockCodeWorker"

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
    if (selection && Range.isCollapsed(selection)) {
      leftRightHandler(event, editor)
    }

    // for debug and develop
    if (event.altKey && event.key === "q") {
      console.log(editor.selection?.anchor, editor.selection?.focus)
    }
    if (event.altKey && event.key === "w") {
      console.log(window.getSelection(), editor.selection?.anchor, editor.selection?.focus)
      toggleBlockCode(editor)
      const event = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
      })
      window.getSelection()?.anchorNode?.parentElement?.dispatchEvent(event)
    }
  }

  return onKeyDown
}
