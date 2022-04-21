import { Editor, Path } from "slate"
import { useSlate } from "slate-react"
import { SlateElement, SlateNode, SlateRange } from "../types/slate"

//TODO: 转化为 Markdown 格式
export const useOnCopy = () => {
  const editor = useSlate()
  const onCopy: React.ClipboardEventHandler<HTMLDivElement> = (event) => {
    let str = ""

    if (editor.selection) {
      const nodeEntryArr = Array.from(
        Editor.nodes(editor, {
          match: (n) => SlateElement.isElement(n) && (n.type === "paragraph" || n.type === "blockCode_codeLine"),
        })
      )

      if (nodeEntryArr.length === 1) {
        str = SlateNode.string(nodeEntryArr[0][0])
      } else {
        const [startPoint, endPoint] = SlateRange.edges(editor.selection)
        const startText = SlateNode.string(nodeEntryArr[0][0]).slice(startPoint.offset)
        const endText = SlateNode.string(nodeEntryArr[nodeEntryArr.length - 1][0]).slice(0, endPoint.offset)

        str = str.concat(`${startText}\n`)
        nodeEntryArr.map((item) => {
          if (!(Path.isChild(startPoint.path, item[1]) || Path.isChild(endPoint.path, item[1]))) {
            str = str.concat(`${SlateNode.string(item[0])}\n`)
          }
        })
        str = str.concat(`${endText}`)
      }
    }

    event.clipboardData.setData("text/plain", str)
    event.preventDefault()
  }

  return onCopy
}
