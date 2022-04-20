import type React from "react"
import { useSlate } from "slate-react"
import { toggleLink } from "../components/Nodes/Inline/Link/linkHelper"

export const useOnKeyDown = () => {
  const editor = useSlate()

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    // for debug and develop
    if (event.altKey && event.key === "q") {
      // console.log(editor.selection?.anchor)
      if (editor.selection) {
        toggleLink(editor, "http://www.google.com")
      }
    }
    if (event.altKey && event.key === "w") {
      if (editor.selection) {
        toggleLink(editor, "http://www.baidu.com")
      }
    }
  }

  return onKeyDown
}
