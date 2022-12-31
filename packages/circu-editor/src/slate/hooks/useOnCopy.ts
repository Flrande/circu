import { useCallback } from "react"
import { Editor, Path } from "slate"
import { useSlateStatic } from "slate-react"
import { SlateElement, SlateNode, SlateRange } from "../types/slate"

//TODO: 转化为 Markdown 格式
export const useOnCopy = () => {
  const editor = useSlateStatic()

  return useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    let str = ""

    if (editor.selection) {
      const nodeEntryArr = Array.from(
        Editor.nodes(editor, {
          match: (n) => SlateElement.isElement(n) && n.type === "text-line",
        })
      )

      if (nodeEntryArr.length === 1) {
        const [startPoint, endPoint] = SlateRange.edges(editor.selection)
        str = SlateNode.string(nodeEntryArr[0][0]).slice(startPoint.offset, endPoint.offset)
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
  }, [])
}
