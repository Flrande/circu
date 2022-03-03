import type React from "react"
import { Editor, Range, Transforms } from "slate"
import { useSlate } from "slate-react"
import { toggleInlineCode } from "./components/Inline/InlineCode/codeWorker"
import { toggleMark } from "./components/Text/TextWorker"

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

const toggler = (event: React.KeyboardEvent, editor: Editor) => {
  if (!event.altKey) return

  switch (event.key) {
    case "q":
    case "Q":
      event.preventDefault()
      toggleInlineCode(editor)
      break
    case "w":
    case "W":
      event.preventDefault()
      toggleMark(editor, "bold")
      break
  }
}

export const useOnKeyDown = () => {
  const editor = useSlate()
  const { selection } = editor

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    if (selection && Range.isCollapsed(selection)) {
      leftRightHandler(event, editor)
    }
    toggler(event, editor)
  }

  return onKeyDown
}
