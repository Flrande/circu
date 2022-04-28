import type React from "react"
import { Editor } from "slate"
import { useSlate } from "slate-react"
import { toggleList } from "../components/Nodes/Block/List/listHelper"
import { useListLineFeed } from "../components/Nodes/Block/List/useListLineFeed"
import { SlateElement } from "../types/slate"

export const useOnKeyDown = () => {
  const editor = useSlate()

  const listLineFeedHandler = useListLineFeed()

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === "Enter") {
      const selectedNodes = Array.from(
        Editor.nodes(editor, {
          match: (n) => SlateElement.isElement(n),
        })
      ).map(([node]) => node) as SlateElement[]

      if (selectedNodes.every((node) => node.type === "list")) {
        event.preventDefault()
        listLineFeedHandler()
        return
      }
    }

    // for debug and develop
    if (event.altKey && event.key === "q") {
      // console.log(editor.selection?.anchor)
      toggleList(editor, "ordered")
    }
    if (event.altKey && event.key === "w") {
      // if (editor.selection) {
      //   toggleLink(editor, "http://www.baidu.com")
      // }
      // console.log(editor.selection?.anchor)
      toggleList(editor, "unordered")
    }
  }

  return onKeyDown
}
