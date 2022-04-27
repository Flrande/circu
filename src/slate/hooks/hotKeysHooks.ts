import type React from "react"
import { useSlate } from "slate-react"
import { toggleList } from "../components/Nodes/Block/List/listHelper"
import { toggleLink } from "../components/Nodes/Inline/Link/linkHelper"

export const useOnKeyDown = () => {
  const editor = useSlate()

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    // for debug and develop
    if (event.altKey && event.key === "q") {
      // console.log(editor.selection?.anchor)
      toggleList(editor, "ordered")
    }
    if (event.altKey && event.key === "w") {
      // if (editor.selection) {
      //   toggleLink(editor, "http://www.baidu.com")
      // }
      toggleList(editor, "unordered")
    }
  }

  return onKeyDown
}
