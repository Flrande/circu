import type React from "react"
import { Editor, Range, Transforms, Element as SlateElement, Node } from "slate"
import { ReactEditor, useSlate } from "slate-react"

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
      console.log(editor.selection, window.getSelection())
      console.log(Range.includes(editor.selection!, [1, 2]))
    }
    if (event.altKey && event.key === "w") {
      if (editor.selection) {
        console.log(
          editor.selection,
          Editor.node(editor, editor.selection, {
            depth: 1,
          }),
          Range.edges(editor.selection),
          ReactEditor.isFocused(editor)
        )
      }
    }
  }

  return onKeyDown
}
