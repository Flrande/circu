import { Editor } from "slate"
import { useSlate } from "slate-react"
import { SlateElement, SlateNode } from "../types/slate"

export const useOnCopy = () => {
  const editor = useSlate()
  const onCopy: React.ClipboardEventHandler<HTMLDivElement> = (event) => {
    let str = ""
    if (editor.selection) {
      const nodes = Array.from(
        Editor.nodes(editor, {
          at: editor.selection,
          match: (n) => SlateElement.isElement(n) && (n.type === "paragraph" || n.type === "blockCode_codeLine"),
        })
      )
      nodes.map((item) => {
        str = str.concat(`${SlateNode.string(item[0])}\n`)
      })
    }

    event.clipboardData.setData("text/plain", str)
    event.preventDefault()
  }

  return onCopy
}
