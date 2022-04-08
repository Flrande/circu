import type React from "react"
import { Editor } from "slate"
import { useSlate } from "slate-react"
import { SlateElement } from "../types/slate"

export const useOnKeyDown = () => {
  const editor = useSlate()

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    // for debug and develop
    if (event.altKey && event.key === "q") {
      console.log(editor.selection?.anchor)
    }
    if (event.altKey && event.key === "w") {
      if (editor.selection) {
        const selectedNodes = Array.from(
          Editor.nodes(editor, {
            match: (n) => SlateElement.isElement(n),
          })
        ).map((item) => item[0])
        console.log(selectedNodes)
      }
    }
  }

  return onKeyDown
}
